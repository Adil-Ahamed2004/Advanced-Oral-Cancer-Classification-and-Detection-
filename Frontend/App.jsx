import { useState } from 'react';
import HomePage from './pages/HomePage';
import CameraCaptureComponent from './components/CameraCaptureComponent';
import ImageUploadComponent from './components/ImageUploadComponent';
import PredictionResultComponent from './components/PredictionResultComponent';

function App() {
    const [currentView, setCurrentView] = useState('home');
    const [predictionResult, setPredictionResult] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const handlePredictionComplete = (result, imageUrl) => {
        setPredictionResult(result);
        setCapturedImage(imageUrl);
        setCurrentView('result');
    };

    const handleBackToHome = () => {
        setCurrentView('home');
        setPredictionResult(null);
        setCapturedImage(null);
    };

    const handleCameraCapture = () => {
        setCurrentView('camera');
    };

    const handleImageUpload = () => {
        setCurrentView('upload');
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">
                        <span className="medical-icon">🏥</span>
                        Oral Cancer Detection System
                    </h1>
                    <p className="app-subtitle">AI-Powered Medical Imaging Analysis</p>
                </div>
            </header>

            <main className="app-main">
                {currentView === 'home' && (
                    <HomePage
                        onCameraCapture={handleCameraCapture}
                        onImageUpload={handleImageUpload}
                    />
                )}

                {currentView === 'camera' && (
                    <CameraCaptureComponent
                        onPredictionComplete={handlePredictionComplete}
                        onBack={handleBackToHome}
                    />
                )}

                {currentView === 'upload' && (
                    <ImageUploadComponent
                        onPredictionComplete={handlePredictionComplete}
                        onBack={handleBackToHome}
                    />
                )}

                {currentView === 'result' && (
                    <PredictionResultComponent
                        result={predictionResult}
                        imageUrl={capturedImage}
                        onBack={handleBackToHome}
                    />
                )}
            </main>

            <footer className="app-footer">
                <p className="disclaimer">
                    ⚠️ <strong>Medical Disclaimer:</strong> This is an AI-assisted educational tool.
                    Always consult qualified medical professionals for accurate diagnosis and treatment.
                </p>
                <p className="footer-text">
                    Advanced Oral Cancer Classification System © 2026
                </p>
            </footer>
        </div>
    );
}

export default App;
