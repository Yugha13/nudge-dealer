import { useState, useMemo } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download, 
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  X,
  FilterX,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

interface Vendor {
  id: string
  name: string
  email: string
  dateCreated: string
  revenue: number
  status: "active" | "inactive" | "pending"
  avatar: string
  color: string
}

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "TechSupply Pro",
    email: "contact@techsupply.com",
    dateCreated: "March 23, 2023",
    revenue: 125450,
    status: "active",
    avatar: "TS",
    color: "bg-blue-500"
  },
  {
    id: "2", 
    name: "Global Logistics",
    email: "info@globallogistics.com",
    dateCreated: "February 8, 2023", 
    revenue: 89543,
    status: "active",
    avatar: "GL",
    color: "bg-green-500"
  },
  {
    id: "3",
    name: "Premium Materials",
    email: "sales@premiummaterials.com", 
    dateCreated: "March 20, 2023",
    revenue: 156884,
    status: "inactive",
    avatar: "PM", 
    color: "bg-orange-500"
  },
  {
    id: "4",
    name: "Swift Delivery",
    email: "orders@swiftdelivery.com",
    dateCreated: "January 10, 2023",
    revenue: 67450,
    status: "active", 
    avatar: "SD",
    color: "bg-purple-500"
  },
  {
    id: "5",
    name: "Quality First Co.",
    email: "support@qualityfirst.com",
    dateCreated: "April 4, 2023",
    revenue: 94765,
    status: "pending",
    avatar: "QF",
    color: "bg-red-500"
  },
  {
    id: "6", 
    name: "Eco Solutions",
    email: "hello@ecosolutions.com",
    dateCreated: "April 10, 2023",
    revenue: 112843,
    status: "active",
    avatar: "ES",
    color: "bg-teal-500"
  }
]

type SortKey = "name" | "dateCreated" | "revenue" | "status"
type SortDirection = "asc" | "desc" | null

interface SortConfig {
  key: SortKey
  direction: SortDirection
}

export function VendorsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" })
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredVendors = useMemo(() => {
    let result = [...mockVendors]
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(vendor => 
        vendor.name.toLowerCase().includes(term) ||
        vendor.email.toLowerCase().includes(term) ||
        vendor.id.includes(term)
      )
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(vendor => vendor.status === statusFilter)
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue: any, bValue: any
        
        if (sortConfig.key === 'dateCreated') {
          aValue = new Date(a.dateCreated).getTime()
          bValue = new Date(b.dateCreated).getTime()
        } else {
          aValue = a[sortConfig.key as keyof Vendor]
          bValue = b[sortConfig.key as keyof Vendor]
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    return result
  }, [searchTerm, statusFilter, sortConfig])

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null
    }
    setSortConfig({ key, direction })
  }
  
  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    if (sortConfig.direction === 'asc') return <ChevronUp className="ml-2 h-4 w-4" />
    if (sortConfig.direction === 'desc') return <ChevronDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-1">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              className="pl-9 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-10">
              <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchTerm || statusFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
            >
              <FilterX className="mr-1.5 h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          
          <Button size="sm" className="h-9 gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Vendor
            </span>
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="relative overflow-x-auto">
          <Table className="min-w-[800px] md:min-w-full">
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <span>ID</span>
                    <button 
                      onClick={() => requestSort('name')}
                      className={cn(
                        "ml-1.5 flex items-center rounded p-0.5 transition-colors",
                        sortConfig.key === 'name' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'
                      )}
                    >
                      {getSortIcon('name')}
                    </button>
                  </div>
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <span>Vendor</span>
                    <button 
                      onClick={() => requestSort('name')}
                      className={cn(
                        "ml-1.5 flex items-center rounded p-0.5 transition-colors",
                        sortConfig.key === 'name' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'
                      )}
                    >
                      {getSortIcon('name')}
                    </button>
                  </div>
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <span>Email</span>
                  </div>
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <span>Date Added</span>
                    <button 
                      onClick={() => requestSort('dateCreated')}
                      className={cn(
                        "ml-1.5 flex items-center rounded p-0.5 transition-colors",
                        sortConfig.key === 'dateCreated' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'
                      )}
                    >
                      {getSortIcon('dateCreated')}
                    </button>
                  </div>
                </TableHead>
                <TableHead className="text-right font-medium text-muted-foreground">
                  <div className="flex items-center justify-end">
                    <span>Revenue</span>
                    <button 
                      onClick={() => requestSort('revenue')}
                      className={cn(
                        "ml-1.5 flex items-center rounded p-0.5 transition-colors",
                        sortConfig.key === 'revenue' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'
                      )}
                    >
                      {getSortIcon('revenue')}
                    </button>
                  </div>
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <span>Status</span>
                    <button 
                      onClick={() => requestSort('status')}
                      className={cn(
                        "ml-1.5 flex items-center rounded p-0.5 transition-colors",
                        sortConfig.key === 'status' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'
                      )}
                    >
                      {getSortIcon('status')}
                    </button>
                  </div>
                </TableHead>
                <TableHead className="w-[50px] text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <motion.tr 
                      key={vendor.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="group hover:bg-muted/30 border-t border-border/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedVendors.includes(vendor.id)}
                            onChange={(e) => {
                              setSelectedVendors(prev => 
                                e.target.checked 
                                  ? [...prev, vendor.id]
                                  : prev.filter(id => id !== vendor.id)
                              )
                            }}
                          />
                          <span>{vendor.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${vendor.color} flex items-center justify-center text-white font-medium`}>
                            {vendor.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{vendor.name}</div>
                            <div className="text-xs text-muted-foreground">Vendor ID: {vendor.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <a href={`mailto:${vendor.email}`} className="hover:text-primary hover:underline">
                          {vendor.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(vendor.dateCreated), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex flex-col items-end">
                          <span>${vendor.revenue.toLocaleString()}</span>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            +{Math.floor(Math.random() * 20) + 5}% from last month
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={vendor.status === 'active' ? 'default' : 'secondary'}
                          className={cn(
                            'capitalize text-xs font-medium px-2.5 py-1 rounded-full',
                            vendor.status === 'active' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                            vendor.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                            vendor.status === 'inactive' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                            'flex items-center gap-1.5 w-fit'
                          )}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            vendor.status === 'active' ? 'bg-green-500' : 
                            vendor.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600 focus:text-red-600">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 py-6">
                        <User className="h-10 w-10 text-muted-foreground/40" />
                        <div className="text-muted-foreground">No vendors found</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setSearchTerm('')
                            setStatusFilter('all')
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground">
          {selectedVendors.length > 0 ? (
            <span>{selectedVendors.length} of {filteredVendors.length} row{selectedVendors.length !== 1 ? 's' : ''} selected</span>
          ) : (
            <span>Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, filteredVendors.length)}</span> of <span className="font-medium">{filteredVendors.length}</span> vendor{filteredVendors.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-9 p-0" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-9 p-0"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}