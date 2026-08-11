import React from 'react';

function HomePage({ onCameraCapture, onImageUpload }) {
    return (
        <div className="home-page">
            <div className="welcome-section">
                <h2 className="section-title">Welcome to Oral Cancer Detection</h2>
                <p className="section-description">
                    Our advanced AI system uses deep learning to analyze oral cavity images
                    and classify them into three categories: Normal, Pre-Cancerous, and Cancerous.
                    Early detection can save lives.
                </p>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🔬</div>
                    <h3>AI-Powered Analysis</h3>
                    <p>Advanced CNN model trained on real medical data</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Instant Results</h3>
                    <p>Get classification results in seconds</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>High Accuracy</h3>
                    <p>Trained using MobileNetV2 transfer learning</p>
                </div>
            </div>

            <div className="action-section">
                <h2 className="section-title">Choose Input Method</h2>

                <div className="action-cards">
                    <div className="action-card" onClick={onCameraCapture}>
                        <div className="action-icon">📷</div>
                        <h3>Capture Image</h3>
                        <p>Use your device camera to capture an oral cavity image</p>
                        <button className="action-button primary">Open Camera</button>
                    </div>

                    <div className="action-card" onClick={onImageUpload}>
                        <div className="action-icon">📁</div>
                        <h3>Upload Image</h3>
                        <p>Upload an existing oral cavity image from your device</p>
                        <button className="action-button secondary">Choose File</button>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h3>How It Works</h3>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h4>Capture or Upload</h4>
                            <p>Provide a clear image of the oral cavity</p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h4>AI Analysis</h4>
                            <p>Our model processes and analyzes the image</p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h4>Get Results</h4>
                            <p>View classification and recommendations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
