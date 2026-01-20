#!/usr/bin/env python3
"""
Pizza Image Background Removal Script
--------------------------------------
This script removes the background from all 192 pizza frame images
using the rembg library (which uses the U2-Net model for high-quality results).

Usage:
    1. Install dependencies: pip install rembg pillow
    2. Run: python scripts/remove_backgrounds.py

The script will:
    - Read images from: public/images/pizza-frames/
    - Output to: public/images/pizza-images-no-background/
    - Convert JPG to PNG with transparent backgrounds
"""

import os
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Check for required packages
try:
    from rembg import remove
    from PIL import Image
except ImportError as e:
    print("=" * 60)
    print("Missing required packages!")
    print("Please install them with:")
    print("    pip install rembg pillow")
    print("=" * 60)
    sys.exit(1)


# Configuration
FRAME_COUNT = 192
INPUT_DIR = Path(__file__).parent.parent / "public" / "images" / "pizza-frames"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "images" / "pizza-images-no-background"
MAX_WORKERS = 4  # Number of parallel processes (adjust based on your CPU)


def remove_background(frame_number: int) -> tuple[int, bool, str]:
    """
    Remove background from a single frame.
    
    Args:
        frame_number: The frame number (1-192)
    
    Returns:
        Tuple of (frame_number, success, message)
    """
    input_path = INPUT_DIR / f"frame_{frame_number}.jpg"
    output_path = OUTPUT_DIR / f"frame_{frame_number}.png"
    
    try:
        # Check if input exists
        if not input_path.exists():
            return (frame_number, False, f"Input file not found: {input_path}")
        
        # Skip if output already exists (for resumable processing)
        if output_path.exists():
            return (frame_number, True, "Already processed (skipped)")
        
        # Read the input image
        with open(input_path, "rb") as input_file:
            input_data = input_file.read()
        
        # Remove background using rembg
        output_data = remove(input_data)
        
        # Save the output as PNG with transparency
        with open(output_path, "wb") as output_file:
            output_file.write(output_data)
        
        return (frame_number, True, "Success")
    
    except Exception as e:
        return (frame_number, False, f"Error: {str(e)}")


def main():
    """Main function to process all frames."""
    print("=" * 60)
    print("Pizza Image Background Removal")
    print("=" * 60)
    print(f"Input directory:  {INPUT_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Total frames:     {FRAME_COUNT}")
    print(f"Parallel workers: {MAX_WORKERS}")
    print("=" * 60)
    
    # Verify directories exist
    if not INPUT_DIR.exists():
        print(f"ERROR: Input directory does not exist: {INPUT_DIR}")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Count existing processed files
    existing_count = len(list(OUTPUT_DIR.glob("frame_*.png")))
    print(f"Already processed: {existing_count} / {FRAME_COUNT}")
    
    if existing_count == FRAME_COUNT:
        print("All frames already processed! Delete output files to reprocess.")
        return
    
    print("\nStarting background removal...")
    print("(This may take several minutes depending on your hardware)\n")
    
    start_time = time.time()
    success_count = 0
    skip_count = 0
    error_count = 0
    errors = []
    
    # Process frames in parallel
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Submit all tasks
        futures = {
            executor.submit(remove_background, i): i 
            for i in range(1, FRAME_COUNT + 1)
        }
        
        # Process results as they complete
        for future in as_completed(futures):
            frame_num, success, message = future.result()
            
            if success:
                if "skipped" in message.lower():
                    skip_count += 1
                else:
                    success_count += 1
                    print(f"✓ Frame {frame_num:3d} / {FRAME_COUNT} - {message}")
            else:
                error_count += 1
                errors.append((frame_num, message))
                print(f"✗ Frame {frame_num:3d} / {FRAME_COUNT} - {message}")
    
    elapsed_time = time.time() - start_time
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Processed:  {success_count}")
    print(f"Skipped:    {skip_count}")
    print(f"Errors:     {error_count}")
    print(f"Time:       {elapsed_time:.1f} seconds")
    print("=" * 60)
    
    if errors:
        print("\nErrors encountered:")
        for frame_num, message in errors:
            print(f"  Frame {frame_num}: {message}")
    
    if error_count == 0:
        print("\n✓ All frames processed successfully!")
        print(f"\nOutput saved to: {OUTPUT_DIR}")
    else:
        print(f"\n⚠ Completed with {error_count} errors")
        sys.exit(1)


if __name__ == "__main__":
    main()
