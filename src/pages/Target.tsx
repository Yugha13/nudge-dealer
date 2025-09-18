import { useState, useEffect, useCallback } from 'react';
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
import { 
  SumOfBilling, 
  FillRate, 
  LineFillRate, 
  NonZeroFillRate, 
  TotalOrders,
  getAllMetrics 
} from '@/lib/calculation';

type Status = 'todo' | 'in_progress' | 'completed';
type RealTimeCategory = 'revenue' | 'fillrate' | 'linefillrate' | 'nzfr' | 'orders' | 'custom';

interface BusinessTarget {
  id: string;
  title: string;
  description: string;
  category: RealTimeCategory;
  currentValue: number;
  targetValue: number;
  progress: number;
  deadline: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  owner: string;
  isRealTime: boolean;
}

const categoryIcons = {
  revenue: <DollarSign className="h-4 w-4" />,
  fillrate: <TrendingUp className="h-4 w-4" />,
  linefillrate: <Users className="h-4 w-4" />,
  nzfr: <Package className="h-4 w-4" />,
  orders: <Target className="h-4 w-4" />,
  custom: <Target className="h-4 w-4" />
};

// Get real-time value for a category
const getRealTimeValue = (category: RealTimeCategory): number => {
  const metrics = getAllMetrics();
  switch (category) {
    case 'revenue': return metrics.revenue;
    case 'fillrate': return metrics.fillRate;
    case 'linefillrate': return metrics.lineFillRate;
    case 'nzfr': return metrics.nzfr;
    case 'orders': return metrics.totalOrders;
    default: return 0;
  }
};

const updateTargetStatus = (currentValue: number, targetValue: number): Status => {
  if (targetValue === 0) return 'todo';
  const progress = (currentValue / targetValue) * 100;
  if (progress >= 100) return 'completed';
  if (progress > 0) return 'in_progress';
  return 'todo';
};

const defaultTargets: BusinessTarget[] = [
  {
    id: '1',
    title: 'Monthly Revenue Target',
    description: 'Achieve monthly revenue goal',
    category: 'revenue',
    currentValue: SumOfBilling(),
    targetValue: 100000,
    progress: 0,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'John Doe',
    isRealTime: true
  },
  {
    id: '2',
    title: 'Fill Rate Improvement',
    description: 'Improve overall fill rate performance',
    category: 'fillrate',
    currentValue: FillRate(),
    targetValue: 85,
    progress: 0,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'John Doe',
    isRealTime: true
  },
  {
    id: '3',
    title: 'Order Volume Growth',
    description: 'Increase total order count',
    category: 'orders',
    currentValue: TotalOrders(),
    targetValue: 500,
    progress: 0,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'John Doe',
    isRealTime: true
  }
];

const loadTargetsFromStorage = (): BusinessTarget[] => {
  const stored = localStorage.getItem('business-targets');
  if (stored) {
    const parsedTargets = JSON.parse(stored);
    return parsedTargets.map((target: BusinessTarget) => {
      if (target.isRealTime) {
        const currentValue = getRealTimeValue(target.category);
        const progress = target.targetValue > 0 ? Math.min(100, Math.round((currentValue / target.targetValue) * 100)) : 0;
        const status = updateTargetStatus(currentValue, target.targetValue);
        return { ...target, currentValue, progress, status };
      }
      return target;
    });
  }
  return defaultTargets.map(target => {
    const progress = target.targetValue > 0 ? Math.min(100, Math.round((target.currentValue / target.targetValue) * 100)) : 0;
    const status = updateTargetStatus(target.currentValue, target.targetValue);
    return { ...target, progress, status };
  });
};

const saveTargetsToStorage = (targets: BusinessTarget[]) => {
  localStorage.setItem('business-targets', JSON.stringify(targets));
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
              <div className="font-medium">
                {target.category === 'revenue' ? `₹${target.currentValue.toLocaleString()}` : 
                 ['fillrate', 'linefillrate', 'nzfr'].includes(target.category) ? `${target.currentValue.toFixed(1)}%` :
                 target.currentValue.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Target</div>
              <div className="font-medium">
                {target.category === 'revenue' ? `₹${target.targetValue.toLocaleString()}` : 
                 ['fillrate', 'linefillrate', 'nzfr'].includes(target.category) ? `${target.targetValue}%` :
                 target.targetValue.toLocaleString()}
              </div>
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
      owner: 'John Doe',
      isRealTime: false
    }
  );

  const handleCategoryChange = (category: RealTimeCategory) => {
    const isRealTime = category !== 'custom';
    const currentValue = isRealTime ? getRealTimeValue(category) : formData.currentValue;
    setFormData(prev => ({
      ...prev,
      category,
      currentValue,
      isRealTime,
      progress: prev.targetValue > 0 ? Math.min(100, Math.round((currentValue / prev.targetValue) * 100)) : 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData(prev => {
      const currentValue = name === 'currentValue' ? numValue : prev.currentValue;
      const targetValue = name === 'targetValue' ? numValue : prev.targetValue;
      const progress = targetValue > 0 ? Math.min(100, Math.round((currentValue / targetValue) * 100)) : 0;
      return {
        ...prev,
        [name]: numValue,
        progress
      };
    });
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
                placeholder="Optional description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue (Real-time)</SelectItem>
                  <SelectItem value="fillrate">Fill Rate (Real-time)</SelectItem>
                  <SelectItem value="linefillrate">Line Fill Rate (Real-time)</SelectItem>
                  <SelectItem value="nzfr">NZFR (Real-time)</SelectItem>
                  <SelectItem value="orders">Total Orders (Real-time)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
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
                  <SelectItem value="todo">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
  const [targets, setTargets] = useState<BusinessTarget[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<BusinessTarget | null>(null);

  useEffect(() => {
    const initialTargets = loadTargetsFromStorage();
    setTargets(initialTargets);
    saveTargetsToStorage(initialTargets);
  }, []);

  // Update targets with real-time data
  const updateRealTimeTargets = useCallback(() => {
    setTargets(prevTargets => {
      const updated = prevTargets.map(target => {
        if (!target.isRealTime) return target;
        
        // Get current value based on category
        let currentValue: number;
        switch (target.category) {
          case 'revenue':
            currentValue = SumOfBilling();
            break;
          case 'fillrate':
            currentValue = FillRate();
            break;
          case 'linefillrate':
            currentValue = LineFillRate();
            break;
          case 'nzfr':
            currentValue = NonZeroFillRate();
            break;
          case 'orders':
            currentValue = TotalOrders();
            break;
          default:
            currentValue = target.currentValue;
        }
        
        // Calculate progress and status
        const progress = target.targetValue > 0 
          ? Math.min(100, (currentValue / target.targetValue) * 100) 
          : 0;
        const status = updateTargetStatus(currentValue, target.targetValue);
        
        return {
          ...target,
          currentValue,
          progress,
          status,
          updatedAt: new Date().toISOString()
        };
      });
      
      // Save to storage
      saveTargetsToStorage(updated);
      return updated;
    });
  }, []);

  // Set up real-time updates
  useEffect(() => {
    // Initial update
    updateRealTimeTargets();
    
    // Update every 2 seconds
    const interval = setInterval(updateRealTimeTargets, 2000);
    return () => clearInterval(interval);
  }, [updateRealTimeTargets]);

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
      const updatedTargets = targets.filter(t => t.id !== id);
      setTargets(updatedTargets);
      saveTargetsToStorage(updatedTargets);
    }
  };

  const handleSaveTarget = (targetData: Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedTargets = editingTarget
      ? targets.map(t => t.id === editingTarget.id ? { 
          ...t, 
          ...targetData, 
          status: updateTargetStatus(targetData.currentValue, targetData.targetValue),
          updatedAt: new Date().toISOString() 
        } : t)
      : [...targets, {
          ...targetData,
          status: updateTargetStatus(targetData.currentValue, targetData.targetValue),
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];
    
    setTargets(updatedTargets);
    saveTargetsToStorage(updatedTargets);
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Vertical separating lines */}
          <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-px bg-border pointer-events-none"></div>
          <div className="hidden md:block absolute left-2/3 top-0 bottom-0 w-px bg-border pointer-events-none"></div>
          
          {/* Todo Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <h2 className="font-medium">Not Started</h2>
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