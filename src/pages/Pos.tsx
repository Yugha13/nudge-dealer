import { useState, useMemo } from "react";
import * as React from "react";
import { useDataStore } from "@/store/useDataStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconFileSpreadsheet, IconSearch, IconFilter, IconChevronLeft, IconChevronRight, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

// Add type for PO items
interface PoItem {
  poNumber: string;
  vendor: string;
  orderedQty: number;
  receivedQty: number;
  poAmount: number;
  skuCode: string;
  skuDescription: string;
  // For backward compatibility
  itemName?: string;
  itemCode?: string;
}

// Add type for PO group
interface PoGroup {
  poNumber: string;
  vendor: string;
  items: PoItem[];
  totalOrderedQty: number;
  totalReceivedQty: number;
  totalAmount: number;
  isComplete: boolean;
  fillRate: string;
}

const Pos = () => {
  const { pos } = useDataStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const itemsPerPage = 15;

  // Get unique vendors for filter dropdown
  const vendors = useMemo(() => {
    const vendorSet = new Set(pos.map(po => po.vendor));
    return Array.from(vendorSet).sort();
  }, [pos]);

  // Group PO items by PO number
  const groupedPos = useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    pos.forEach(po => {
      if (!groups[po.poNumber]) {
        groups[po.poNumber] = [];
      }
      groups[po.poNumber].push(po);
    });
    
    return groups;
  }, [pos]);

  // Create PO groups with aggregated data
  const poGroups = useMemo(() => {
    return Object.entries(groupedPos).map(([poNumber, items]) => {
      const totalOrderedQty = items.reduce((sum, item) => sum + item.orderedQty, 0);
      const totalReceivedQty = items.reduce((sum, item) => sum + item.receivedQty, 0);
      const totalAmount = items.reduce((sum, item) => sum + (item.poAmount || 0), 0);
      const isComplete = items.every(item => item.receivedQty === item.orderedQty);
      
      return {
        poNumber,
        vendor: items[0].vendor,
        items,
        isExpanded: false,
        totalOrderedQty,
        totalReceivedQty,
        totalAmount,
        isComplete
      };
    });
  }, [groupedPos]);

  // Filter PO groups
  const filteredPos = useMemo(() => {
    return poGroups.filter(group => {
      const matchesSearch = 
        group.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "complete" && group.isComplete) ||
        (statusFilter === "pending" && !group.isComplete);
      
      const matchesVendor = 
        vendorFilter === "all" || group.vendor === vendorFilter;
      
      return matchesSearch && matchesStatus && matchesVendor;
    });
  }, [poGroups, searchTerm, statusFilter, vendorFilter]);

  // Calculate fill rate for each PO group
  const posWithMetrics = useMemo<PoGroup[]>(() => {
    return filteredPos.map(group => {
      const fillRate = group.totalOrderedQty > 0 ? 
        (group.totalReceivedQty * 100) / group.totalOrderedQty : 0;
      
      return {
        ...group,
        fillRate: fillRate.toFixed(2) + '%',
        // Ensure all required PoGroup properties are included
        poNumber: group.poNumber,
        vendor: group.vendor,
        items: group.items,
        totalOrderedQty: group.totalOrderedQty,
        totalReceivedQty: group.totalReceivedQty,
        totalAmount: group.totalAmount,
        isComplete: group.isComplete
      };
    });
  }, [filteredPos]);

  // Pagination logic
  const totalPages = Math.ceil(posWithMetrics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPos = posWithMetrics.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, vendorFilter]);

  // Toggle PO group expansion
  const toggleGroup = (poNumber: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [poNumber]: !prev[poNumber]
    }));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
      <Card className="border-0 shadow-none dark:bg-black"> 
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Purchase Orders</CardTitle>
              <CardDescription>
                {filteredPos.length} of {pos.length} purchase orders
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search POs or vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <IconFilter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={vendorFilter} onValueChange={setVendorFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <IconFilter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedPos.length > 0 ? (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Ordered Qty</TableHead>
                      <TableHead className="text-right">Received Qty</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Fill Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPos.map((group) => (
                      <React.Fragment key={group.poNumber}>
                        <TableRow 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleGroup(group.poNumber)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {expandedGroups[group.poNumber] ? 
                                <IconChevronUp className="h-4 w-4" /> : 
                                <IconChevronDown className="h-4 w-4" />
                              }
                              {group.poNumber}
                            </div>
                          </TableCell>
                          <TableCell>{group.vendor}</TableCell>
                          <TableCell className="text-right">{group.totalOrderedQty}</TableCell>
                          <TableCell className="text-right">{group.totalReceivedQty}</TableCell>
                          <TableCell className="text-right">₹{new Intl.NumberFormat('en-IN').format(parseFloat(group.totalAmount.toFixed(2)))}</TableCell>
                          <TableCell className="text-right">{group.fillRate}</TableCell>
                          <TableCell>
                            <Badge variant={group.isComplete ? "default" : "secondary"}>
                              {group.isComplete ? "Complete" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        
                        {expandedGroups[group.poNumber] && group.items.map((item, itemIndex) => (
                          <TableRow key={`${group.poNumber}-${itemIndex}`} className="bg-muted/10">
                            <TableCell colSpan={2} className="pl-12">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {item.skuCode?.toString() || item.itemCode?.toString() || 'N/A'}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {item.skuDescription?.toString() || item.itemName?.toString() || `Item ${itemIndex + 1}`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.orderedQty}</TableCell>
                            <TableCell className="text-right">{item.receivedQty}</TableCell>
                            <TableCell className="text-right">
                              ₹{new Intl.NumberFormat('en-IN').format(parseFloat((item.poAmount || 0).toFixed(2)))}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.orderedQty > 0 ? ((item.receivedQty / item.orderedQty) * 100).toFixed(2) + '%' : '0%'}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={item.receivedQty === item.orderedQty ? "default" : "secondary"}
                                className="bg-opacity-50"
                              >
                                {item.receivedQty === item.orderedQty ? "Complete" : "Pending"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPos.length)} of {filteredPos.length} entries
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <IconChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    {getPageNumbers().map((page, index) => (
                      <Button
                        key={index}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                        className={page === '...' ? "cursor-default" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <IconChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <IconFileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No purchase orders found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {pos.length === 0 
                  ? "Get started by uploading a CSV or Excel file with purchase order data." 
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
  );
};

export default Pos;