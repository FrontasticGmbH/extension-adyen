import * as PaymentActions from './actionControllers';
import { ExtensionRegistry } from '@frontastic/extension-types';

export default {
  actions: {
    payment: PaymentActions,
  },
} as ExtensionRegistry;
