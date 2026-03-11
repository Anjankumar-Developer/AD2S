import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ParticleBackground from '../components/ParticleBackground'

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
    }),
}

const features = [
    {
        icon: '🧠',
        title: 'ML-Powered Detection',
        description: 'Advanced models trained on real social media data to identify fake profiles with high accuracy.',
    },
    {
        icon: '⚡',
        title: 'Real-Time Analysis',
        description: 'Get instant predictions with confidence scores and risk assessment for any profile.',
    },
    {
        icon: '📊',
        title: 'Analytics Dashboard',
        description: 'Comprehensive model metrics, prediction history, and distribution insights.',
    },
    {
        icon: '🔒',
        title: 'Production Ready',
        description: 'Built with FastAPI backend, scalable ML pipeline, and enterprise-grade architecture.',
    },
]

export default function LandingPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-screen"
        >
            <ParticleBackground />

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-6"
                >
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-minimal-surface border border-minimal-border flex items-center justify-center shadow-minimal-card">
                        <svg className="w-12 h-12 text-minimal-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </motion.div>

                <motion.p
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="font-mono text-xs font-bold text-minimal-text-muted tracking-[6px] uppercase mb-4"
                >
                    AI-Powered Security
                </motion.p>

                <motion.h1
                    custom={1}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-6 leading-tight text-minimal-text"
                >
                    <span>SENTRY</span>
                    <br />
                    <span className="minimal-text-highlight">AI PROFILER</span>
                </motion.h1>

                <motion.p
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="text-minimal-text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-body"
                >
                    Advanced machine learning system that analyzes social media profiles
                    to identify fake accounts with precision. Powered by Random Forest,
                    SVM, and Neural Network models.
                </motion.p>

                <motion.div
                    custom={3}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-4"
                >
                    <Link to="/detect">
                        <button className="formal-button">
                            Start Detection
                        </button>
                    </Link>
                    <Link to="/analytics">
                        <button className="formal-button formal-button-outline">
                            View Analytics
                        </button>
                    </Link>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-mono font-bold text-minimal-text-muted tracking-widest">SCROLL</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-5 h-8 rounded-full border border-minimal-border flex items-start justify-center p-1 bg-minimal-surface"
                    >
                        <div className="w-1 h-2 bg-minimal-accent rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-minimal-text tracking-tight"
                >
                    SYSTEM <span className="text-minimal-text-muted font-normal">CAPABILITIES</span>
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="h-1 w-20 mx-auto bg-minimal-text rounded-none mb-16"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="glass-panel glass-panel-hover p-6 cursor-default"
                        >
                            <div className="text-4xl mb-4 grayscale">{feature.icon}</div>
                            <h3 className="font-display text-sm font-bold tracking-wider text-minimal-text mb-3">
                                {feature.title.toUpperCase()}
                            </h3>
                            <p className="text-minimal-text-muted text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
                <div className="glass-panel p-8 grid grid-cols-3 gap-8 text-center border-t-4 border-minimal-accent">
                    {[
                        { value: '3', label: 'ML Models', color: 'text-minimal-text' },
                        { value: '15', label: 'Features Analyzed', color: 'text-minimal-text-muted' },
                        { value: '95%+', label: 'Accuracy', color: 'text-minimal-text font-black' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                        >
                            <div className={`text-4xl md:text-5xl font-display font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-minimal-text-muted font-mono text-xs mt-2 tracking-widest font-bold">
                                {stat.label.toUpperCase()}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.div>
    )
}
