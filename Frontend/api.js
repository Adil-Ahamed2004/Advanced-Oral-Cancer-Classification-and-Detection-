const API_BASE_URL = 'http://localhost:5000';

// Convert a data URL to a Blob
function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const meta = parts[0];
    const base64 = parts[1];
    const match = meta.match(/:(.*?);/);
    const mime = match ? match[1] : 'image/png';
    const binary = atob(base64);
    const len = binary.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        u8[i] = binary.charCodeAt(i);
    }
    return new Blob([u8], { type: mime });
}

export const predictImage = async (imageData) => {
    try {
        // If imageData is a data URL (starts with data:), send as multipart/form-data
        let response;
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            const blob = dataURLToBlob(imageData);
            const file = new File([blob], 'upload.png', { type: blob.type });
            const formData = new FormData();
            formData.append('image', file);

            response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                body: formData,
            });
        } else if (imageData instanceof File) {
            const formData = new FormData();
            formData.append('image', imageData);
            response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                body: formData,
            });
        } else {
            // Fallback to JSON (if caller passes base64 string without data: prefix)
            response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData }),
            });
        }

        if (!response.ok) {
            let errorText = 'Prediction failed';
            try {
                const errorData = await response.json();
                errorText = errorData.error || errorData.message || errorText;
            } catch (err) {
                errorText = await response.text();
            }
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);

        // If backend is unreachable, return a safe mocked response for demo purposes.
        const msg = (error && error.message) ? error.message.toLowerCase() : '';
        if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('connection refused')) {
            // Provide a clear mock response with a flag so UI can show it's a demo result.
            return {
                prediction: 'Normal',
                confidence: 99.0,
                probabilities: {
                    Normal: 99.0,
                    PreCancerous: 0.5,
                    Cancerous: 0.5,
                },
                recommendation: 'Mock result: No immediate concerns detected.',
                warning: 'This is a mocked prediction because the backend is unreachable.',
                disclaimer: 'Mock data — run the backend for real predictions.',
                __mock: true,
            };
        }

        throw new Error(error.message || 'Network error communicating with API');
    }
};

export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return await response.json();
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};
