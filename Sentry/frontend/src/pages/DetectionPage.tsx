import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { apiService, PredictionResponse } from '../api'

export default function DetectionPage() {
    const [username, setUsername] = useState('')
    const [result, setResult] = useState<PredictionResponse | null>(null)

    const mutation = useMutation({
        mutationFn: (u: string) => apiService.predictFromInstagram(u).then((r) => r.data),
        onSuccess: (data) => setResult(data),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim()) return
        setResult(null)
        mutation.mutate(username.trim())
    }

    const handleReset = () => {
        setUsername('')
        setResult(null)
        mutation.reset()
    }

    const isFake = result?.prediction === 'Fake Profile'

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 min-h-screen pt-24 pb-16 px-6"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-minimal-text mb-3">
                        PROFILE <span className="minimal-text-highlight">SCANNER</span>
                    </h1>
                    <p className="text-minimal-text-muted font-mono text-sm">
                        Enter an Instagram username or profile URL — data is fetched automatically
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Form - Single field */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="glass-panel p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 rounded-full status-indicator-active" />
                                <h2 className="font-display text-sm font-bold tracking-wider text-minimal-text">
                                    INSTAGRAM PROFILE
                                </h2>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-mono text-gray-500 mb-1.5 tracking-wider">
                                    USERNAME OR URL
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="@username or instagram.com/username"
                                    className="formal-input w-full"
                                    autoFocus
                                />
                                <p className="text-xs font-mono text-minimal-text-muted mt-2">
                                    Examples: cristiano, @nasa, https://instagram.com/natgeo
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={mutation.isPending || !username.trim()}
                                    className="formal-button flex-1"
                                >
                                    {mutation.isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            FETCHING & SCANNING...
                                        </span>
                                    ) : (
                                        'ANALYZE PROFILE'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="formal-button formal-button-outline"
                                >
                                    RESET
                                </button>
                            </div>

                            {mutation.isError && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono"
                                >
                                    {(mutation.error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
                                        'Failed to fetch profile. Check username and try again.'}
                                </motion.div>
                            )}
                        </form>
                    </motion.div>

                    {/* Results Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, type: 'spring' }}
                                    className={`glass-panel p-8 ${isFake ? 'border-minimal-error shadow-lg shadow-minimal-error/10' : 'border-minimal-success shadow-lg shadow-minimal-success/10'}`}
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className={`w-2 h-2 rounded-full ${isFake ? 'status-indicator-error' : 'status-indicator-success'}`} />
                                        <h2 className="font-display text-sm font-bold tracking-wider text-minimal-text">
                                            ANALYSIS RESULT
                                        </h2>
                                    </div>

                                    {/* Profile summary */}
                                    <div className="mb-6 p-4 rounded-lg bg-minimal-surface border border-minimal-border">
                                        <div className="text-xs font-mono text-minimal-text-muted mb-2 font-bold tracking-wider">PROFILE ANALYZED</div>
                                        <div className="font-display text-minimal-text font-medium">
                                            {result.input_data.name || '—'} @{result.input_data.screen_name}
                                        </div>
                                        <div className="text-xs font-mono text-minimal-text-muted mt-1">
                                            {result.input_data.followers_count} followers · {result.input_data.friends_count} following · {result.input_data.statuses_count} posts
                                        </div>
                                    </div>

                                    {/* Main verdict */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
                                        className="text-center mb-8"
                                    >
                                        <div className={`text-6xl mb-4 ${isFake ? 'grayscale-0' : ''}`}>
                                            {isFake ? '🚨' : '✅'}
                                        </div>
                                        <h3
                                            className={`text-2xl font-display font-bold mb-2 ${isFake ? 'text-minimal-error' : 'text-minimal-success'
                                                }`}
                                        >
                                            {result.prediction.toUpperCase()}
                                        </h3>
                                        <p className="text-minimal-text-muted font-mono text-sm">
                                            Analyzed by {result.model_name}
                                        </p>
                                    </motion.div>

                                    {/* Metrics */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-minimal-surface border border-minimal-border rounded-lg p-4 text-center shadow-minimal-card">
                                            <div className="text-xs font-mono text-minimal-text-muted mb-1 font-bold tracking-wider">CONFIDENCE</div>
                                            <div className={`text-2xl font-display font-bold ${isFake ? 'text-minimal-error' : 'text-minimal-success'}`}>
                                                {(result.confidence * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="bg-minimal-surface border border-minimal-border rounded-lg p-4 text-center shadow-minimal-card">
                                            <div className="text-xs font-mono text-minimal-text-muted mb-1 font-bold tracking-wider">RISK SCORE</div>
                                            <div className={`text-2xl font-display font-bold ${result.risk_score > 60 ? 'text-minimal-error' : result.risk_score > 30 ? 'text-minimal-warning' : 'text-minimal-success'
                                                }`}>
                                                {result.risk_score}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-mono font-bold text-minimal-text-muted mb-2 tracking-wider">
                                            <span>LOW RISK</span>
                                            <span>HIGH RISK</span>
                                        </div>
                                        <div className="h-2 bg-minimal-surface border border-minimal-border rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${result.risk_score}%` }}
                                                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                                                className={`h-full rounded-full ${result.risk_score > 60
                                                    ? 'bg-minimal-error'
                                                    : 'bg-minimal-success'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-xs font-mono text-minimal-text-muted text-center tracking-wider">
                                        {result.timestamp}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-minimal-border bg-transparent shadow-none"
                                >
                                    <div className="w-20 h-20 rounded-full border-2 border-minimal-border flex items-center justify-center mb-6 animate-float-subtle bg-minimal-surface">
                                        <svg className="w-10 h-10 text-minimal-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-display text-sm font-bold text-minimal-text tracking-wider mb-2">
                                        AWAITING INPUT
                                    </h3>
                                    <p className="text-minimal-text-muted text-sm text-center font-mono">
                                        Enter an Instagram username or URL<br />and click Analyze — data fetches automatically
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
