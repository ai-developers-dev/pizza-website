import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';

const FRAME_COUNT = 192;

export const PizzaSpin: React.FC<{
  backgroundColor?: string;
}> = ({ backgroundColor = 'white' }) => {
  const frame = useCurrentFrame();

  // Map current video frame to pizza image frame (1-indexed)
  const pizzaFrame = (frame % FRAME_COUNT) + 1;
  const imageSrc = staticFile(`images/pepperoni-pizza-no-background/frame_${pizzaFrame}.png`);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
      }}
    >
      <Img
        src={imageSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};
