import { useState, useRef } from 'react';
import { predictImage } from '../api';

// Tiny 1x1 PNG (transparent) used as a downloadable sample for demos
const SAMPLE_PNG_DATAURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

function downloadSampleImage() {
    const a = document.createElement('a');
    a.href = SAMPLE_PNG_DATAURL;
    a.download = 'sample_oral_image.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function ImageUploadComponent({ onPredictionComplete, onBack }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, or BMP)');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return;
        }

        setError(null);
        setSelectedImage(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        processFile(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const analyzeImage = async () => {
        if (!imagePreview) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await predictImage(imagePreview);
            onPredictionComplete(result, imagePreview);
        } catch (err) {
            setError(err.message || 'Prediction failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="image-upload">
            <div className="component-header">
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>
                <h2>Upload Image</h2>
            </div>

            <div className="upload-container">
                {!selectedImage ? (
                    <div
                        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleUploadClick}
                    >
                        <div className="upload-icon">📁</div>
                        <h3>Drag & Drop Image Here</h3>
                        <p>or</p>
                        <button className="browse-button">Browse Files</button>
                        <p className="upload-hint">
                            Supported formats: JPEG, PNG, BMP (Max 10MB)
                        </p>

                        <div style={{ marginTop: '1rem' }}>
                            <button className="browse-button" onClick={downloadSampleImage} type="button">
                                ⬇️ Download Sample Image
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/bmp"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>
                ) : (
                    <div className="preview-container">
                        <img
                            src={imagePreview}
                            alt="Selected"
                            className="uploaded-image"
                        />
                        <div className="image-info">
                            <p className="file-name">📄 {selectedImage.name}</p>
                            <p className="file-size">
                                Size: {(selectedImage.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        <div className="preview-controls">
                            <button
                                className="action-button secondary"
                                onClick={handleRemoveImage}
                                disabled={isLoading}
                            >
                                🗑️ Remove
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

                {error && (
                    <div className="error-banner">
                        <span className="error-icon">❌</span>
                        {error}
                    </div>
                )}
            </div>

            <div className="instructions">
                <h3>📋 Image Guidelines</h3>
                <ul>
                    <li>Upload a clear, well-lit image of the oral cavity</li>
                    <li>Ensure the image is in focus and not blurry</li>
                    <li>The area of interest should be clearly visible</li>
                    <li>Avoid images with excessive shadows or glare</li>
                </ul>
            </div>
        </div>
    );
}

export default ImageUploadComponent;
