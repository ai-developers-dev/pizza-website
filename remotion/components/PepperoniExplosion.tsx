import { useMemo } from 'react';
import { Pepperoni } from './Pepperoni';
import { generatePepperoniSlices } from '../utils/pepperoniConfig';

interface PepperoniExplosionProps {
  pizzaRadius: number;
  liftHeight?: number;
}

export const PepperoniExplosion: React.FC<PepperoniExplosionProps> = ({
  pizzaRadius,
  liftHeight = 200,
}) => {
  // Generate pepperoni slices (memoized for consistent renders)
  const slices = useMemo(() => generatePepperoniSlices(), []);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
      }}
    >
      {slices.map((slice) => (
        <Pepperoni
          key={slice.id}
          slice={slice}
          pizzaRadius={pizzaRadius}
          liftHeight={liftHeight}
        />
      ))}
    </div>
  );
};
