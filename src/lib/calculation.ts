
import { useDataStore } from "@/store/useDataStore";

type PO = {
  poNumber: string;
  vendor: string;
  orderedQty: number;
  receivedQty: number;
  poAmount: number;
};

type VendorAnalysis = {
  vendor: string;
  fillRate: number;
  revenue: number;
};

export const GetVendorsAnalysis = (): VendorAnalysis[] => {
  const { pos } = useDataStore();
  
  // if (pos.length === 0) return [];
  
  // Group POs by vendor
  const vendorMap = new Map<string, PO[]>();
  
  pos.forEach(po => {
    if (vendorMap.has(po.vendor)) {
      vendorMap.get(po.vendor)?.push(po);
    } else {
      vendorMap.set(po.vendor, [po]);
    }
  });
  
  // Calculate analysis for each vendor
  const analysis: VendorAnalysis[] = [];
  
  vendorMap.forEach((vendorPOs, vendor) => {
    const totalOrdered = vendorPOs.reduce((acc, po) => acc + po.orderedQty, 0);
    const totalReceived = vendorPOs.reduce((acc, po) => acc + po.receivedQty, 0);
    const totalRevenue = vendorPOs.reduce((acc, po) => acc + po.poAmount, 0);
    
    const fillRate = totalOrdered > 0 ? (totalReceived * 100) / totalOrdered : 0;
    
    analysis.push({
      vendor,
      fillRate,
      revenue: totalRevenue
    });
  });

  console.log(analysis);
  
  
  return analysis;
};

export const SumOfBilling = () => {
  const { pos } = useDataStore();
  if (pos.length === 0) return 0;
  console.log(pos[0]);
  
  return pos.reduce((acc, cur) => acc + cur.poAmount, 0);
};

// Fill Rate = (Received Qty * 100) / Ordered Qty
export const FillRate = () => {
  const { pos } = useDataStore();
  
  if (pos.length === 0) return 0;
  
  const totalOrdered = pos.reduce((acc, cur) => acc + cur.orderedQty, 0);
  const totalReceived = pos.reduce((acc, cur) => acc + cur.receivedQty, 0);
  
  if (totalOrdered === 0) return 0;
  
  return (totalReceived * 100) / totalOrdered;
};

// LFR (Line Fill Rate) = Average of (Ordered Qty == Received Qty)
export const LineFillRate = () => {
  const { pos } = useDataStore();
  
  if (pos.length === 0) return 0;
  
  const perfectLines = pos.filter(po => po.orderedQty === po.receivedQty).length;
  
  return (perfectLines * 100) / pos.length;
};

// URF (Unit Receipt Fill Rate) = (Received Qty * 100) / Ordered Qty
export const UnitReceiptFillRate = () => {
  const { pos } = useDataStore();
  
  if (pos.length === 0) return 0;
  
  const totalOrdered = pos.reduce((acc, cur) => acc + cur.orderedQty, 0);
  const totalReceived = pos.reduce((acc, cur) => acc + cur.receivedQty, 0);
  
  if (totalOrdered === 0) return 0;
  
  return (totalReceived * 100) / totalOrdered;
};

// NZFR (Non-Zero Fill Rate) = Average of (Received Qty > 0)
export const NonZeroFillRate = () => {
  const { pos } = useDataStore();
  
  if (pos.length === 0) return 0;
  
  const nonZeroReceived = pos.filter(po => po.receivedQty > 0).length;
  
  return (nonZeroReceived * 100) / pos.length;
};

export const TotalOrders = () => {
  const { pos } = useDataStore();
  
  return pos.length;
};


export const GetVendorsFillRate = () => {
  const { pos } = useDataStore();
  if (pos.length === 0) return [];
  const vendors = pos.map(po => po.vendor);
  
  return [...vendors];
}


export const GetVendors = () => {
  const { pos } = useDataStore();
  if (pos.length === 0) return [];
  const vendors = pos.map(po => po.vendor);
  
  return [...vendors];
}

export const GetVendorPOsById = (vendorName: string) => { 
  return GetVendorsAnalysis().find(vendor => vendor.vendor === vendorName);
}

export const GetVendorStats = (vendorName: string) => {
  const {pos} = useDataStore();
  const vendorPOs = pos.filter(po => po.vendor === vendorName);
  
  if (vendorPOs.length === 0) return { fillRate: 0, totalPOs: 0, completedPOs: 0 };
  
  const totalPOs = vendorPOs.length;
  const completedPOs = vendorPOs.filter(po => po.orderedQty === po.receivedQty).length;
  
  const totalOrdered = vendorPOs.reduce((acc, cur) => acc + cur.orderedQty, 0);
  const totalReceived = vendorPOs.reduce((acc, cur) => acc + cur.receivedQty, 0);
  
  const fillRate = totalOrdered > 0 ? (totalReceived * 100) / totalOrdered : 0;
  
  return { fillRate, totalPOs, completedPOs };
}
