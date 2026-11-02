import React from 'react';
import LottieRaw from 'lottie-react';

// Safely resolve Lottie component across Vite CJS/ESM module boundaries
const getLottieComponent = (): React.ComponentType<any> => {
  if (typeof LottieRaw === 'function') {
    return LottieRaw;
  }
  const rawAny = LottieRaw as any;
  if (typeof rawAny?.default === 'function') {
    return rawAny.default;
  }
  if (typeof rawAny?.default?.default === 'function') {
    return rawAny.default.default;
  }
  return rawAny as React.ComponentType<any>;
};

const ResolvedLottie = getLottieComponent();

const Lottie: React.FC<any> = (props) => {
  return <ResolvedLottie {...props} />;
};

export default Lottie;
