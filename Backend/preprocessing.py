import cv2
import numpy as np
from PIL import Image
import io

def preprocess_image(image_data, target_size=(224, 224)):
    """
    Preprocess image for model prediction
    
    Args:
        image_data: Image data (bytes, PIL Image, or numpy array)
        target_size: Target size for resizing (default: 224x224 for MobileNetV2)
    
    Returns:
        Preprocessed image as numpy array ready for model input
    """
    # Convert to PIL Image if needed
    if isinstance(image_data, bytes):
        image = Image.open(io.BytesIO(image_data))
    elif isinstance(image_data, np.ndarray):
        image = Image.fromarray(image_data)
    else:
        image = image_data
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convert to numpy array
    img_array = np.array(image)
    
    # Resize to target size
    img_resized = cv2.resize(img_array, target_size, interpolation=cv2.INTER_LANCZOS4)
    
    # Apply noise reduction using Gaussian blur
    img_denoised = cv2.GaussianBlur(img_resized, (3, 3), 0)
    
    # Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization)
    lab = cv2.cvtColor(img_denoised, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l)
    
    enhanced = cv2.merge([l_enhanced, a, b])
    img_enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)
    
    # Normalize pixel values to [0, 1]
    img_normalized = img_enhanced.astype(np.float32) / 255.0
    
    # Add batch dimension
    img_batch = np.expand_dims(img_normalized, axis=0)
    
    return img_batch


def preprocess_for_training(image_path, target_size=(224, 224)):
    """
    Preprocess image for training (without batch dimension)
    
    Args:
        image_path: Path to image file
        target_size: Target size for resizing
    
    Returns:
        Preprocessed image as numpy array
    """
    # Read image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Resize
    img_resized = cv2.resize(image, target_size, interpolation=cv2.INTER_LANCZOS4)
    
    # Apply noise reduction
    img_denoised = cv2.GaussianBlur(img_resized, (3, 3), 0)
    
    # Enhance contrast using CLAHE
    lab = cv2.cvtColor(img_denoised, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l)
    
    enhanced = cv2.merge([l_enhanced, a, b])
    img_enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)
    
    # Normalize
    img_normalized = img_enhanced.astype(np.float32) / 255.0
    
    return img_normalized
