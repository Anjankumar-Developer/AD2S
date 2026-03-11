import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/detect', label: 'Detect' },
    { path: '/analytics', label: 'Analytics' },
]

export default function Navbar() {
    const location = useLocation()

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 rounded-t-none"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-minimal-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span className="font-display text-lg font-bold tracking-wider text-minimal-text">
                        SENTRY<span className="text-minimal-text-muted">.AI</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="relative px-5 py-2 transition-all duration-300 group"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-minimal-accent"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span
                                    className={`relative z-10 font-display text-sm font-semibold tracking-wider transition-colors ${isActive ? 'text-minimal-text' : 'text-minimal-text-muted group-hover:text-minimal-text'
                                        }`}
                                >
                                    {link.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full status-indicator-success" />
                    <span className="text-xs font-mono font-bold text-minimal-text-muted shrink-0">ONLINE</span>
                </div>
            </div>
        </motion.nav>
    )
}
