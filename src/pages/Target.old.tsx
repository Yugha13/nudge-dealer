import { useState } from 'react';
import { Plus, MoreHorizontal, Table, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
  date: string;
  time: string;
  service: {
    name: string;
    icon: string;
    color: string;
  };
  collaborators: Array<{
    name: string;
    avatar: string;
    initials: string;
  }>;
  status: 'todo' | 'progress' | 'completed';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Brand Guideline Design',
    description: 'Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...',
    assignee: {
      name: 'Darlene Robertson',
      avatar: '',
      initials: 'DR'
    },
    date: '02/24',
    time: '12:11 PM',
    service: {
      name: 'Gmail',
      icon: '📧',
      color: '#EA4335'
    },
    collaborators: [
      { name: 'John Doe', avatar: '', initials: 'JD' }
    ],
    status: 'todo'
  },
  {
    id: '2',
    title: 'Competitor Analysis',
    description: 'Do the best password option when login & send email for doing this...',
    assignee: {
      name: 'Savannah Nguyen',
      avatar: '',
      initials: 'SN'
    },
    date: '02/22',
    time: '09:33 AM',
    service: {
      name: 'GitHub',
      icon: '🐙',
      color: '#24292e'
    },
    collaborators: [
      { name: 'Jane Smith', avatar: '', initials: 'JS' }
    ],
    status: 'todo'
  },
  {
    id: '3',
    title: 'Design System Work',
    description: 'Lorem Ipsum is simply dummy text into a printing and typesetting.',
    assignee: {
      name: 'Brooklyn Simmons',
      avatar: '',
      initials: 'BS'
    },
    date: '11/23',
    time: '2:44 AM',
    service: {
      name: 'Messenger',
      icon: '💬',
      color: '#0084FF'
    },
    collaborators: [
      { name: 'Mike Johnson', avatar: '', initials: 'MJ' },
      { name: 'Sarah Wilson', avatar: '', initials: 'SW' }
    ],
    status: 'todo'
  },
  {
    id: '4',
    title: 'Password Security Feature',
    description: 'Do the best password option when login & send email for doing this...',
    assignee: {
      name: 'Leslie Alexander',
      avatar: '',
      initials: 'LA'
    },
    date: '02/22',
    time: '09:33 AM',
    service: {
      name: 'Slack',
      icon: '💬',
      color: '#4A154B'
    },
    collaborators: [
      { name: 'Alex Brown', avatar: '', initials: 'AB' }
    ],
    status: 'progress'
  },
  {
    id: '5',
    title: 'Graphic Design Work',
    description: 'Create visual assets for the new marketing campaign',
    assignee: {
      name: 'Cameron Williamson',
      avatar: '',
      initials: 'CW'
    },
    date: '02/22',
    time: '09:33 AM',
    service: {
      name: 'Gmail',
      icon: '📧',
      color: '#EA4335'
    },
    collaborators: [
      { name: 'Emma Davis', avatar: '', initials: 'ED' },
      { name: 'Tom Wilson', avatar: '', initials: 'TW' }
    ],
    status: 'progress'
  },
  {
    id: '6',
    title: 'Component Making Work',
    description: 'Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...',
    assignee: {
      name: 'Kathryn Murphy',
      avatar: '',
      initials: 'KM'
    },
    date: '12/22',
    time: '8:16 PM',
    service: {
      name: 'Microsoft Team',
      icon: '👥',
      color: '#5059C9'
    },
    collaborators: [
      { name: 'Chris Lee', avatar: '', initials: 'CL' }
    ],
    status: 'completed'
  },
  {
    id: '7',
    title: 'UI/UX Research Project',
    description: 'Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...',
    assignee: {
      name: 'Robert Fox',
      avatar: '',
      initials: 'RF'
    },
    date: '11/23',
    time: '4:28 PM',
    service: {
      name: 'Slack',
      icon: '💬',
      color: '#4A154B'
    },
    collaborators: [
      { name: 'Lisa Johnson', avatar: '', initials: 'LJ' },
      { name: 'Mark Brown', avatar: '', initials: 'MB' }
    ],
    status: 'completed'
  }
];

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {task.assignee.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-foreground">{task.assignee.name}</p>
              <p className="text-xs text-muted-foreground">{task.date} {task.time}</p>
            </div>
          </div>
        </div>
        
        <h3 className="font-semibold text-sm mb-2 text-foreground">{task.title}</h3>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <span>{task.service.icon}</span>
              <span className="text-muted-foreground">{task.service.name}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            {task.collaborators.map((collaborator, index) => (
              <Avatar key={index} className="h-6 w-6 -ml-1 border-2 border-background">
                <AvatarImage src={collaborator.avatar} />
                <AvatarFallback className="text-xs bg-muted">
                  {collaborator.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {task.collaborators.length > 1 && (
              <span className="text-xs text-muted-foreground ml-1">
                {task.collaborators.length}+
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: Task[];
  color: string;
}

function TaskColumn({ title, count, tasks, color }: TaskColumnProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-foreground">{title}</h2>
          <Badge variant="secondary" className="rounded-full text-xs">
            {String(count).padStart(2, '0')}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-0">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function Tasks() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'list'>('kanban');
  
  const todoTasks = mockTasks.filter(task => task.status === 'todo');
  const progressTasks = mockTasks.filter(task => task.status === 'progress');
  const completedTasks = mockTasks.filter(task => task.status === 'completed');
  
  const teamMembers = [
    { name: 'John Doe', avatar: '', initials: 'JD' },
    { name: 'Jane Smith', avatar: '', initials: 'JS' },
    { name: 'Mike Johnson', avatar: '', initials: 'MJ' },
    { name: 'Sarah Wilson', avatar: '', initials: 'SW' },
    { name: 'Alex Brown', avatar: '', initials: 'AB' },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
              
              <div className="flex items-center">
                {teamMembers.map((member, index) => (
                  <Avatar key={index} className="h-8 w-8 -ml-1 border-2 border-background">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="ml-2 flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">42+</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* View options */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="gap-2"
              >
                <Table className="h-4 w-4" />
                Table
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                List View
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-6 py-6">
        {viewMode === 'kanban' && (
          <div className="flex gap-6 overflow-x-auto pb-4">
            <TaskColumn
              title="To Do"
              count={todoTasks.length}
              tasks={todoTasks}
              color="#6B7280"
            />
            <TaskColumn
              title="In Progress"
              count={progressTasks.length}
              tasks={progressTasks}
              color="#3B82F6"
            />
            <TaskColumn
              title="Completed"
              count={completedTasks.length}
              tasks={completedTasks}
              color="#10B981"
            />
          </div>
        )}
        
        {(viewMode === 'table' || viewMode === 'list') && (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              {viewMode === 'table' ? 'Table' : 'List'} view coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}