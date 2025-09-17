import { useState } from 'react';
import { Plus, DollarSign, Calendar, Trash2, Edit, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

const categories = [
  'Office Supplies',
  'Travel',
  'Utilities',
  'Marketing',
  'Salaries',
  'Rent',
  'Software',
  'Other'
];

const ProfitAnalysis = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [_, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2023-09-15',
      category: 'Office Supplies',
      amount: 450,
      description: 'Printer paper and stationery',
      status: 'approved'
    },
    {
      id: '2',
      date: '2023-09-10',
      category: 'Software',
      amount: 1200,
      description: 'Annual subscription for design tools',
      status: 'pending'
    },
    {
      id: '3',
      date: '2023-09-05',
      category: 'Marketing',
      amount: 3500,
      description: 'Social media ad campaign',
      status: 'approved'
    },
  ]);

  const [formData, setFormData] = useState<Omit<Expense, 'id' | 'status'>>({ 
    date: new Date().toISOString().split('T')[0],
    category: 'Office Supplies',
    amount: 0,
    description: ''
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    };
    setExpenses([...expenses, newExpense]);
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'Office Supplies',
      amount: 0,
      description: ''
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
          <p className="text-muted-foreground">Track and manage your business expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

       {/* Summary Card */}
       <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This {timeRange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{expenses.filter(e => e.status === 'pending').length} items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{expenses.filter(e => e.status === 'approved').length} items</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>Enter the details of your business expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="date">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="category">
                  Category
                </label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="amount">
                  Amount ($)
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="description">
                  Description
                </label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the expense"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

     

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>Track all your business expenses</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No expenses recorded yet. Add your first expense above.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          {new Date(expense.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="p-4 align-middle">{expense.category}</td>
                        <td className="p-4 text-right align-middle font-medium">
                          ${expense.amount.toFixed(2)}
                        </td>
                        <td className="p-4 align-middle text-muted-foreground max-w-[200px] truncate">
                          {expense.description}
                        </td>
                        <td className="p-4 text-center align-middle">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            expense.status === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : expense.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-right align-middle">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive/90"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t font-medium">
                    <td colSpan={2} className="p-4 text-right">Total:</td>
                    <td className="p-4 text-right">${totalExpenses.toFixed(2)}</td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitAnalysis;
