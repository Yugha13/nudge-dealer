import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PO = {
  poNumber: string;
  vendor: string;
  orderedQty: number;
  receivedQty: number;
  poAmount: number;
  skuCode: string;
  skuDescription: string;
  poLineValueWithTax: number;
  status: 'completed' | 'confirmed' | 'expired' | 'open';
};

export type LandingRate = {
  key: string;
  skuId: string;
  productName: string;
  mrp: number;
  category: string;
  cases: number;
  merchants: number;
  landingRate: number;
};

type Store = {
  pos: PO[];
  openpos: PO[];
  landingRates: LandingRate[];
  addPO: (po: PO) => void;
  addOpenPO: (po: PO) => void;
  addLandingRate: (rate: LandingRate) => void;
  clearAll: () => void;
};

export const useDataStore = create<Store>()(
  persist(
    (set, get) => ({
      pos: [],
      openpos: [],
      landingRates: [],
      addPO: (po) =>
        set((state) => {
          // Validate PO before adding
          if (!po.poNumber || !po.vendor) {
            console.error('Invalid PO data - missing required fields:', po);
            return state; // Don't add invalid data
          }
          console.log('Adding PO:', po); // Debug log
          const newState = {
            pos: [...state.pos, po],
          };
          console.log('New state after adding PO:', newState); // Debug log
          console.log('Current store state:', get()); // Debug log
          return newState;
        }),
      addOpenPO: (po) =>
        set((state) => {
          // Validate PO before adding
          if (!po.poNumber || !po.vendor) {
            console.error('Invalid OpenPO data - missing required fields:', po);
            return state; // Don't add invalid data
          }
          console.log('Adding OpenPO:', po); // Debug log
          const newState = {
            openpos: [...state.openpos, po],
          };
          console.log('New state after adding OpenPO:', newState); // Debug log
          console.log('Current store state:', get()); // Debug log
          return newState;
        }),
      addLandingRate: (rate) =>
        set((state) => {
          if (!rate.key || !rate.skuId) {
            console.error('Invalid LandingRate data - missing required fields:', rate);
            return state;
          }
          return {
            landingRates: [...state.landingRates, rate],
          };
        }),
      clearAll: () => set({ pos: [], openpos: [], landingRates: []}),
    }),
    {
      name: "erp-data-storage",
      onRehydrateStorage: () => {
        console.log("Store hydration started");
        return (state, error) => {
          if (error) {
            console.error("Store hydration error:", error);
          } else {
            console.log("Store hydrated successfully:", state);
          }
        };
      },
    }
  )
);