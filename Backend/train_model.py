import os
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

def create_model(input_shape=(224, 224, 3), num_classes=3):
    """
    Create MobileNetV2-based model for oral cancer classification
    
    Args:
        input_shape: Input image shape
        num_classes: Number of output classes (Normal, PreCancerous, Cancerous)
    
    Returns:
        Compiled Keras model
    """
    # Load pre-trained MobileNetV2 (without top layers)
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers initially
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
        layers.Dense(num_classes, activation='softmax')
    ])
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
    )
    
    return model, base_model


def train_model(dataset_dir, model_save_path, epochs=50, batch_size=32):
    """
    Train the oral cancer classification model
    
    Args:
        dataset_dir: Path to prepared dataset directory
        model_save_path: Path to save trained model
        epochs: Number of training epochs
        batch_size: Batch size for training
    """
    
    dataset_path = Path(dataset_dir)
    train_dir = dataset_path / 'train'
    val_dir = dataset_path / 'validation'
    test_dir = dataset_path / 'test'
    
    # Verify directories exist
    if not train_dir.exists():
        raise ValueError(f"Training directory not found: {train_dir}")
    
    print("="*60)
    print("ORAL CANCER CLASSIFICATION MODEL TRAINING")
    print("="*60)
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        vertical_flip=False,
        zoom_range=0.2,
        shear_range=0.1,
        fill_mode='nearest'
    )
    
    # Only rescaling for validation and test
    val_test_datagen = ImageDataGenerator(rescale=1./255)
    
    # Create data generators
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=True
    )
    
    validation_generator = val_test_datagen.flow_from_directory(
        val_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )
    
    test_generator = val_test_datagen.flow_from_directory(
        test_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )
    
    # Print class indices
    print("\nClass indices:")
    for class_name, idx in train_generator.class_indices.items():
        print(f"  {class_name}: {idx}")
    
    print(f"\nTraining samples: {train_generator.samples}")
    print(f"Validation samples: {validation_generator.samples}")
    print(f"Test samples: {test_generator.samples}")
    
    # Create model
    print("\nCreating model...")
    model, base_model = create_model()
    
    print("\nModel architecture:")
    model.summary()
    
    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            model_save_path,
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Phase 1: Train with frozen base model
    print("\n" + "="*60)
    print("PHASE 1: Training with frozen base model")
    print("="*60)
    
    history_phase1 = model.fit(
        train_generator,
        epochs=min(20, epochs),
        validation_data=validation_generator,
        callbacks=callbacks,
        verbose=1
    )
    
    # Phase 2: Fine-tune base model
    print("\n" + "="*60)
    print("PHASE 2: Fine-tuning base model")
    print("="*60)
    
    # Unfreeze the base model
    base_model.trainable = True
    
    # Freeze early layers, fine-tune later layers
    for layer in base_model.layers[:100]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
    )
    
    print(f"\nTrainable layers: {sum([1 for layer in model.layers if layer.trainable])}")
    
    history_phase2 = model.fit(
        train_generator,
        epochs=epochs,
        initial_epoch=len(history_phase1.history['loss']),
        validation_data=validation_generator,
        callbacks=callbacks,
        verbose=1
    )
    
    # Combine histories
    history = {
        'loss': history_phase1.history['loss'] + history_phase2.history['loss'],
        'accuracy': history_phase1.history['accuracy'] + history_phase2.history['accuracy'],
        'val_loss': history_phase1.history['val_loss'] + history_phase2.history['val_loss'],
        'val_accuracy': history_phase1.history['val_accuracy'] + history_phase2.history['val_accuracy']
    }
    
    # Evaluate on test set
    print("\n" + "="*60)
    print("EVALUATING ON TEST SET")
    print("="*60)
    
    test_loss, test_accuracy, test_precision, test_recall = model.evaluate(test_generator)
    
    print(f"\nTest Results:")
    print(f"  Loss: {test_loss:.4f}")
    print(f"  Accuracy: {test_accuracy:.4f}")
    print(f"  Precision: {test_precision:.4f}")
    print(f"  Recall: {test_recall:.4f}")
    print(f"  F1-Score: {2 * (test_precision * test_recall) / (test_precision + test_recall):.4f}")
    
    # Generate predictions for confusion matrix
    test_generator.reset()
    predictions = model.predict(test_generator, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = test_generator.classes
    class_labels = list(test_generator.class_indices.keys())
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(true_classes, predicted_classes, target_names=class_labels))
    
    # Plot training history
    plot_training_history(history, model_save_path.replace('.h5', '_history.png'))
    
    # Plot confusion matrix
    plot_confusion_matrix(true_classes, predicted_classes, class_labels, 
                         model_save_path.replace('.h5', '_confusion_matrix.png'))
    
    print("\n" + "="*60)
    print(f"Model saved to: {model_save_path}")
    print("Training complete!")
    print("="*60)
    
    return model, history


def plot_training_history(history, save_path):
    """Plot and save training history"""
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    
    # Accuracy plot
    axes[0].plot(history['accuracy'], label='Train Accuracy')
    axes[0].plot(history['val_accuracy'], label='Val Accuracy')
    axes[0].set_title('Model Accuracy')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Accuracy')
    axes[0].legend()
    axes[0].grid(True)
    
    # Loss plot
    axes[1].plot(history['loss'], label='Train Loss')
    axes[1].plot(history['val_loss'], label='Val Loss')
    axes[1].set_title('Model Loss')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Loss')
    axes[1].legend()
    axes[1].grid(True)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"\nTraining history plot saved to: {save_path}")
    plt.close()


def plot_confusion_matrix(true_labels, predicted_labels, class_names, save_path):
    """Plot and save confusion matrix"""
    cm = confusion_matrix(true_labels, predicted_labels)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"Confusion matrix saved to: {save_path}")
    plt.close()


if __name__ == '__main__':
    # Configuration
    DATASET_DIR = r'c:\Users\padhb\OneDrive\Documents\Desktop\advance oral cancer\dataset\prepared'
    MODEL_SAVE_PATH = r'c:\Users\padhb\OneDrive\Documents\Desktop\advance oral cancer\backend\model\oral_cancer_model.h5'
    
    # Create model directory if it doesn't exist
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    
    # Train model
    try:
        model, history = train_model(
            dataset_dir=DATASET_DIR,
            model_save_path=MODEL_SAVE_PATH,
            epochs=50,
            batch_size=32
        )
    except Exception as e:
        print(f"\nError during training: {e}")
        print("\nMake sure you have:")
        print("1. Downloaded the Kaggle oral cancer dataset")
        print("2. Run prepare_dataset.py to organize the data")
        print(f"3. Dataset is located at: {DATASET_DIR}")
