import React from 'react';

function PredictionResultComponent({ result, imageUrl, onBack }) {
    if (!result) {
        return (
            <div className="prediction-result">
                <p>No results available</p>
                <button className="action-button primary" onClick={onBack}>
                    Back to Home
                </button>
            </div>
        );
    }

    const getResultClass = (prediction) => {
        switch (prediction) {
            case 'Normal':
                return 'result-normal';
            case 'PreCancerous':
                return 'result-precancerous';
            case 'Cancerous':
                return 'result-cancerous';
            default:
                return '';
        }
    };

    const getResultIcon = (prediction) => {
        switch (prediction) {
            case 'Normal':
                return '✅';
            case 'PreCancerous':
                return '⚠️';
            case 'Cancerous':
                return '🚨';
            default:
                return '📊';
        }
    };

    return (
        <div className="prediction-result">
            <div className="component-header">
                <button className="back-button" onClick={onBack}>
                    ← New Analysis
                </button>
                <h2>Analysis Results</h2>
            </div>

            <div className="result-container">
                <div className="result-grid">
                    {/* Image Preview */}
                    <div className="result-image-section">
                        <h3>Analyzed Image</h3>
                        <img
                            src={imageUrl}
                            alt="Analyzed"
                            className="result-image"
                        />
                    </div>

                    {/* Prediction Results */}
                    <div className="result-details-section">
                        <div className={`prediction-card ${getResultClass(result.prediction)}`}>
                            <div className="prediction-header">
                                <span className="prediction-icon">
                                    {getResultIcon(result.prediction)}
                                </span>
                                <h3>Classification Result</h3>
                            </div>

                            <div className="prediction-value">
                                <h2>{result.prediction}</h2>
                                <p className="confidence">
                                    Confidence: <strong>{result.confidence}%</strong>
                                </p>
                            </div>

                            <div className="warning-message">
                                <p>{result.warning}</p>
                            </div>
                        </div>

                        {/* Probabilities Breakdown */}
                        <div className="probabilities-card">
                            <h3>Probability Breakdown</h3>
                            <div className="probabilities-list">
                                {Object.entries(result.probabilities).map(([className, probability]) => (
                                    <div key={className} className="probability-item">
                                        <div className="probability-label">
                                            <span className={`label-indicator ${getResultClass(className)}`}></span>
                                            {className}
                                        </div>
                                        <div className="probability-bar-container">
                                            <div
                                                className={`probability-bar ${getResultClass(className)}`}
                                                style={{ width: `${probability}%` }}
                                            ></div>
                                        </div>
                                        <div className="probability-value">
                                            {probability.toFixed(2)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="recommendation-card">
                            <h3>💡 Recommendation</h3>
                            <p className="recommendation-text">{result.recommendation}</p>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="result-disclaimer">
                    <h4>⚠️ Important Disclaimer</h4>
                    <p>{result.disclaimer}</p>
                </div>

                {/* Action Buttons */}
                <div className="result-actions">
                    <button className="action-button primary" onClick={onBack}>
                        Analyze Another Image
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PredictionResultComponent;
