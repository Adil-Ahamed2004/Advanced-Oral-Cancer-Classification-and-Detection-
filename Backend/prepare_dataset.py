import os
import shutil
import random
from pathlib import Path

def prepare_dataset(source_dir, output_dir, train_split=0.7, val_split=0.15, test_split=0.15):
    """
    Prepare the Kaggle oral cancer dataset for training
    
    Expected source structure:
    source_dir/
        Normal/
        PreCancerous/ (or similar name)
        Cancerous/
    
    Output structure:
    output_dir/
        train/
            Normal/
            PreCancerous/
            Cancerous/
        validation/
            Normal/
            PreCancerous/
            Cancerous/
        test/
            Normal/
            PreCancerous/
            Cancerous/
    
    Args:
        source_dir: Path to downloaded Kaggle dataset
        output_dir: Path to output prepared dataset
        train_split: Proportion for training (default: 0.7)
        val_split: Proportion for validation (default: 0.15)
        test_split: Proportion for testing (default: 0.15)
    """
    
    assert abs(train_split + val_split + test_split - 1.0) < 0.01, "Splits must sum to 1.0"
    
    source_path = Path(source_dir)
    output_path = Path(output_dir)
    
    # Class mapping (handle different naming conventions)
    class_mapping = {
        'Normal': 'Normal',
        'PreCancerous': 'PreCancerous',
        'Cancerous': 'Cancerous',
        # Alternative names that might be in the dataset
        'normal': 'Normal',
        'pre-cancerous': 'PreCancerous',
        'precancerous': 'PreCancerous',
        'cancerous': 'Cancerous',
        'cancer': 'Cancerous',
        'OSCC': 'Cancerous',  # Oral Squamous Cell Carcinoma
        'OPMD': 'PreCancerous',  # Oral Potentially Malignant Disorder
    }
    
    # Create output directories
    for split in ['train', 'validation', 'test']:
        for class_name in ['Normal', 'PreCancerous', 'Cancerous']:
            (output_path / split / class_name).mkdir(parents=True, exist_ok=True)
    
    print("Preparing dataset...")
    print(f"Source: {source_path}")
    print(f"Output: {output_path}")
    
    # Process each class
    for source_class_dir in source_path.iterdir():
        if not source_class_dir.is_dir():
            continue
        
        # Map to standard class name
        class_name = class_mapping.get(source_class_dir.name)
        if class_name is None:
            print(f"Warning: Unknown class '{source_class_dir.name}', skipping...")
            continue
        
        print(f"\nProcessing class: {source_class_dir.name} -> {class_name}")
        
        # Get all image files
        image_files = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.bmp']:
            image_files.extend(list(source_class_dir.glob(ext)))
            image_files.extend(list(source_class_dir.glob(ext.upper())))
        
        if not image_files:
            print(f"  Warning: No images found in {source_class_dir}")
            continue
        
        # Shuffle images
        random.shuffle(image_files)
        
        total_images = len(image_files)
        train_count = int(total_images * train_split)
        val_count = int(total_images * val_split)
        
        # Split images
        train_images = image_files[:train_count]
        val_images = image_files[train_count:train_count + val_count]
        test_images = image_files[train_count + val_count:]
        
        print(f"  Total images: {total_images}")
        print(f"  Train: {len(train_images)}, Val: {len(val_images)}, Test: {len(test_images)}")
        
        # Copy images to respective directories
        for img_path in train_images:
            shutil.copy2(img_path, output_path / 'train' / class_name / img_path.name)
        
        for img_path in val_images:
            shutil.copy2(img_path, output_path / 'validation' / class_name / img_path.name)
        
        for img_path in test_images:
            shutil.copy2(img_path, output_path / 'test' / class_name / img_path.name)
    
    print("\n" + "="*50)
    print("Dataset preparation complete!")
    print("="*50)
    
    # Print summary
    for split in ['train', 'validation', 'test']:
        print(f"\n{split.upper()}:")
        for class_name in ['Normal', 'PreCancerous', 'Cancerous']:
            class_dir = output_path / split / class_name
            count = len(list(class_dir.glob('*.*')))
            print(f"  {class_name}: {count} images")


if __name__ == '__main__':
    # Example usage
    # Update these paths according to your setup
    
    # Path where you downloaded the Kaggle dataset
    source_directory = r'c:\Users\padhb\OneDrive\Documents\Desktop\advance oral cancer\dataset\raw'
    
    # Path where prepared dataset will be saved
    output_directory = r'c:\Users\padhb\OneDrive\Documents\Desktop\advance oral cancer\dataset\prepared'
    
    # Set random seed for reproducibility
    random.seed(42)
    
    # Prepare dataset
    prepare_dataset(source_directory, output_directory)
