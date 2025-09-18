import { StoreApi } from 'zustand';
import { Store } from '@/store/useDataStore';

declare global {
  interface Window {
    __DATA_STORE__: StoreApi<Store>;
  }
}
