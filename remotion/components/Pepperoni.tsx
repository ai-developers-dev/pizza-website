import { interpolate, useCurrentFrame } from 'remotion';
import { PepperoniSlice, TIMELINE } from '../utils/pepperoniConfig';

interface PepperoniProps {
  slice: PepperoniSlice;
  pizzaRadius: number;
  liftHeight: number;
}

export const Pepperoni: React.FC<PepperoniProps> = ({
  slice,
  pizzaRadius,
  liftHeight,
}) => {
  const frame = useCurrentFrame();

  // Calculate base position on pizza
  const baseX = slice.x * pizzaRadius * 0.85;
  const baseY = slice.y * pizzaRadius * 0.85;

  // Pepperoni size
  const size = 45 * slice.scale;

  // Calculate vertical lift amount based on timeline
  let liftAmount = 0;

  if (frame >= TIMELINE.LIFT_START && frame < TIMELINE.LIFT_END) {
    // Lifting phase - smooth ease out
    const t = (frame - TIMELINE.LIFT_START) / (TIMELINE.LIFT_END - TIMELINE.LIFT_START);
    const eased = 1 - Math.pow(1 - t, 3); // Ease out cubic
    liftAmount = eased * liftHeight;
  } else if (frame >= TIMELINE.HOVER_START && frame < TIMELINE.HOVER_END) {
    // Hovering phase - slight float animation
    const hoverProgress = (frame - TIMELINE.HOVER_START) / (TIMELINE.HOVER_END - TIMELINE.HOVER_START);
    const floatOffset = Math.sin(hoverProgress * Math.PI * 2) * 8;
    liftAmount = liftHeight + floatOffset;
  } else if (frame >= TIMELINE.DESCEND_START && frame <= TIMELINE.DESCEND_END) {
    // Descending phase - smooth ease in
    const t = (frame - TIMELINE.DESCEND_START) / (TIMELINE.DESCEND_END - TIMELINE.DESCEND_START);
    const eased = t * t * t; // Ease in cubic (accelerate as it falls)
    liftAmount = liftHeight * (1 - eased);
  }

  // Calculate shadow properties based on lift height
  const shadowOpacity = interpolate(liftAmount, [0, liftHeight], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shadowBlur = interpolate(liftAmount, [0, liftHeight], [2, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shadowScale = interpolate(liftAmount, [0, liftHeight], [1, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Shadow on pizza surface - stays at Z=0 */}
      {liftAmount > 0 && (
        <div
          style={{
            position: 'absolute',
            left: baseX - size / 2,
            top: baseY - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: `rgba(0, 0, 0, ${shadowOpacity})`,
            filter: `blur(${shadowBlur}px)`,
            transform: `scale(${shadowScale})`,
            transformStyle: 'preserve-3d',
          }}
        />
      )}

      {/* Pepperoni slice - lifts in Z axis (out of pizza) */}
      <div
        style={{
          position: 'absolute',
          left: baseX - size / 2,
          top: baseY - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          // Use translateZ for 3D lift effect
          transform: `translateZ(${liftAmount}px) rotate(${slice.rotation}deg)`,
          transformStyle: 'preserve-3d',
          // Realistic pepperoni with CSS gradients
          background: `
            radial-gradient(ellipse at 30% 30%, rgba(255, 120, 100, 0.6), transparent 50%),
            radial-gradient(ellipse at 70% 70%, rgba(80, 20, 10, 0.4), transparent 40%),
            radial-gradient(circle at 50% 50%, #C41E3A 0%, #8B0000 40%, #5C0000 100%)
          `,
          boxShadow: `
            inset 0 2px 4px rgba(255, 150, 130, 0.3),
            inset 0 -3px 6px rgba(0, 0, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.3)
          `,
        }}
      />
    </>
  );
};
