import getThing from '~resolvers/queries/resolvers/getThing.mjs';
import measurePerformanceAll from '~utils/wrappers/measurePerformance/measurePerformanceAll.mjs';

const Queries = {
  Query: measurePerformanceAll({
    getThing: getThing,
  }),
};

export default Queries;
