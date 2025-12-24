import doSomething from '~resolvers/mutations/resolvers/doSomething.mjs';
import measurePerformanceAll from '~utils/wrappers/measurePerformance/measurePerformanceAll.mjs';

const Mutations = {
  Mutation: measurePerformanceAll({
    doSomething: doSomething,
  }),
};

export default Mutations;
