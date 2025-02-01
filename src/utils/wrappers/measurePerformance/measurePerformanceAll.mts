import { AnyFunction } from '@src/@types/anyFunction.js';
import measurePerformance from '@utils/wrappers/measurePerformance/measurePerformance.mjs';

const measurePerformanceAll = <T extends Record<string, AnyFunction>>(
  obj: T,
): T => {
  return Object.entries(obj).reduce((previousValue, [keyName, fn]) => {
    return {
      ...previousValue,
      [keyName]: measurePerformance(fn, { functionName: keyName }),
    };
  }, {} as T);
};

export default measurePerformanceAll;
