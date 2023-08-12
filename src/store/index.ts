import {hookstate} from '@hookstate/core';

type Store = {
  category: Category[];
};

type Category = {
  name: string;
  fields: Field[];
  machines?: Machine[];
  titleField?: Field;
};

type Field = {
  text?: string;
  date?: Date;
  checkbox?: boolean;
  number?: number;
};

type Machine = {
  titleField?: string;
  fields?: Field[];
};

export const store = hookstate<Store>({
  category: [
    {
      name: 'Buldozer',
      fields: [{text: 'hello'}],
    },
  ],
});
