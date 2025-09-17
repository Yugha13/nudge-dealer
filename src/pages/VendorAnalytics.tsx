import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GetVendorsAnalysis } from "@/lib/calculation";
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
  const vendorData = GetVendorsAnalysis();
  console.log(vendorData);
  
  const [timeRange] = useState('monthly');

  const stats = [
    {
      title: 'Fill Rate',
      value: (vendorData.reduce((acc, vendor) => acc + vendor.fillRate, 0) / vendorData.length).toFixed(2) + '%',

      change: 2.5,
      trend: 'up',
      icon: CheckCircle,
    },
    {
      title: 'Total Vendors',
      value: vendorData.length,
      change: 8,
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Vendors',
      value: vendorData.length,
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
                      <TableRow key={vendor.vendor}>
                        <TableCell className="font-medium">
                          <Link to={`/vendors/${vendor.vendor}`} className="text-primary hover:underline">
                            {vendor.vendor}
                          </Link>
                        </TableCell>
                        <TableCell>
                          
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 mr-2">
                              <Progress value={vendor.fillRate} className="h-2" />
                            </div>
                            <span>{(vendor.fillRate).toPrecision(2)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            {(Math.random()*10).toPrecision(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={'default'}
                            className={'bg-green-100 text-green-800'}
                          >
                            {'Active'}
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
                {/* {vendorData[0]?.products.map((product, i) => (
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
                ))} */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
