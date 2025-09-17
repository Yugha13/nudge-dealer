import { useDataStore } from "@/store/useDataStore";

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
