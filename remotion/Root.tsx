import { Composition } from 'remotion';
import { PizzaSpin } from './PizzaSpin';
import { PizzaDrop } from './PizzaDrop';
import { PizzaExplode } from './PizzaExplode';

const FRAME_COUNT = 192;
const DROP_FRAME_COUNT = 150; // 5 seconds at 30fps
const EXPLODE_FRAME_COUNT = 150; // 5 seconds at 30fps
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Primary composition - matches source aspect ratio (16:9) */}
      <Composition
        id="PizzaSpin"
        component={PizzaSpin}
        durationInFrames={FRAME_COUNT}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Landscape version */}
      <Composition
        id="PizzaSpinLandscape"
        component={PizzaSpin}
        durationInFrames={FRAME_COUNT}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Square version */}
      <Composition
        id="PizzaSpinSquare"
        component={PizzaSpin}
        durationInFrames={FRAME_COUNT}
        fps={FPS}
        width={1080}
        height={1080}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Transparent background version (16:9) */}
      <Composition
        id="PizzaSpinTransparent"
        component={PizzaSpin}
        durationInFrames={FRAME_COUNT}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          backgroundColor: 'transparent',
        }}
      />

      {/* Native resolution - exact source dimensions (no scaling) */}
      <Composition
        id="PizzaSpinNative"
        component={PizzaSpin}
        durationInFrames={FRAME_COUNT}
        fps={FPS}
        width={800}
        height={450}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Pizza Drop with Pepperoni Explosion - 16:9 */}
      <Composition
        id="PizzaDrop"
        component={PizzaDrop}
        durationInFrames={DROP_FRAME_COUNT}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Pizza Drop - Square version */}
      <Composition
        id="PizzaDropSquare"
        component={PizzaDrop}
        durationInFrames={DROP_FRAME_COUNT}
        fps={FPS}
        width={1080}
        height={1080}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Pizza Explode - SVG with pepperoni animation - 16:9 */}
      <Composition
        id="PizzaExplode"
        component={PizzaExplode}
        durationInFrames={EXPLODE_FRAME_COUNT}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Pizza Explode - Square version */}
      <Composition
        id="PizzaExplodeSquare"
        component={PizzaExplode}
        durationInFrames={EXPLODE_FRAME_COUNT}
        fps={FPS}
        width={1080}
        height={1080}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />

      {/* Pizza Explode - 4K version */}
      <Composition
        id="PizzaExplode4K"
        component={PizzaExplode}
        durationInFrames={EXPLODE_FRAME_COUNT}
        fps={FPS}
        width={3840}
        height={2160}
        defaultProps={{
          backgroundColor: 'white',
        }}
      />
    </>
  );
};
