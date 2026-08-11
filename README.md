# Advanced-Oral-Cancer-Classification-and-Detection-
Advanced Oral Cancer Detection System is a full-stack AI app that classifies oral cavity images into Normal, Pre-Cancerous, and Cancerous categories. Built with React and Flask, it uses OpenCV preprocessing and a MobileNetV2 CNN to deliver real-time camera capture, image uploads, confidence scores, and diagnostic guidance.
# Advanced Oral Cancer Classification and Detection System

A comprehensive AI-powered web application for analyzing oral cavity medical images and classifying them into three categories: **Normal**, **Pre-Cancerous**, and **Cancerous**. This system assists in early detection and supports medical professionals with high accuracy predictions.

![Medical AI System](https://img.shields.io/badge/Medical-AI%20System-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange)

## 🏥 Features

### Core Functionality
- **Image Input Methods**
  - 📷 Real-time camera capture using Web Camera API
  - 📁 Upload existing images from local system
  
- **Advanced Image Processing**
  - Automatic resizing to model input size (224x224)
  - Noise reduction using Gaussian blur
  - Contrast enhancement with CLAHE
  - Pixel normalization and color space conversion

- **AI Classification**
  - CNN model based on MobileNetV2 with transfer learning
  - Three-class classification: Normal, Pre-Cancerous, Cancerous
  - Confidence scores and probability breakdown
  - Medical recommendations based on predictions

- **Professional UI/UX**
  - Clean, medical-themed responsive design
  - Color-coded results (Green/Yellow/Red)
  - Loading states and comprehensive error handling
  - Medical disclaimers and safety warnings

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **TensorFlow/Keras** - Deep learning model
- **OpenCV** - Image preprocessing
- **NumPy** - Numerical computations
- **Pillow** - Image handling

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Professional styling
- **Web Camera API** - Camera access

## 📁 Project Structure

```
advance oral cancer/
├── backend/
│   ├── app.py                          # Flask application
│   ├── requirements.txt                # Python dependencies
│   ├── model/
│   │   └── oral_cancer_model.h5       # Trained CNN model
│   └── utils/
│       ├── preprocessing.py            # Image preprocessing
│       ├── prepare_dataset.py          # Dataset organization
│       ├── train_model.py             # Model training pipeline
│       └── model_builder.py           # Placeholder model creator
├── frontend/
│   ├── index.html                      # HTML template
│   ├── package.json                    # Node dependencies
│   ├── vite.config.js                 # Vite configuration
│   └── src/
│       ├── main.jsx                    # React entry point
│       ├── App.jsx                     # Main app component
│       ├── api.js                      # API communication
│       ├── pages/
│       │   └── HomePage.jsx           # Home page
│       ├── components/
│       │   ├── CameraCaptureComponent.jsx
│       │   ├── ImageUploadComponent.jsx
│       │   └── PredictionResultComponent.jsx
│       └── styles/
│           └── App.css                 # Application styles
└── dataset/
    ├── raw/                            # Downloaded Kaggle dataset
    └── prepared/                       # Organized train/val/test splits
```

## 🚀 Setup and Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- (Optional) Kaggle account for dataset download

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd "c:\Users\padhb\OneDrive\Documents\Desktop\advance oral cancer\backend"
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create placeholder model (for testing)**
   ```bash
   python utils/model_builder.py
   ```
   This creates a model with the correct architecture but random weights for testing purposes.

5. **Run Flask server**
   ```bash
   python app.py
   ```
   Server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd "c:\Users\padhb\OneDrive\Documents\Desktop\advance oral cancer\frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Application will open at `http://localhost:3000`

## 📊 Training with Real Dataset

To train the model on real oral cancer data:

### 1. Download Dataset

**Option A: Kaggle Dataset (Recommended)**
- Dataset: [Oral Cancer Dataset](https://www.kaggle.com/datasets/zaidpy/oral-cancer-dataset)
- Download and extract to: `dataset/raw/`

**Option B: Zenodo Dataset**
- Dataset: [Oral Cavity Images Dataset](https://zenodo.org/doi/10.5281/zenodo.10664056)
- Download and extract to: `dataset/raw/`

### 2. Prepare Dataset

```bash
cd backend
python utils/prepare_dataset.py
```

This script will:
- Organize images into proper structure
- Create train/validation/test splits (70%/15%/15%)
- Validate image formats
- Output to `dataset/prepared/`

### 3. Train Model

```bash
python utils/train_model.py
```

Training process:
- **Phase 1**: Train with frozen MobileNetV2 base (20 epochs)
- **Phase 2**: Fine-tune with unfrozen layers (30 epochs)
- **Output**: Trained model saved as `model/oral_cancer_model.h5`
- **Metrics**: Training history plots and confusion matrix

Training time: ~2-4 hours on GPU, ~8-12 hours on CPU

## 🔌 API Documentation

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "healthy",
  "model_status": "loaded",
  "model_path": "path/to/model.h5"
}
```

### Prediction
```
POST /predict
```

**Request (Multipart Form Data):**
```
image: <file>
```

**Request (JSON with Base64):**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "prediction": "Cancerous",
  "confidence": 92.4,
  "probabilities": {
    "Normal": 2.1,
    "PreCancerous": 5.5,
    "Cancerous": 92.4
  },
  "recommendation": "Consult Specialist Immediately - Further diagnostic tests required",
  "warning": "Cancerous condition detected. Immediate medical attention is strongly recommended.",
  "disclaimer": "This is an AI-assisted tool for educational purposes only..."
}
```

## 🎯 Usage Guide

### Camera Capture
1. Click "Open Camera" on home page
2. Grant camera permissions when prompted
3. Position camera to capture oral cavity
4. Click "Capture Image"
5. Review captured image
6. Click "Analyze Image" to get prediction

### Image Upload
1. Click "Choose File" on home page
2. Select image file (JPEG, PNG, BMP)
3. Or drag and drop image into upload zone
4. Review uploaded image
5. Click "Analyze Image" to get prediction

### Understanding Results
- **Green (Normal)**: No immediate concerns detected
- **Yellow (Pre-Cancerous)**: Monitor regularly, consult specialist
- **Red (Cancerous)**: Immediate medical attention recommended

## ⚠️ Medical Disclaimer

**IMPORTANT**: This application is for **educational and demonstration purposes only**.

- This is NOT a substitute for professional medical diagnosis
- Always consult qualified medical professionals for accurate diagnosis
- Do not make medical decisions based solely on this tool
- For production use, the system requires:
  - Clinical validation and testing
  - Regulatory approval (FDA, CE marking, etc.)
  - Integration with proper medical workflows
  - Training on validated medical datasets

## 🧪 Testing

### Backend Testing
```bash
# Test model creation
python backend/utils/model_builder.py

# Test preprocessing
python -c "from utils.preprocessing import preprocess_image; print('Preprocessing OK')"

# Test Flask server
curl http://localhost:5000/health
```

### Frontend Testing
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### Backend Issues

**Model not found error:**
```bash
python backend/utils/model_builder.py
```

**Import errors:**
```bash
pip install -r requirements.txt --upgrade
```

**CORS errors:**
- Ensure Flask-CORS is installed
- Check that backend is running on port 5000

### Frontend Issues

**Camera not working:**
- Grant camera permissions in browser
- Use HTTPS or localhost (required for camera access)
- Check if camera is in use by another application

**API connection failed:**
- Ensure backend server is running
- Check API_BASE_URL in `src/api.js`
- Verify no firewall blocking port 5000

## 📈 Model Performance

When trained on the Kaggle oral cancer dataset:
- **Architecture**: MobileNetV2 with custom classification head
- **Input Size**: 224x224x3
- **Classes**: 3 (Normal, PreCancerous, Cancerous)
- **Training Strategy**: Transfer learning with two-phase training
- **Expected Accuracy**: 85-95% (depends on dataset quality)

## 🔒 Security Considerations

- Input validation for uploaded images
- File size limits (10MB max)
- Supported formats: JPEG, PNG, BMP only
- CORS configured for localhost development
- No patient data storage (images processed in memory)

## 🚀 Future Enhancements

- [ ] User authentication and session management
- [ ] History of previous analyses
- [ ] Export results as PDF reports
- [ ] Multi-language support
- [ ] Integration with medical record systems
- [ ] Ensemble models for improved accuracy
- [ ] Explainable AI (Grad-CAM visualizations)

## 📝 License

This project is for educational purposes. For commercial use, ensure compliance with medical device regulations and obtain necessary approvals.

## 👥 Contributors

Built as an advanced medical AI project for oral cancer detection research.

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in browser console
3. Check Flask server logs
4. Ensure all dependencies are installed correctly

---

**Remember**: This is an educational tool. Always seek professional medical advice for health concerns.
