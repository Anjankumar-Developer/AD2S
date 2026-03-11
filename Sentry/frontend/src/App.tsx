import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import DetectionPage from './pages/DetectionPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
    const location = useLocation()

    return (
        <div className="min-h-screen bg-minimal-bg grid-bg text-minimal-text">
            <Navbar />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/detect" element={<DetectionPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                </Routes>
            </AnimatePresence>
        </div>
    )
}

export default App
