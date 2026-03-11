You are a senior AI engineer, ML architect, and full-stack developer.

Your task is to convert an existing GitHub repository into a complete production-ready AI application.

PROJECT NAME
SENTRY AI Profiler

CURRENT REPOSITORY STRUCTURE

data/
fusers.csv
users.csv

html/
Neural Network.html
Random Forest.html
Support Vector Machine.html

pdf/
Neural_Network.pdf
RandomForest.pdf
SVM.pdf

Neural Network.ipynb
Neural Network.py
Random Forest.ipynb
Random Forest.py
Support Vector Machine.ipynb
Support Vector Machine.py
README.md
requirement

These files contain machine learning experiments that detect fake social media profiles.

Your job is to transform this repository into a complete AI system.

CRITICAL RULES

• Do not delete the dataset files
• Reuse logic from existing ML scripts
• Remove unnecessary notebooks
• Do not hardcode paths or values
• All configuration must use environment variables
• Code must be modular and production ready
• Everything must run end-to-end without errors

TECH STACK

Frontend
React
Vite
TypeScript
TailwindCSS
Framer Motion
React Three Fiber
Axios
React Query

Backend
Python
FastAPI
Pydantic
Scikit-learn
Joblib

Database
SQLite or PostgreSQL (optional but supported)

CONFIGURATION
.env based configuration

PROJECT GOALS

The final application should allow a user to input social media profile data and determine whether the profile is fake or genuine using machine learning.

SYSTEM COMPONENTS

1 Machine Learning Pipeline
2 Backend Prediction API
3 Animated Web UI
4 Prediction History
5 Analytics Dashboard

STEP 1 — RESTRUCTURE THE PROJECT

Convert the repository into the following architecture

fake-profile-ai/

data/
users.csv
fusers.csv

ml/
preprocessing.py
train_model.py
evaluate_model.py

models/
fake_profile_model.pkl

backend/
main.py
predictor.py
schemas.py
config.py
services/

frontend/
src/
components/
pages/
animations/

configs/
.env.example

requirements.txt

STEP 2 — MACHINE LEARNING PIPELINE

Use the existing ML scripts

Random Forest.py
Support Vector Machine.py
Neural Network.py

Create a clean training pipeline.

Tasks

• merge datasets users.csv and fusers.csv
• create labels for fake and real accounts
• perform preprocessing and feature engineering
• split dataset into training and testing sets

Train the following models

Random Forest
Support Vector Machine
Neural Network

Automatically select the best model based on accuracy.

Save the trained model to

models/fake_profile_model.pkl

Add evaluation metrics

accuracy
precision
recall
confusion matrix

STEP 3 — BACKEND API

Create a FastAPI backend.

Backend responsibilities

• load trained model
• expose REST API endpoints
• perform predictions
• validate request inputs

Required endpoints

GET /health
POST /predict
GET /predictions
GET /model-metrics

Prediction endpoint should accept profile features and return

fake profile or real profile.

Use Pydantic schemas for request validation.

Add logging and error handling.

STEP 4 — EXTRAORDINARY FRONTEND UI

Create a futuristic AI dashboard style UI.

Technology

React
Vite
TypeScript
TailwindCSS
Framer Motion
React Three Fiber

STRICT DESIGN RULE

Do not use purple or violet anywhere.

Allowed color palette

black
dark gray
cyan
electric blue
neon green
white accents

UI inspiration

AI cybersecurity command center
futuristic monitoring system
AI analytics dashboard

PAGES REQUIRED

Landing page
SENTRY Analysis page
Analytics dashboard

ANIMATIONS REQUIRED

animated particle background
3D floating elements
hover glow effects
card tilt animations
button pulse animations
scroll reveal animations
smooth page transitions

Prediction results should appear with animated feedback

green glow for real profile
red glow for fake profile

STEP 5 — ANALYTICS DASHBOARD

Create an analytics dashboard showing

model accuracy
prediction statistics
fake vs real distribution

Use animated charts

Chart.js or Recharts

STEP 6 — CONFIGURATION SYSTEM

Add .env based configuration.

Variables should include

MODEL_PATH
API_PORT
DATABASE_URL

No hardcoded values should exist anywhere.

STEP 7 — FINAL RESULT

The final system must allow

• training the ML model
• starting the FastAPI backend
• opening the animated frontend
• submitting profile data
• receiving fake or real prediction

Everything must run successfully without manual code fixes.

Generate the entire project with complete code.
