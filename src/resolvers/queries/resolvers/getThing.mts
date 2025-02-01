import { IFieldResolver } from '@graphql-tools/utils';
import { IMyReturnType } from '@src/generated/schema.mjs';

const getThing: IFieldResolver<null, unknown, null> = async (
  parent,
  args,
  context,
): Promise<IMyReturnType> => {
  return {
    id: 'getThing1',
    name: 'getThing1',
  };
};

export default getThing;
