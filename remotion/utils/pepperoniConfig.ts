// Configuration for pepperoni positions on a pizza
// Positions are relative to pizza center, normalized (-1 to 1)

export interface PepperoniSlice {
  id: number;
  // Position on pizza surface (normalized -1 to 1)
  x: number;
  y: number;
  // Size variation
  scale: number;
  // Slight rotation for natural look
  rotation: number;
}

// Generate evenly distributed pepperoni slices
export function generatePepperoniSlices(count: number = 12): PepperoniSlice[] {
  const slices: PepperoniSlice[] = [];

  // Create rings of pepperoni for even distribution
  // Inner ring (3 pepperoni)
  const innerRadius = 0.25;
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
    slices.push({
      id: slices.length,
      x: Math.cos(angle) * innerRadius,
      y: Math.sin(angle) * innerRadius,
      scale: 0.95 + Math.sin(i * 1.5) * 0.1,
      rotation: (i * 37) % 360,
    });
  }

  // Middle ring (5 pepperoni)
  const middleRadius = 0.5;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    slices.push({
      id: slices.length,
      x: Math.cos(angle) * middleRadius,
      y: Math.sin(angle) * middleRadius,
      scale: 0.9 + Math.cos(i * 2.1) * 0.15,
      rotation: (i * 53) % 360,
    });
  }

  // Outer ring (8 pepperoni)
  const outerRadius = 0.75;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
    slices.push({
      id: slices.length,
      x: Math.cos(angle) * outerRadius,
      y: Math.sin(angle) * outerRadius,
      scale: 0.85 + Math.sin(i * 1.7) * 0.1,
      rotation: (i * 41) % 360,
    });
  }

  return slices;
}

// Animation timeline (in frames at 30fps)
export const TIMELINE = {
  // 0-1.5s: Pizza tilted, facing viewer
  TILT_START: 0,
  TILT_END: 45,

  // 1.5-2.5s: Pizza rotates to flat
  ROTATE_START: 45,
  ROTATE_END: 75,

  // 2.5-3.5s: Pepperoni explode upward
  LIFT_START: 75,
  LIFT_END: 105,

  // 3.5-4.2s: Pepperoni hover
  HOVER_START: 105,
  HOVER_END: 126,

  // 4.2-5.0s: Pepperoni descend and land
  DESCEND_START: 126,
  DESCEND_END: 150,

  // Total duration
  TOTAL_FRAMES: 150,
  FPS: 30,
};
