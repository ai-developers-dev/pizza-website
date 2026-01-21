import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { PepperoniExplosion } from './components/PepperoniExplosion';
import { TIMELINE } from './utils/pepperoniConfig';

export const PizzaDrop: React.FC<{
  backgroundColor?: string;
}> = ({ backgroundColor = 'white' }) => {
  const frame = useCurrentFrame();

  // Apply easing for smooth rotation
  const rotationProgress = interpolate(
    frame,
    [TIMELINE.ROTATE_START, TIMELINE.ROTATE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // Smooth ease-in-out
  const easedProgress = rotationProgress < 0.5
    ? 2 * rotationProgress * rotationProgress
    : 1 - Math.pow(-2 * rotationProgress + 2, 2) / 2;

  const currentTilt = 60 - easedProgress * 60;

  // Scale to simulate perspective change during rotation
  const perspectiveScale = interpolate(
    currentTilt,
    [0, 60],
    [1, 0.85],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Pizza size
  const pizzaRadius = 280;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        overflow: 'hidden',
      }}
    >
      {/* 3D perspective container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Pizza + pepperoni container with shared rotation */}
        <div
          style={{
            position: 'relative',
            width: pizzaRadius * 2,
            height: pizzaRadius * 2,
            transform: `rotateX(${currentTilt}deg) scale(${perspectiveScale})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Pizza image */}
          <Img
            src={staticFile('images/pepperoni-pizza-no-background/frame_1.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />

          {/* Pepperoni layer - inside the same 3D transform */}
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
            <PepperoniExplosion
              pizzaRadius={pizzaRadius}
              liftHeight={250}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
