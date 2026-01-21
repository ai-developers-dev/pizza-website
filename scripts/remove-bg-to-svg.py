#!/usr/bin/env python3
"""
Remove background from an image and convert to SVG.

Usage:
    python3 remove-bg-to-svg.py <input_image> [output_name]

Requirements (auto-installed if missing):
    pip3 install rembg pillow vtracer
"""

import subprocess
import sys
import os

def install_deps():
    """Install required dependencies."""
    deps = ['rembg[cli]', 'pillow', 'vtracer']
    for dep in deps:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', dep])
        except subprocess.CalledProcessError:
            print(f"Warning: Could not install {dep}")

# Check and install dependencies
try:
    from rembg import remove
    from PIL import Image
    import vtracer
except ImportError:
    print("Installing dependencies...")
    install_deps()
    from rembg import remove
    from PIL import Image
    import vtracer

def remove_background(input_path, output_path):
    """Remove background from image using rembg."""
    print(f"Removing background from {input_path}...")

    with open(input_path, 'rb') as inp:
        input_data = inp.read()

    output_data = remove(input_data)

    with open(output_path, 'wb') as out:
        out.write(output_data)

    print(f"Saved transparent PNG: {output_path}")
    return output_path

def convert_to_svg(input_path, output_path):
    """Convert PNG to SVG using vtracer."""
    print(f"Converting to SVG...")

    vtracer.convert_image_to_svg_py(
        input_path,
        output_path,
        colormode='color',        # Full color tracing
        hierarchical='stacked',   # Stacked layers
        mode='spline',            # Smooth curves
        filter_speckle=4,         # Remove small noise
        color_precision=6,        # Color accuracy
        layer_difference=16,      # Layer separation
        corner_threshold=60,      # Corner detection
        length_threshold=4.0,     # Path simplification
        max_iterations=10,        # Optimization iterations
        splice_threshold=45,      # Path splicing
        path_precision=3          # Path coordinate precision
    )

    print(f"Saved SVG: {output_path}")
    return output_path

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 remove-bg-to-svg.py <input_image> [output_name]")
        print("Example: python3 remove-bg-to-svg.py pizza.png pizza-nobg")
        sys.exit(1)

    input_path = sys.argv[1]

    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        sys.exit(1)

    # Determine output names
    base_dir = os.path.dirname(input_path) or '.'
    base_name = os.path.splitext(os.path.basename(input_path))[0]

    if len(sys.argv) >= 3:
        output_name = sys.argv[2]
    else:
        output_name = f"{base_name}-nobg"

    png_output = os.path.join(base_dir, f"{output_name}.png")
    svg_output = os.path.join(base_dir, f"{output_name}.svg")

    # Step 1: Remove background
    remove_background(input_path, png_output)

    # Step 2: Convert to SVG
    convert_to_svg(png_output, svg_output)

    print("\nDone!")
    print(f"  PNG (transparent): {png_output}")
    print(f"  SVG (vector):      {svg_output}")

if __name__ == '__main__':
    main()
