import { useState } from 'react';
import { Plus, Trash2, Edit, Target, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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

type Status = 'todo' | 'in_progress' | 'completed';

interface BusinessTarget {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'sales' | 'customers' | 'inventory' | 'other';
  currentValue: number;
  targetValue: number;
  progress: number;
  deadline: string;
  status: Status;
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
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500'
};

const statusLabels = {
  todo: 'Todo',
  in_progress: 'In Progress',
  completed: 'Completed'
};

const mockTargets: BusinessTarget[] = [
  {
    id: '1',
    title: 'Quarterly Revenue',
    description: 'Achieve $500K in Q2 revenue',
    category: 'revenue',
    currentValue: 0,
    targetValue: 500000,
    progress: 0,
    deadline: '2023-06-30',
    status: 'todo',
    createdAt: '2023-04-01',
    updatedAt: '2023-05-15',
    owner: 'John Doe'
  },
  {
    id: '2',
    title: 'Monthly Sales Target',
    description: 'Sell 1,000 units of Product X',
    category: 'sales',
    currentValue: 350,
    targetValue: 1000,
    progress: 35,
    deadline: '2023-05-31',
    status: 'in_progress',
    createdAt: '2023-05-01',
    updatedAt: '2023-05-15',
    owner: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Customer Acquisition',
    description: 'Acquire 500 new customers',
    category: 'customers',
    currentValue: 500,
    targetValue: 500,
    progress: 100,
    deadline: '2023-12-31',
    status: 'completed',
    createdAt: '2023-01-01',
    updatedAt: '2023-05-15',
    owner: 'Alex Johnson'
  },
  {
    id: '4',
    title: 'Inventory Reduction',
    description: 'Reduce excess inventory by 30%',
    category: 'inventory',
    currentValue: 5,
    targetValue: 30,
    progress: 16,
    deadline: '2023-07-31',
    status: 'in_progress',
    createdAt: '2023-03-15',
    updatedAt: '2023-05-15',
    owner: 'Sarah Wilson'
  }
];


function TargetCard({ target, onDelete, onEdit }: { target: BusinessTarget; onDelete: (id: string) => void; onEdit: (target: BusinessTarget) => void }) {
  const progressColor = statusColors[target.status];
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: progressColor }}>
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
      status: 'todo',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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

// ...

const Targets = () => {
  const [targets, setTargets] = useState<BusinessTarget[]>(mockTargets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<BusinessTarget | null>(null);

  // Group targets by status for the columns
  const todoTargets = targets.filter(target => target.status === 'todo');
  const inProgressTargets = targets.filter(target => target.status === 'in_progress');
  const completedTargets = targets.filter(target => target.status === 'completed');

  const handleAddTarget = () => {
    setEditingTarget(null);
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

  const handleSaveTarget = (targetData: Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTarget) {
      setTargets(targets.map(t => t.id === editingTarget.id ? { 
        ...t, 
        ...targetData, 
        status: targetData.status as Status, // Ensure status is of type Status
        updatedAt: new Date().toISOString() 
      } : t));
    } else {
      const newTarget: BusinessTarget = {
        ...targetData,
        status: targetData.status as Status, // Ensure status is of type Status
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTargets([...targets, newTarget]);
    }
    setDialogOpen(false);
    setEditingTarget(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Targets</h1>
        <Button onClick={handleAddTarget}>
          <Plus className="mr-2 h-4 w-4" /> Add Target
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Todo Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <h2 className="font-medium">To Do</h2>
              <span className="text-sm text-muted-foreground">
                {todoTargets.length} items
              </span>
            </div>
            <div className="space-y-4">
              {todoTargets.length > 0 ? (
                todoTargets.map(target => (
                  <TargetCard 
                    key={target.id} 
                    target={target} 
                    onDelete={handleDeleteTarget} 
                    onEdit={handleEditTarget} 
                  />
                ))
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">No tasks here</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <h2 className="font-medium">In Progress</h2>
              <span className="text-sm text-muted-foreground">
                {inProgressTargets.length} items
              </span>
            </div>
            <div className="space-y-4">
              {inProgressTargets.length > 0 ? (
                inProgressTargets.map(target => (
                  <TargetCard 
                    key={target.id} 
                    target={target} 
                    onDelete={handleDeleteTarget} 
                    onEdit={handleEditTarget} 
                  />
                ))
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">No tasks in progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <h2 className="font-medium">Completed</h2>
              <span className="text-sm text-muted-foreground">
                {completedTargets.length} items
              </span>
            </div>
            <div className="space-y-4">
              {completedTargets.length > 0 ? (
                completedTargets.map(target => (
                  <TargetCard 
                    key={target.id} 
                    target={target} 
                    onDelete={handleDeleteTarget} 
                    onEdit={handleEditTarget} 
                  />
                ))
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">No completed tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {dialogOpen && (
        <AddEditTargetDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
          target={editingTarget || undefined} 
          onSave={handleSaveTarget} 
        />
      )}
    </div>
  );
};

export default Targets;