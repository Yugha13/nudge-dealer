import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  CheckCircle, 
  Download, 
  MoreHorizontal, 
  Search, 
  SlidersHorizontal, 
  Star, 
  TrendingDown, 
  TrendingUp, 
  Users
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Mock data
export interface Product {
  id: string;
  name: string;
  orderCount: number;
  percentage: number;
  category: string;
  lastOrdered: string;
  price: number;
}

export interface Vendor {
  id: number;
  name: string;
  joinedDate: string;
  fillRate: number;
  reliability: number;
  status: 'active' | 'inactive' | 'on-hold';
  orders: number;
  revenue: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  products: Product[];
  paymentTerms: string;
  leadTime: number; // in days
  performance: {
    quality: number;
    delivery: number;
    communication: number;
    average: number;
  };
  notes: string;
}

export const vendorData: Vendor[] = [
  { 
    id: 1, 
    name: 'Acme Inc.', 
    joinedDate: '2023-01-15', 
    fillRate: 98, 
    reliability: 4.8, 
    status: 'active',
    orders: 245,
    revenue: 125000,
    trend: 'up',
    trendValue: 12.5,
    contact: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '(555) 123-4567'
    },
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    paymentTerms: 'Net 30',
    leadTime: 14,
    performance: {
      quality: 4.9,
      delivery: 4.7,
      communication: 4.8,
      average: 4.8
    },
    notes: 'Reliable vendor with excellent communication. Bulk discounts available on orders over $10,000.',
    products: [
      { id: 'p1', name: 'Stainless Steel Fasteners', orderCount: 120, percentage: 49, category: 'Hardware', lastOrdered: '2023-10-15', price: 2.99 },
      { id: 'p2', name: 'Aluminum Brackets', orderCount: 75, percentage: 30.6, category: 'Hardware', lastOrdered: '2023-10-10', price: 4.99 },
      { id: 'p3', name: 'Plastic Clips', orderCount: 50, percentage: 20.4, category: 'Plastic', lastOrdered: '2023-10-05', price: 0.99 },
    ]
  },
  { 
    id: 2, 
    name: 'Techtronics Ltd', 
    joinedDate: '2022-08-22', 
    fillRate: 95, 
    reliability: 4.6, 
    status: 'active',
    orders: 189,
    revenue: 187000,
    trend: 'up',
    trendValue: 8.2,
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah.j@techtronics.com',
      phone: '(555) 234-5678'
    },
    address: {
      street: '456 Tech Park',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    paymentTerms: 'Net 45',
    leadTime: 21,
    performance: {
      quality: 4.8,
      delivery: 4.5,
      communication: 4.7,
      average: 4.67
    },
    notes: 'Specializes in electronic components. Lead times can vary based on component availability.',
    products: [
      { id: 'p4', name: 'Microcontrollers', orderCount: 85, percentage: 45, category: 'Electronics', lastOrdered: '2023-10-14', price: 12.99 },
      { id: 'p5', name: 'Sensors', orderCount: 65, percentage: 34.4, category: 'Electronics', lastOrdered: '2023-10-12', price: 8.50 },
      { id: 'p6', name: 'Connectors', orderCount: 39, percentage: 20.6, category: 'Electronics', lastOrdered: '2023-10-08', price: 0.75 },
    ]
  },
  { 
    id: 3, 
    name: 'Global Textiles', 
    joinedDate: '2023-03-10', 
    fillRate: 92, 
    reliability: 4.2, 
    status: 'active',
    orders: 132,
    revenue: 87500,
    trend: 'neutral',
    trendValue: 0.5,
    contact: {
      name: 'Maria Garcia',
      email: 'maria.g@globaltextiles.com',
      phone: '(555) 345-6789'
    },
    address: {
      street: '789 Fabric Way',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90015',
      country: 'USA'
    },
    paymentTerms: 'Net 30',
    leadTime: 30,
    performance: {
      quality: 4.5,
      delivery: 4.0,
      communication: 4.3,
      average: 4.27
    },
    notes: 'Good quality fabrics but longer lead times. Minimum order quantity applies.',
    products: [
      { id: 'p7', name: 'Cotton Fabric', orderCount: 70, percentage: 53, category: 'Fabric', lastOrdered: '2023-10-13', price: 5.99 },
      { id: 'p8', name: 'Polyester Blend', orderCount: 45, percentage: 34.1, category: 'Fabric', lastOrdered: '2023-10-09', price: 4.25 },
      { id: 'p9', name: 'Linen', orderCount: 17, percentage: 12.9, category: 'Fabric', lastOrdered: '2023-09-28', price: 7.50 },
    ]
  },
  { 
    id: 4, 
    name: 'Precision Tools Co.', 
    joinedDate: '2022-11-05', 
    fillRate: 99, 
    reliability: 4.9, 
    status: 'on-hold',
    orders: 310,
    revenue: 210000,
    trend: 'down',
    trendValue: 5.3,
    contact: {
      name: 'Robert Chen',
      email: 'robert.c@precistiontools.com',
      phone: '(555) 456-7890'
    },
    address: {
      street: '321 Industrial Dr',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    paymentTerms: 'Net 30',
    leadTime: 10,
    performance: {
      quality: 4.9,
      delivery: 4.9,
      communication: 4.8,
      average: 4.87
    },
    notes: 'Currently on hold due to quality control issues in the last batch. Under review.',
    products: [
      { id: 'p10', name: 'Drill Bits Set', orderCount: 150, percentage: 48.4, category: 'Tools', lastOrdered: '2023-10-01', price: 29.99 },
      { id: 'p11', name: 'Wrench Set', orderCount: 95, percentage: 30.6, category: 'Tools', lastOrdered: '2023-09-25', price: 45.50 },
      { id: 'p12', name: 'Screwdriver Set', orderCount: 65, percentage: 21, category: 'Tools', lastOrdered: '2023-09-20', price: 24.99 },
    ]
  },
  { 
    id: 5, 
    name: 'EcoPack Solutions', 
    joinedDate: '2023-05-18', 
    fillRate: 96, 
    reliability: 4.7, 
    status: 'active',
    orders: 87,
    revenue: 52000,
    trend: 'up',
    trendValue: 18.7,
    contact: {
      name: 'Emily Wilson',
      email: 'emily.w@ecopack.com',
      phone: '(555) 567-8901'
    },
    address: {
      street: '654 Green St',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'USA'
    },
    paymentTerms: 'Net 15',
    leadTime: 7,
    performance: {
      quality: 4.8,
      delivery: 4.7,
      communication: 4.9,
      average: 4.8
    },
    notes: 'Eco-friendly packaging solutions. Quick turnaround times and excellent customer service.',
    products: [
      { id: 'p13', name: 'Recycled Boxes', orderCount: 45, percentage: 51.7, category: 'Packaging', lastOrdered: '2023-10-14', price: 1.20 },
      { id: 'p14', name: 'Biodegradable Peanuts', orderCount: 28, percentage: 32.2, category: 'Packaging', lastOrdered: '2023-10-11', price: 3.75 },
      { id: 'p15', name: 'Compostable Mailers', orderCount: 14, percentage: 16.1, category: 'Packaging', lastOrdered: '2023-10-05', price: 0.45 },
    ]
  },
];

const orderData = [
  { month: 'Jan', orders: 200 },
  { month: 'Feb', orders: 300 },
  { month: 'Mar', orders: 450 },
  { month: 'Apr', orders: 350 },
  { month: 'May', orders: 500 },
  { month: 'Jun', orders: 600 },
  { month: 'Jul', orders: 700 },
];

const vendorContribution = [
  { name: 'Vendor A', value: 35 },
  { name: 'Vendor B', value: 25 },
  { name: 'Vendor C', value: 20 },
  { name: 'Others', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function VendorAnalytics() {
  const [timeRange] = useState('monthly');

  const stats = [
    {
      title: 'Fill Rate',
      value: '98.2%',
      change: 2.5,
      trend: 'up',
      icon: CheckCircle,
    },
    {
      title: 'Total Vendors',
      value: '124',
      change: 8,
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Vendors',
      value: '98',
      change: 1.2,
      trend: 'up',
      icon: Activity,
    },
    {
      title: 'Vendor Reliability',
      value: '4.8/5',
      change: 0.3,
      trend: 'down',
      icon: Star,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Vendors</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                {stat.change}% from last {timeRange}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>Monthly order trends</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vendor Contribution</CardTitle>
            <CardDescription>By order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorContribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {vendorContribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Contribution']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendors Table - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
              <CardDescription>Manage your vendor relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vendors..."
                      className="pl-8 w-[200px] lg:w-[336px]"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vendors</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Add Vendor</Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Fill Rate</TableHead>
                      <TableHead>Reliability</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorData.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">
                          <Link to={`/vendors/${vendor.id}`} className="text-primary hover:underline">
                            {vendor.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {new Date(vendor.joinedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 mr-2">
                              <Progress value={vendor.fillRate} className="h-2" />
                            </div>
                            <span>{vendor.fillRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            {vendor.reliability}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={vendor.status === 'active' ? 'default' : 'secondary'}
                            className={vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {vendor.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products - Takes 1/3 of the width */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Most ordered products by vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorData[0]?.products.map((product, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{vendorData[0].name}</p>
                      </div>
                      <span className="text-sm font-medium">{product.percentage}%</span>
                    </div>
                    <Progress value={product.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
