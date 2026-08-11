import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2

def create_placeholder_model(save_path):
    """
    Create a placeholder model with the same architecture as the trained model
    This is useful for testing the application before training on real data
    
    Args:
        save_path: Path to save the model
    """
    
    print("Creating placeholder model...")
    print("NOTE: This model has random weights and is for testing purposes only.")
    print("For real predictions, train the model using train_model.py with the Kaggle dataset.")
    
    # Load pre-trained MobileNetV2 (without top layers)
    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model
    base_model.trainable = False
    
    # Create custom classification head
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.2),
        layers.Dense(3, activation='softmax')  # 3 classes: Normal, PreCancerous, Cancerous
    ])
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("\nModel architecture:")
    model.summary()
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    # Save model
    model.save(save_path)
    
    print(f"\nPlaceholder model saved to: {save_path}")
    print("\nTo train a real model:")
    print("1. Download the Kaggle oral cancer dataset")
    print("2. Run: python backend/utils/prepare_dataset.py")
    print("3. Run: python backend/utils/train_model.py")
    
    return model


if __name__ == '__main__':
    MODEL_SAVE_PATH = r'c:\Users\padhb\OneDrive\Documents\Desktop\advance oral cancer\backend\model\oral_cancer_model.h5'
    create_placeholder_model(MODEL_SAVE_PATH)
