import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Star, Calendar, Box, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { vendorData, type Vendor } from './VendorAnalytics';

const statusVariantMap = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
};

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the vendor by ID
  const vendor = vendorData.find(v => v.id === Number(id)) as Vendor | undefined;

  if (!vendor) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendors
        </Button>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vendor Not Found</h2>
          <p className="text-muted-foreground">The requested vendor could not be found.</p>
          <Button onClick={() => navigate('/vendors')} className="mt-4">
            Return to Vendors
          </Button>
        </div>
      </div>
    );
  }

  // Calculate performance metrics
  const performanceMetrics = [
    { name: 'Quality', value: vendor.performance.quality },
    { name: 'Delivery', value: vendor.performance.delivery },
    { name: 'Communication', value: vendor.performance.communication },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendors
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Member since {new Date(vendor.joinedDate).toLocaleDateString()}
            </div>
            <Badge 
              variant={vendor.status === 'active' ? 'default' : 'secondary'}
              className={statusVariantMap[vendor.status]}
            >
              {vendor.status === 'on-hold' ? 'On Hold' : vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Edit Vendor
          </Button>
          <Button size="sm">New Order</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Primary Contact</h3>
                  <p className="font-medium">{vendor.contact.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {vendor.contact.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    {vendor.contact.phone}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p>{vendor.address.street}</p>
                      <p>{vendor.address.city}, {vendor.address.state} {vendor.address.zip}</p>
                      <p>{vendor.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Vendor performance over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Fill Rate</h3>
                    <span className="text-sm font-medium">{vendor.fillRate}%</span>
                  </div>
                  <Progress value={vendor.fillRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Reliability</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{vendor.reliability}</span>
                    </div>
                  </div>
                  <Progress value={vendor.reliability * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Lead Time</h3>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {vendor.leadTime} days
                    </div>
                  </div>
                  <Progress value={100 - Math.min(vendor.leadTime * 2, 100)} className="h-2" />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Performance Breakdown</h3>
                {performanceMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className="text-sm text-muted-foreground">{metric.value}/5</span>
                    </div>
                    <Progress value={metric.value * 20} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Most ordered products from this vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vendor.products.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category} • ${product.price.toFixed(2)} each
                        </p>
                      </div>
                      <span className="text-sm font-medium">{product.percentage}% of orders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={product.percentage} className="h-2" />
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {product.orderCount} orders
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last ordered: {new Date(product.lastOrdered).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Box className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Total Orders</span>
                  </div>
                  <span className="font-medium">{vendor.orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Total Revenue</span>
                  </div>
                  <span className="font-medium">${vendor.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Average Lead Time</span>
                  </div>
                  <span className="font-medium">{vendor.leadTime} days</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="text-sm font-medium mb-2">Payment Terms</h3>
                <p className="text-sm text-muted-foreground">{vendor.paymentTerms}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {vendor.notes || 'No notes available for this vendor.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
