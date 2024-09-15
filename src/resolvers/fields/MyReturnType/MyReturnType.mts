import { IMyReturnType } from '@src/generated/schema.mjs';

const MyReturnType = {
  MyReturnType: {
    __resolveReference(myReturnType: IMyReturnType): IMyReturnType {
      return {
        id: 'xxxx2',
        name: 'yyyy2',
      };
    },
  },
};

export default MyReturnType;
