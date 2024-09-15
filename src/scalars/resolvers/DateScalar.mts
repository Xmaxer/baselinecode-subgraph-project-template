import dayjs from 'dayjs';
import { GraphQLScalarType, Kind } from 'graphql';

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'ISO 8601 standard date object',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  serialize(value: Date) {
    return dayjs(value).utc().toISOString();
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parseValue(value: string) {
    return dayjs.utc(value).toDate();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return dayjs.utc(ast.value).toDate();
    }
    return null;
  },
});

export default DateScalar;
