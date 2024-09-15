import { IFieldResolver } from '@graphql-tools/utils';

const doSomething: IFieldResolver<null, null, null> = async (
  parent,
  args,
  context,
): Promise<string> => {
  return 'Bye world!';
};

export default doSomething;
