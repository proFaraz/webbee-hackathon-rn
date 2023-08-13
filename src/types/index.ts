import {ImmutableObject} from '@hookstate/core';

import {Category} from '../store';

export type ParamList = {
  Dashboard: undefined;
  [key: string]: undefined | {item: ImmutableObject<Category>; index: number};
  ['Manage Category']: undefined;
};
