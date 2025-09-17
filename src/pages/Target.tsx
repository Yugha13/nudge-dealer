import { useState } from 'react';
import { Plus, Trash2, Edit, Target, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BusinessTarget {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'sales' | 'customers' | 'inventory' | 'other';
  currentValue: number;
  targetValue: number;
  progress: number;
  deadline: string;
  status: 'on_track' | 'at_risk' | 'off_track';
  createdAt: string;
  updatedAt: string;
  owner: string;
}

const categoryIcons = {
  revenue: <DollarSign className="h-4 w-4" />,
  sales: <TrendingUp className="h-4 w-4" />,
  customers: <Users className="h-4 w-4" />,
  inventory: <Package className="h-4 w-4" />,
  other: <Target className="h-4 w-4" />
};

const statusColors = {
  on_track: 'bg-green-500',
  at_risk: 'bg-yellow-500',
  off_track: 'bg-red-500'
};

const statusLabels = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  off_track: 'Off Track'
};

const mockTargets: BusinessTarget[] = [
  {
    id: '1',
    title: 'Quarterly Revenue',
    description: 'Achieve $500K in Q2 revenue',
    category: 'revenue',
    currentValue: 375000,
    targetValue: 500000,
    progress: 75,
    deadline: '2023-06-30',
    status: 'on_track',
    createdAt: '2023-04-01',
    updatedAt: '2023-05-15',
    owner: 'John Doe'
  },
  {
    id: '2',
    title: 'Monthly Sales Target',
    description: 'Sell 1,000 units of Product X',
    category: 'sales',
    currentValue: 650,
    targetValue: 1000,
    progress: 65,
    deadline: '2023-05-31',
    status: 'at_risk',
    createdAt: '2023-05-01',
    updatedAt: '2023-05-15',
    owner: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Customer Acquisition',
    description: 'Acquire 500 new customers',
    category: 'customers',
    currentValue: 1200,
    targetValue: 1500,
    progress: 80,
    deadline: '2023-12-31',
    status: 'on_track',
    createdAt: '2023-01-01',
    updatedAt: '2023-05-15',
    owner: 'Alex Johnson'
  },
  {
    id: '4',
    title: 'Inventory Reduction',
    description: 'Reduce excess inventory by 30%',
    category: 'inventory',
    currentValue: 10,
    targetValue: 30,
    progress: 33,
    deadline: '2023-07-31',
    status: 'off_track',
    createdAt: '2023-03-15',
    updatedAt: '2023-05-15',
    owner: 'Sarah Wilson'
  }
];

function TargetList({ targets, onDelete, onEdit }: { targets: BusinessTarget[]; onDelete: (id: string) => void; onEdit: (target: BusinessTarget) => void }) {
  return (
    <div className="space-y-4">
      {targets.map((target) => (
        <TargetCard key={target.id} target={target} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

function TargetCard({ target, onDelete, onEdit }: { target: BusinessTarget; onDelete: (id: string) => void; onEdit: (target: BusinessTarget) => void }) {
  const progressColor = target.progress < 50 ? 'bg-red-500' : target.progress < 80 ? 'bg-yellow-500' : 'bg-green-500';
  
  return (
    <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                {categoryIcons[target.category]}
              </div>
              <span className="text-sm text-muted-foreground capitalize">{target.category}</span>
            </div>
            <CardTitle className="text-lg">{target.title}</CardTitle>
            <CardDescription className="mt-1">{target.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(target)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(target.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{target.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${progressColor} transition-all duration-500 ease-out`} 
                style={{ width: `${target.progress}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Current</div>
              <div className="font-medium">${target.currentValue.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Target</div>
              <div className="font-medium">${target.targetValue.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${statusColors[target.status]}`} />
              <span className="text-muted-foreground">{statusLabels[target.status]}</span>
            </div>
            <div className="text-muted-foreground">Due: {new Date(target.deadline).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AddEditTargetDialog({ 
  open, 
  onOpenChange, 
  target, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  target?: BusinessTarget; 
  onSave: (target: Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void; 
}) {
  const isEdit = !!target;
  const [formData, setFormData] = useState<Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'>>(
    target || {
      title: '',
      description: '',
      category: 'revenue',
      currentValue: 0,
      targetValue: 0,
      progress: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'on_track',
      owner: 'John Doe'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
      progress: name === 'currentValue' || name === 'targetValue' 
        ? Math.min(100, Math.round(((name === 'currentValue' ? parseFloat(value) : prev.currentValue) / 
                                   (name === 'targetValue' ? parseFloat(value) : prev.targetValue)) * 100) || 0)
        : prev.progress
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Target' : 'Create New Target'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the target details below.' : 'Fill in the details to create a new business target.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value as any})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentValue" className="text-right">
                Current Value
              </Label>
              <Input
                id="currentValue"
                name="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={handleNumberChange}
                className="col-span-3"
                min={0}
                step={1}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetValue" className="text-right">
                Target Value
              </Label>
              <Input
                id="targetValue"
                name="targetValue"
                type="number"
                value={formData.targetValue}
                onChange={handleNumberChange}
                className="col-span-3"
                min={0}
                step={1}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value as any})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="off_track">Off Track</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Progress
              </Label>
              <div className="col-span-3 flex items-center gap-4">
                <Progress value={formData.progress} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground w-12">{formData.progress}%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Target' : 'Create Target'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Targets() {
  const [targets, setTargets] = useState<BusinessTarget[]>(mockTargets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<BusinessTarget | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all');

  const filteredTargets = targets.filter(target => {
    if (activeTab === 'all') return true;
    if (activeTab === 'on_track') return target.status === 'on_track';
    if (activeTab === 'at_risk') return target.status === 'at_risk';
    if (activeTab === 'off_track') return target.status === 'off_track';
    return target.category === activeTab;
  });

  const handleAddTarget = () => {
    setEditingTarget(undefined);
    setDialogOpen(true);
  };

  const handleEditTarget = (target: BusinessTarget) => {
    setEditingTarget(target);
    setDialogOpen(true);
  };

  const handleDeleteTarget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this target?')) {
      setTargets(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveTarget = (targetData: Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    
    if (targetData.id) {
      // Update existing target
      setTargets(prev => 
        prev.map(t => 
          t.id === targetData.id 
            ? { 
                ...t, 
                ...targetData, 
                updatedAt: now,
                progress: Math.min(100, Math.round((targetData.currentValue / targetData.targetValue) * 100) || 0)
              } 
            : t
        )
      );
    } else {
      // Add new target
      const newTarget: BusinessTarget = {
        ...targetData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
        progress: Math.min(100, Math.round((targetData.currentValue / targetData.targetValue) * 100) || 0)
      };
      setTargets(prev => [...prev, newTarget]);
    }
    
    setDialogOpen(false);
  };

  // Calculate summary metrics
  const totalTargets = targets.length;
  const onTrackTargets = targets.filter(t => t.status === 'on_track').length;
  const atRiskTargets = targets.filter(t => t.status === 'at_risk').length;
  const offTrackTargets = targets.filter(t => t.status === 'off_track').length;
  const averageProgress = totalTargets > 0 
    ? Math.round(targets.reduce((sum, t) => sum + t.progress, 0) / totalTargets) 
    : 0;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Business Targets</h1>
              <p className="text-muted-foreground">Track and manage your business objectives and KPIs</p>
            </div>
            <Button onClick={handleAddTarget}>
              <Plus className="h-4 w-4 mr-2" />
              New Target
            </Button>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Targets</CardTitle>
                <CardDescription className="text-2xl font-bold">{totalTargets}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500">+2.5%</span> from last month
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">On Track</CardTitle>
                <CardDescription className="text-2xl font-bold">{onTrackTargets}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{Math.round((onTrackTargets / totalTargets) * 100) || 0}%</span> of total
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
                <CardDescription className="text-2xl font-bold">{atRiskTargets}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="text-yellow-500">{totalTargets > 0 ? Math.round((atRiskTargets / totalTargets) * 100) : 0}%</span> of total
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Off Track</CardTitle>
                <CardDescription className="text-2xl font-bold">{offTrackTargets}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <span className="text-red-500">{totalTargets > 0 ? Math.round((offTrackTargets / totalTargets) * 100) : 0}%</span> of total
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
                <CardDescription className="text-2xl font-bold">{averageProgress}%</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={averageProgress} className="h-2" />
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All Targets</TabsTrigger>
              <TabsTrigger value="on_track">On Track</TabsTrigger>
              <TabsTrigger value="at_risk">At Risk</TabsTrigger>
              <TabsTrigger value="off_track">Off Track</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <TargetList 
                targets={filteredTargets} 
                onDelete={handleDeleteTarget} 
                onEdit={handleEditTarget} 
              />
              
              {filteredTargets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No targets found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {activeTab === 'all' 
                      ? 'Get started by creating a new target.' 
                      : `No ${activeTab.replace('_', ' ')} targets found.`}
                  </p>
                  <Button onClick={handleAddTarget}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Target
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add/Edit Target Dialog */}
      <AddEditTargetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        target={editingTarget}
        onSave={handleSaveTarget}
      />
    </div>
  );
}