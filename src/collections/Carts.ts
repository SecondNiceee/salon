import { isLoggedIn, isOwn } from '@/utils/accessUtils';
import { beforeValidateHook } from '@/utils/beforeValidateHook';
import type { CollectionConfig } from 'payload';

const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    hidden : true,
    defaultColumns: ['user', 'updatedAt'],
  },
  access: {
    read: isOwn,
    create: isLoggedIn,
    update: isOwn,
    delete: isOwn,
  },
  hooks: {
    beforeValidate: [
      beforeValidateHook
    ]
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        description: 'Cart owner (auto-assigned)',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description: 'Items in cart',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
      ],
    },
  ],
};

export default Carts;
