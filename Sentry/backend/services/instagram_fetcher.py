"""
Instagram profile fetcher service.
Fetches public profile data from Instagram and maps it to the ML model input format.
Uses instaloader for public profile access (no login required for public profiles).
Optional: Set INSTAGRAM_USER and INSTAGRAM_PASSWORD in .env for better reliability
if Instagram restricts unauthenticated access.
"""

import os
import re
import logging

from backend.schemas import ProfileInput

logger = logging.getLogger(__name__)


def extract_username_from_input(input_str: str) -> str:
    """
    Extract Instagram username from various input formats:
    - Plain username: johndoe
    - URL: https://www.instagram.com/johndoe/
    - URL: instagram.com/johndoe
    - @username: @johndoe
    """
    if not input_str or not input_str.strip():
        return ""
    s = input_str.strip()
    # Remove @ prefix
    if s.startswith("@"):
        s = s[1:]
    # Extract from URL
    match = re.search(
        r"(?:instagram\.com/|instagr\.am/)([a-zA-Z0-9._]+)",
        s,
        re.IGNORECASE,
    )
    if match:
        return match.group(1).rstrip("/")
    # Assume it's a plain username
    return s.split()[0] if s else ""


def fetch_profile_from_instagram(username: str) -> ProfileInput:
    """
    Fetch profile data from Instagram and convert to ProfileInput for the ML model.
    Maps Instagram metrics to the Twitter-style features the model was trained on.
    """
    try:
        import instaloader
    except ImportError:
        raise RuntimeError(
            "instaloader package not installed. Run: pip install instaloader"
        )

    clean_username = extract_username_from_input(username)
    if not clean_username:
        raise ValueError("Invalid or empty Instagram username")

    L = instaloader.Instaloader(
        quiet=True,
        download_pictures=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
    )
    L.download_video_thumbnails = False
    L.download_geotags = False
    L.download_videos = False

    # Optional login for better reliability (Instagram may restrict anonymous access)
    ig_user = os.environ.get("INSTAGRAM_USER", "").strip()
    ig_pass = os.environ.get("INSTAGRAM_PASSWORD", "").strip()
    if ig_user and ig_pass:
        try:
            L.login(ig_user, ig_pass)
            logger.info("Instagram session logged in for profile fetch")
        except Exception as e:
            logger.warning(f"Instagram login failed, continuing without auth: {e}")

    try:
        profile = instaloader.Profile.from_username(L.context, clean_username)
    except Exception as e:
        err_msg = str(e).lower()
        if "not found" in err_msg or "does not exist" in err_msg:
            raise ValueError(f"Instagram profile '@{clean_username}' not found")
        if "private" in err_msg or "login" in err_msg:
            raise ValueError(
                f"Profile '@{clean_username}' is private. Only public profiles can be analyzed."
            )
        raise RuntimeError(f"Failed to fetch Instagram profile: {e}")

    # Map Instagram profile to model input
    # Instagram: followers, followees, biography, external_url, full_name, username
    # Model expects: statuses_count, followers_count, friends_count, favourites_count,
    #                listed_count, lang, name, screen_name, has_description, has_url, has_location
    followers = getattr(profile, "followers", 0) or 0
    followees = getattr(profile, "followees", 0) or 0

    # mediacount: post count - may exist on Profile in some instaloader versions
    mediacount = 0
    try:
        mediacount = getattr(profile, "mediacount", 0) or 0
    except Exception:
        pass

    biography = getattr(profile, "biography", "") or ""
    external_url = getattr(profile, "external_url", None)
    full_name = getattr(profile, "full_name", "") or ""
    username_val = getattr(profile, "username", clean_username) or clean_username

    # has_location: Instagram removed profile location in 2019; check if bio mentions a place
    has_location = bool(
        re.search(
            r"\b(city|country|location|based in|from|live in|🇺🇸|🇬🇧|🇮🇳)\b",
            biography,
            re.IGNORECASE,
        )
    )

    return ProfileInput(
        statuses_count=max(0, mediacount),
        followers_count=max(0, followers),
        friends_count=max(0, followees),
        favourites_count=0,  # Instagram doesn't expose "likes given" publicly
        listed_count=0,  # Instagram has no equivalent
        lang="en",  # Default; could detect from bio with langdetect if needed
        name=full_name,
        screen_name=username_val,
        has_description=bool(biography.strip()),
        has_url=bool(external_url and str(external_url).strip()),
        has_location=has_location,
    )
