import type { DefineMethods } from 'aspida';
import type { TweetModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  // get: {
  //   resBody: TrendModel[];
  // };

  get: {
    resBody: TweetModel[];
  };
}>;
