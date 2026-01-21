import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Timeline in frames (30fps, 5 seconds = 150 frames)
const TIMELINE = {
  // 0-1.5s: Pizza tilted toward viewer
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
  // 4.2-5.0s: Pepperoni descend
  DESCEND_START: 126,
  DESCEND_END: 150,
};

// Pepperoni positions (normalized -1 to 1, mapped from the actual pizza image)
// These positions approximate where pepperoni appear on the pizza
const PEPPERONI_POSITIONS = [
  // Inner ring
  { x: -0.15, y: -0.2, scale: 0.9 },
  { x: 0.2, y: -0.15, scale: 0.95 },
  { x: 0.1, y: 0.2, scale: 0.85 },
  { x: -0.2, y: 0.15, scale: 0.9 },
  // Middle ring
  { x: -0.35, y: -0.1, scale: 1.0 },
  { x: -0.25, y: -0.35, scale: 0.95 },
  { x: 0.1, y: -0.4, scale: 0.9 },
  { x: 0.35, y: -0.2, scale: 1.0 },
  { x: 0.4, y: 0.1, scale: 0.95 },
  { x: 0.25, y: 0.35, scale: 0.9 },
  { x: -0.1, y: 0.4, scale: 1.0 },
  { x: -0.38, y: 0.2, scale: 0.95 },
  // Outer ring
  { x: -0.5, y: -0.25, scale: 0.85 },
  { x: -0.35, y: -0.5, scale: 0.9 },
  { x: 0.0, y: -0.55, scale: 0.85 },
  { x: 0.35, y: -0.45, scale: 0.9 },
  { x: 0.55, y: -0.1, scale: 0.85 },
  { x: 0.5, y: 0.25, scale: 0.9 },
  { x: 0.3, y: 0.5, scale: 0.85 },
  { x: -0.05, y: 0.55, scale: 0.9 },
  { x: -0.4, y: 0.45, scale: 0.85 },
  { x: -0.55, y: 0.1, scale: 0.9 },
];

interface PepperoniProps {
  x: number;
  y: number;
  scale: number;
  pizzaRadius: number;
  liftHeight: number;
}

const Pepperoni: React.FC<PepperoniProps> = ({ x, y, scale, pizzaRadius, liftHeight }) => {
  const frame = useCurrentFrame();

  const baseX = x * pizzaRadius * 0.85;
  const baseY = y * pizzaRadius * 0.85;
  const size = 38 * scale;

  // Calculate lift amount
  let liftAmount = 0;

  if (frame >= TIMELINE.LIFT_START && frame < TIMELINE.LIFT_END) {
    const t = (frame - TIMELINE.LIFT_START) / (TIMELINE.LIFT_END - TIMELINE.LIFT_START);
    const eased = 1 - Math.pow(1 - t, 3);
    liftAmount = eased * liftHeight;
  } else if (frame >= TIMELINE.HOVER_START && frame < TIMELINE.HOVER_END) {
    const hoverProgress = (frame - TIMELINE.HOVER_START) / (TIMELINE.HOVER_END - TIMELINE.HOVER_START);
    const floatOffset = Math.sin(hoverProgress * Math.PI * 2) * 6;
    liftAmount = liftHeight + floatOffset;
  } else if (frame >= TIMELINE.DESCEND_START && frame <= TIMELINE.DESCEND_END) {
    const t = (frame - TIMELINE.DESCEND_START) / (TIMELINE.DESCEND_END - TIMELINE.DESCEND_START);
    const eased = t * t * t;
    liftAmount = liftHeight * (1 - eased);
  }

  // Shadow properties
  const shadowOpacity = interpolate(liftAmount, [0, liftHeight], [0, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shadowBlur = interpolate(liftAmount, [0, liftHeight], [2, 18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shadowScale = interpolate(liftAmount, [0, liftHeight], [1, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Shadow */}
      {liftAmount > 0 && (
        <div
          style={{
            position: 'absolute',
            left: `calc(50% + ${baseX}px - ${size / 2}px)`,
            top: `calc(50% + ${baseY}px - ${size / 2}px)`,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: `rgba(0, 0, 0, ${shadowOpacity})`,
            filter: `blur(${shadowBlur}px)`,
            transform: `scale(${shadowScale})`,
          }}
        />
      )}
      {/* Pepperoni */}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${baseX}px - ${size / 2}px)`,
          top: `calc(50% + ${baseY}px - ${size / 2}px - ${liftAmount}px)`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `
            radial-gradient(ellipse at 30% 30%, rgba(255, 100, 80, 0.7), transparent 50%),
            radial-gradient(ellipse at 70% 70%, rgba(60, 15, 5, 0.5), transparent 45%),
            radial-gradient(circle at 50% 50%, #B22222 0%, #8B0000 50%, #5C0000 100%)
          `,
          boxShadow: `
            inset 0 2px 4px rgba(255, 120, 100, 0.4),
            inset 0 -2px 5px rgba(0, 0, 0, 0.5),
            0 1px 3px rgba(0, 0, 0, 0.3)
          `,
        }}
      />
    </>
  );
};

export const PizzaExplode: React.FC<{
  backgroundColor?: string;
}> = ({ backgroundColor = 'white' }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Pizza rotation
  const rotationProgress = interpolate(
    frame,
    [TIMELINE.ROTATE_START, TIMELINE.ROTATE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const easedRotation = rotationProgress < 0.5
    ? 2 * rotationProgress * rotationProgress
    : 1 - Math.pow(-2 * rotationProgress + 2, 2) / 2;
  const tiltAngle = 55 - easedRotation * 55;

  // Scale for perspective
  const perspectiveScale = interpolate(tiltAngle, [0, 55], [1, 0.88], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pizza size - fill most of the frame
  const pizzaSize = Math.min(width, height) * 0.75;
  const pizzaRadius = pizzaSize / 2;

  // Lift height for pepperoni
  const liftHeight = pizzaSize * 0.4;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* 3D Container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          perspective: 1500,
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Pizza with rotation */}
        <div
          style={{
            position: 'relative',
            width: pizzaSize,
            height: pizzaSize,
            transform: `rotateX(${tiltAngle}deg) scale(${perspectiveScale})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Pizza SVG */}
          <Img
            src={staticFile('images/pepperoni-pizza.svg')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />

          {/* Pepperoni layer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            {PEPPERONI_POSITIONS.map((pos, i) => (
              <Pepperoni
                key={i}
                x={pos.x}
                y={pos.y}
                scale={pos.scale}
                pizzaRadius={pizzaRadius}
                liftHeight={liftHeight}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
