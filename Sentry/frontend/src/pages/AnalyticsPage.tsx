import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
    Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts'
import { apiService } from '../api'

const COLORS = {
    cyan: '#0f172a',    // minimal-text (black)
    blue: '#334155',    // minimal-text-hover
    green: '#059669',   // minimal-success
    red: '#dc2626',     // minimal-error
    gray: '#cbd5e1',    // minimal-border
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
}

export default function AnalyticsPage() {
    const { data: metrics, isLoading: metricsLoading, isError: metricsError } = useQuery({
        queryKey: ['model-metrics'],
        queryFn: () => apiService.getModelMetrics().then((r) => r.data),
        retry: 1,
    })

    const { data: stats } = useQuery({
        queryKey: ['prediction-stats'],
        queryFn: () => apiService.getPredictionStats().then((r) => r.data),
        retry: 1,
    })

    const { data: predictions } = useQuery({
        queryKey: ['predictions'],
        queryFn: () => apiService.getPredictions().then((r) => r.data),
        retry: 1,
    })

    // Prepare chart data
    const pieData = stats
        ? [
            { name: 'Fake', value: stats.fake_count, color: COLORS.red },
            { name: 'Genuine', value: stats.genuine_count, color: COLORS.green },
        ]
        : []

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 min-h-screen pt-24 pb-16 px-6"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-minimal-text mb-3">
                        ANALYTICS <span className="minimal-text-highlight font-normal">DASHBOARD</span>
                    </h1>
                    <p className="text-minimal-text-muted font-mono text-sm">
                        Model performance metrics and prediction statistics
                    </p>
                </motion.div>

                {metricsError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-6 mb-8 text-center"
                    >
                        <p className="text-minimal-warning font-mono text-sm mb-2 font-bold">
                            ⚠ Could not connect to backend API
                        </p>
                        <p className="text-minimal-text-muted font-mono text-xs">
                            Make sure the backend is running: <code className="text-minimal-text font-bold">python -m uvicorn backend.main:app --port 8000</code>
                        </p>
                    </motion.div>
                )}

                {/* Best Model Card */}
                {metrics && (
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="glass-panel p-6 mb-8 shadow-minimal-card border-l-4 border-l-minimal-text"
                    >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-minimal-surface border border-minimal-border flex items-center justify-center">
                                    <span className="text-2xl grayscale">🏆</span>
                                </div>
                                <div>
                                    <div className="text-xs font-mono text-minimal-text-muted tracking-wider font-bold">BEST MODEL</div>
                                    <div className="text-xl font-display font-bold text-minimal-text">
                                        {metrics.best_model}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                {metrics.models[metrics.best_model] && (
                                    <>
                                        <div className="text-center">
                                            <div className="text-xs font-mono text-minimal-text-muted font-bold tracking-wider">ACCURACY</div>
                                            <div className="text-xl font-display font-bold text-minimal-success">
                                                {(metrics.models[metrics.best_model].accuracy * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-mono text-minimal-text-muted font-bold tracking-wider">F1 SCORE</div>
                                            <div className="text-xl font-display font-bold text-minimal-text">
                                                {(metrics.models[metrics.best_model].f1_score * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}


                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Prediction Distribution Pie */}
                    <motion.div
                        custom={3}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="glass-panel p-6 shadow-minimal-card"
                    >
                        <h3 className="font-display text-sm font-bold tracking-wider text-minimal-text mb-6">
                            PREDICTION DISTRIBUTION
                        </h3>
                        {pieData.length > 0 && stats && stats.total_predictions > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: '#ffffff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                color: '#0f172a',
                                                fontFamily: 'monospace',
                                                fontSize: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-6 mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-minimal-error" />
                                        <span className="text-xs font-mono font-bold tracking-wider text-minimal-text">Fake ({stats.fake_percentage}%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-minimal-success" />
                                        <span className="text-xs font-mono font-bold tracking-wider text-minimal-text">Genuine ({stats.genuine_percentage}%)</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center">
                                <p className="text-minimal-text-muted font-mono text-sm text-center">
                                    No predictions yet.<br />Run some scans first.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        custom={4}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-2 glass-panel p-6 shadow-minimal-card"
                    >
                        <h3 className="font-display text-sm font-bold tracking-wider text-minimal-text mb-6">
                            QUICK STATS
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Scans', value: stats?.total_predictions || 0, color: 'text-minimal-text' },
                                { label: 'Fake Detected', value: stats?.fake_count || 0, color: 'text-minimal-error' },
                                { label: 'Genuine Found', value: stats?.genuine_count || 0, color: 'text-minimal-success' },
                                { label: 'Models Trained', value: metrics ? Object.keys(metrics.models).length : 0, color: 'text-minimal-text' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-minimal-surface border border-minimal-border rounded-xl p-4 text-center">
                                    <div className={`text-3xl font-display font-medium ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-xs font-mono font-bold text-minimal-text-muted tracking-wider mt-1">{stat.label.toUpperCase()}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Prediction History */}
                <motion.div
                    custom={5}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="glass-panel p-6 shadow-minimal-card"
                >
                    <h3 className="font-display text-sm font-bold tracking-wider text-minimal-text mb-6">
                        RECENT PREDICTIONS
                    </h3>
                    {predictions && predictions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-minimal-border">
                                        <th className="text-left py-3 px-4 font-mono text-xs text-minimal-text-muted font-bold tracking-wider">ID</th>
                                        <th className="text-left py-3 px-4 font-mono text-xs text-minimal-text-muted font-bold tracking-wider">PROFILE</th>
                                        <th className="text-left py-3 px-4 font-mono text-xs text-minimal-text-muted font-bold tracking-wider">RESULT</th>
                                        <th className="text-left py-3 px-4 font-mono text-xs text-minimal-text-muted font-bold tracking-wider">CONFIDENCE</th>
                                        <th className="text-left py-3 px-4 font-mono text-xs text-minimal-text-muted font-bold tracking-wider">RISK</th>
                                        <th className="text-left py-3 px-4 font-mono text-xs text-minimal-text-muted font-bold tracking-wider">TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {predictions.slice(0, 10).map((pred) => (
                                        <tr key={pred.id} className="border-b border-minimal-border/50 hover:bg-minimal-surface transition-colors">
                                            <td className="py-3 px-4 font-mono text-minimal-text-muted">#{pred.id}</td>
                                            <td className="py-3 px-4 text-minimal-text font-medium">{pred.input_summary}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${pred.prediction === 'Fake Profile'
                                                    ? 'bg-minimal-error/10 text-minimal-error border border-minimal-error/20'
                                                    : 'bg-minimal-success/10 text-minimal-success border border-minimal-success/20'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${pred.prediction === 'Fake Profile' ? 'bg-minimal-error' : 'bg-minimal-success'
                                                        }`} />
                                                    {pred.prediction === 'Fake Profile' ? 'FAKE' : 'GENUINE'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-minimal-text">
                                                {(pred.confidence * 100).toFixed(1)}%
                                            </td>
                                            <td className="py-3 px-4 font-mono text-minimal-text">{pred.risk_score}</td>
                                            <td className="py-3 px-4 font-mono text-minimal-text-muted text-xs">
                                                {new Date(pred.timestamp).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-minimal-text-muted font-mono text-sm">
                                No prediction history yet. Scan some profiles to see results here.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}
