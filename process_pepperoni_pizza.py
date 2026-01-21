import os
from PIL import Image
from rembg import remove
import io
from tqdm import tqdm

input_dir = "/Users/dougallen/Desktop/Pizza Website/public/images/pepperoni-pizza"
output_dir = "/Users/dougallen/Desktop/Pizza Website/public/images/pepperoni-pizza-no-background"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Helper to find all frames
frames = sorted([f for f in os.listdir(input_dir) if f.startswith("frame_") and f.endswith(".jpg")])

print(f"Processing {len(frames)} frames from {input_dir}...")

for i, filename in enumerate(tqdm(frames), 1):
    input_path = os.path.join(input_dir, filename)
    output_filename = f"frame_{i}.png"
    output_path = os.path.join(output_dir, output_filename)
    
    if os.path.exists(output_path):
        continue

    try:
        with open(input_path, 'rb') as f:
            input_data = f.read()
            
            # 1. Remove background
            result_data = remove(input_data)
            
            # 2. Open with PIL for watermark masking
            img = Image.open(io.BytesIO(result_data))
            img = img.convert("RGBA")
            width, height = img.size
            
            # Mask the bottom 12% to catch watermarks
            mask_height = int(height * 0.12)
            
            pixels = img.load()
            for y in range(height - mask_height, height):
                for x in range(width):
                    pixels[x, y] = (0, 0, 0, 0) # Transparent
            
            # 3. Save as PNG
            img.save(output_path, "PNG")
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Processing complete!")
