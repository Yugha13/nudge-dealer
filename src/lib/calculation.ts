// Import the store type for TypeScript
import { useDataStore, type PO } from '@/store/useDataStore';
// Create a function to get the store without hooks
const getDataStore = () => {
  // This is a workaround to use the store outside of React components
  if (typeof window !== 'undefined' && window.__DATA_STORE__) {
    return window.__DATA_STORE__.getState();
  }
  return { pos: [], openpos: [] };
};

// Helper function to safely access PO properties
const getPoAmount = (po: PO): number => typeof po.poAmount === 'number' ? po.poAmount : 0;
const getOrderedQty = (po: PO): number => typeof po.orderedQty === 'number' ? po.orderedQty : 0;
const getReceivedQty = (po: PO): number => typeof po.receivedQty === 'number' ? po.receivedQty : 0;

export const SumOfBilling = (): number => {
  const { pos } = getDataStore();
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  return pos.reduce((acc: number, cur: PO) => acc + getPoAmount(cur), 0);
};

// Fill Rate = (Received Qty * 100) / Ordered Qty
export const FillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  const totalOrdered = pos.reduce((acc: number, cur: PO) => acc + getOrderedQty(cur), 0);
  const totalReceived = pos.reduce((acc: number, cur: PO) => acc + getReceivedQty(cur), 0);
  
  if (totalOrdered === 0) return 0;
  
  const fillRate = (totalReceived * 100) / totalOrdered;
  return parseFloat(fillRate.toFixed(2));
};

// LFR (Line Fill Rate) = Average of (Ordered Qty == Received Qty)
export const LineFillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  const perfectLines = pos.filter((po: PO) => getOrderedQty(po) === getReceivedQty(po)).length;
  const lineFillRate = (perfectLines * 100) / pos.length;
  return parseFloat(lineFillRate.toFixed(2));
};

// URF (Unit Receipt Fill Rate) = (Received Qty * 100) / Ordered Qty
export const UnitReceiptFillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  const totalOrdered = pos.reduce((acc: number, cur: PO) => acc + getOrderedQty(cur), 0);
  const totalReceived = pos.reduce((acc: number, cur: PO) => acc + getReceivedQty(cur), 0);
  
  if (totalOrdered === 0) return 0;
  
  const urf = (totalReceived * 100) / totalOrdered;
  return parseFloat(urf.toFixed(2));
};

// NZFR (Non-Zero Fill Rate) = Percentage of lines with at least one item received
export const NonZeroFillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  const nonZeroLines = pos.filter((po: PO) => getReceivedQty(po) > 0).length;
  const nzfr = (nonZeroLines * 100) / pos.length;
  return parseFloat(nzfr.toFixed(2));
};

export const TotalOrders = (): number => {
  const { pos } = getDataStore();
  return Array.isArray(pos) ? pos.length : 0;
};

// Export a function to get all metrics at once for better performance
export const getAllMetrics = () => ({
  revenue: SumOfBilling(),
  fillRate: FillRate(),
  lineFillRate: LineFillRate(),
  nzfr: NonZeroFillRate(),
  totalOrders: TotalOrders(),
  unitReceiptFillRate: UnitReceiptFillRate()
});

export const Mapping = () => {
  const {pos, landingRates } = useDataStore();
  if(!pos) return
  // Create a map for quick lookup of landing rates by skuid
  const landingRateMap = new Map(landingRates.map(rate => [rate.skuId, rate]));
  
  // Map pos items to their corresponding landing rates using skucode -> skuid mapping
  const mappedData = pos.map(po => {
    const landingRateData = landingRateMap.get(po.skuCode);
    return {
      poNumber: po.poNumber,
      vendor: po.vendor,
      orderedQty: po.orderedQty,
      receivedQty: po.receivedQty,
      poAmount: po.poAmount,
      skuCode: landingRateData?.skuId || po.skuCode, // Fallback to original skuCode
      units: ((landingRateData?.cases || 1)),
      cases: (po.orderedQty / (landingRateData?.cases || 1)),
      grncase: (po.receivedQty / (landingRateData?.cases || 1)),
      mrp: landingRateData?.mrp || 0,
      landingRate: landingRateData?.landingRate || 0,
      skuDescription: po.skuDescription,
      poLineValueWithTax: po.poLineValueWithTax,
      grnBillValue: po.receivedQty * (landingRateData?.landingRate || 0),
      status: po.status
    };
  });
  
  console.log("Mapped data: ", mappedData);
  
  return mappedData;
};

// Hook for updating universal PO - must be used in React components
export const useUpdateUniversalPO = () => {
  const { setUniversalPo } = useDataStore();
  
  const updateUniversalPO = () => {
    const mappedData = Mapping();
    setUniversalPo(mappedData);
    return mappedData;
  };
  
  return updateUniversalPO;
};

// sum of PO billvalue = status !expired  | sum of poLineValueWithTax
// sum of PO case = status !expired | sum of orderQty cases

// status completed sum of polinewithtax = sum of closedPO billvalue
// status completed | cases = sum of closedPO cases

// --grn-- -> reviced qty > 0 && status completed
// sum of grn bill value => 
// sum of grn cases


// cosolidation //

// Sum of PO billing value for status: completed, confirmed, expired
export const SumOfPOBillingValue = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  const allowedStatuses = ['completed', 'confirmed', 'expired'];
  return mappedData
    .filter(po => allowedStatuses.includes(po.status?.toLowerCase() || ''))
    .reduce((acc: number, cur) => acc + (cur.poLineValueWithTax || 0), 0);
};

// Sum of PO cases for status: completed, confirmed, expired
export const SumOfPOCases = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  const allowedStatuses = ['completed', 'confirmed', 'expired'];
  return mappedData
    .filter(po => allowedStatuses.includes(po.status?.toLowerCase() || ''))
    .reduce((acc: number, cur) => acc + (cur.cases || 0), 0);
};

// Sum of closed PO billing value for status: completed (from poLineValueWithTax)
export const SumOfClosedPOBillingValue = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  return mappedData
    .filter(po => po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.poLineValueWithTax || 0), 0);
};

// Sum of closed PO cases for status: completed (ordered quantity converted to cases)
export const SumOfClosedPOCases = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  // Get unique mapped data by poNumber
  const uniqueMappedData = mappedData.filter((po, index, arr) => 
    arr.findIndex(item => item.poNumber === po.poNumber) === index
  );
  
  return uniqueMappedData
    .filter(po => po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.cases || 0), 0);
};

// Sum of open PO billing value from openpos data (from poLineValueWithTax)
export const SumOfOpenPOBillingValue = (): number => {
  const { openpos } = getDataStore();
  if (!openpos || !Array.isArray(openpos) || openpos.length === 0) return 0;
  
  return openpos.reduce((acc: number, cur) => acc + (cur.poLineValueWithTax || 0), 0);
};

// Sum of GRN bill value for items with receivedQty > 0 and status: completed
export const SumOfGrnBillValue = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  return mappedData
    .filter(po => po.receivedQty > 0 && po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.grnBillValue || 0), 0);
};
export const SumOfGrnCases = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  return mappedData
    .filter(po => po.receivedQty > 0 && po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.grncase || 0), 0);
}
export const POBillingValue = () => {
  return 0
}

