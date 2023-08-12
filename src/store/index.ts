import {hookstate} from '@hookstate/core';

type Store = {
  category: Category[];
};

export type Category = {
  id: string;
  name: string;
  fields: Field[];
  machines?: Machine[];
};

export type Field = {
  name?: string;
  value?: string | boolean;
  type: FieldType;
};

export type Machine = {
  name: string;
  fields: Field[];
};

export type FieldType = 'Text' | 'Date' | 'Checkbox' | 'Number';

export const store = hookstate<Store>({
  category: [],
});
