import { useState, useRef, useEffect } from 'react';
import { predictImage } from '../api';

function CameraCaptureComponent({ onPredictionComplete, onBack }) {
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cameraError, setCameraError] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            setCameraError(null);

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera access error:', err);

            let errorMessage = 'Failed to access camera. ';

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage += 'Please grant camera permission and try again.';
            } else if (err.name === 'NotFoundError') {
                errorMessage += 'No camera found on this device.';
            } else if (err.name === 'NotReadableError') {
                errorMessage += 'Camera is already in use by another application.';
            } else {
                errorMessage += err.message || 'Unknown error occurred.';
            }

            setCameraError(errorMessage);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image as data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageDataUrl);

        // Stop camera after capture
        stopCamera();
    };

    const retakeImage = () => {
        setCapturedImage(null);
        setError(null);
        startCamera();
    };

    const analyzeImage = async () => {
        if (!capturedImage) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await predictImage(capturedImage);
            onPredictionComplete(result, capturedImage);
        } catch (err) {
            setError(err.message || 'Prediction failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="camera-capture">
            <div className="component-header">
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>
                <h2>Camera Capture</h2>
            </div>

            <div className="capture-container">
                {cameraError ? (
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <p className="error-message">{cameraError}</p>
                        <button className="retry-button" onClick={startCamera}>
                            Retry Camera Access
                        </button>
                    </div>
                ) : (
                    <>
                        {!capturedImage ? (
                            <div className="video-container">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="video-preview"
                                />
                                <div className="capture-controls">
                                    <button
                                        className="capture-button"
                                        onClick={captureImage}
                                        disabled={!stream}
                                    >
                                        📸 Capture Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="preview-container">
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="captured-image"
                                />
                                <div className="preview-controls">
                                    <button
                                        className="action-button secondary"
                                        onClick={retakeImage}
                                        disabled={isLoading}
                                    >
                                        🔄 Retake
                                    </button>
                                    <button
                                        className="action-button primary"
                                        onClick={analyzeImage}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner"></span>
                                                Analyzing...
                                            </>
                                        ) : (
                                            '🔬 Analyze Image'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <div className="error-banner">
                        <span className="error-icon">❌</span>
                        {error}
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="instructions">
                <h3>📋 Instructions</h3>
                <ul>
                    <li>Ensure good lighting for clear image capture</li>
                    <li>Position the camera to clearly show the oral cavity</li>
                    <li>Keep the camera steady when capturing</li>
                    <li>Capture a well-focused image for best results</li>
                </ul>
            </div>
        </div>
    );
}

export default CameraCaptureComponent;
