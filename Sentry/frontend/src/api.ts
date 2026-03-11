import axios from 'axios';

// In production the frontend is served from the same origin as the API.
// In development the Vite proxy (vite.config.ts) forwards /api → localhost:8000.
const API_BASE = '';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 45000, // Longer for Instagram fetch + prediction
    headers: { 'Content-Type': 'application/json' },
});

export interface ProfileInput {
    statuses_count: number;
    followers_count: number;
    friends_count: number;
    favourites_count: number;
    listed_count: number;
    lang: string;
    name: string;
    screen_name: string;
    has_description: boolean;
    has_url: boolean;
    has_location: boolean;
}

export interface PredictionResponse {
    prediction: string;
    confidence: number;
    risk_score: number;
    timestamp: string;
    input_data: ProfileInput;
    model_name: string;
}

export interface PredictionHistoryItem {
    id: number;
    prediction: string;
    confidence: number;
    risk_score: number;
    timestamp: string;
    input_summary: string;
}

export interface ModelMetrics {
    best_model: string;
    feature_names: string[];
    models: Record<string, {
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        cv_accuracy_mean: number;
        cv_accuracy_std: number;
        confusion_matrix: number[][];
    }>;
}

export interface PredictionStats {
    total_predictions: number;
    fake_count: number;
    genuine_count: number;
    fake_percentage: number;
    genuine_percentage: number;
}

export interface HealthStatus {
    status: string;
    model_loaded: boolean;
    model_name: string;
    timestamp: string;
}

export const apiService = {
    checkHealth: () => api.get<HealthStatus>('/health'),

    predict: (data: ProfileInput) => api.post<PredictionResponse>('/predict', data),

    predictFromInstagram: (username: string) =>
        api.post<PredictionResponse>('/predict-from-instagram', { username }),

    getPredictions: () => api.get<PredictionHistoryItem[]>('/predictions'),

    getPredictionStats: () => api.get<PredictionStats>('/prediction-stats'),

    getModelMetrics: () => api.get<ModelMetrics>('/model-metrics'),
};

export default api;
