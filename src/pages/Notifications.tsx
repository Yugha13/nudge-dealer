import { Check, X, Mail, AlertTriangle, Info, CheckCircle, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type NotificationType = 'all' | 'unread' | 'system' | 'alerts';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  sender?: {
    name: string;
    avatar?: string;
  };
}

export default function NotificationsPage() {
  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New message from Sarah',
      description: 'Hi there! I wanted to follow up on our project timeline.',
      time: '10 min ago',
      read: false,
      type: 'info',
      sender: {
        name: 'Sarah Johnson',
        avatar: '/avatars/02.png'
      }
    },
    {
      id: '2',
      title: 'Task completed',
      description: 'Your task "Update user dashboard" has been marked as completed.',
      time: '1 hour ago',
      read: false,
      type: 'success',
      sender: {
        name: 'System',
        avatar: ''
      }
    },
    {
      id: '3',
      title: 'System Maintenance',
      description: 'Scheduled maintenance this weekend. Expected downtime: 2 hours.',
      time: '3 hours ago',
      read: true,
      type: 'warning',
      sender: {
        name: 'System Admin',
        avatar: ''
      }
    },
    {
      id: '4',
      title: 'New feature available',
      description: 'Check out the new analytics dashboard with enhanced reporting features.',
      time: '1 day ago',
      read: true,
      type: 'info',
      sender: {
        name: 'Product Team',
        avatar: ''
      }
    },
    {
      id: '5',
      title: 'Security Alert',
      description: 'New login detected from a new device. Was this you?',
      time: '2 days ago',
      read: true,
      type: 'error',
      sender: {
        name: 'Security Team',
        avatar: ''
      }
    }
  ]);

  const [activeTab, setActiveTab] = useState<NotificationType>('all');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [muteAll, setMuteAll] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'system':
        return notifications.filter(n => n.sender?.name === 'System' || n.sender?.name === 'System Admin');
      case 'alerts':
        return notifications.filter(n => n.type === 'warning' || n.type === 'error');
      default:
        return notifications;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notifications and alerts
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <X className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NotificationType)}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  </TabsList>
                  <div className="text-sm text-muted-foreground">
                    {getFilteredNotifications().length} {getFilteredNotifications().length === 1 ? 'notification' : 'notifications'}
                  </div>
                </div>

                <TabsContent value={activeTab} className="mt-6">
                  <div className="space-y-4">
                    {getFilteredNotifications().length > 0 ? (
                      getFilteredNotifications().map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 rounded-lg border ${
                            notification.read 
                              ? 'bg-background border-border/50' 
                              : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              {notification.sender?.avatar ? (
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                                  <AvatarFallback>
                                    {notification.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                  {getTypeIcon(notification.type)}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                                  {notification.sender?.name && (
                                    <>
                                      <span className="text-muted-foreground/50">•</span>
                                      <span className="text-xs text-muted-foreground">{notification.sender.name}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No notifications</h3>
                        <p className="text-muted-foreground mt-1">
                          {activeTab === 'all' 
                            ? "You're all caught up!" 
                            : `No ${activeTab} notifications at the moment.`}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Enable browser notifications</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications} 
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <h4 className="font-medium">Mute All</h4>
                  <p className="text-sm text-muted-foreground">Temporarily disable all notifications</p>
                </div>
                <Switch 
                  checked={muteAll} 
                  onCheckedChange={setMuteAll} 
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Notification Preferences
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <X className="h-4 w-4 mr-2" />
                Clear all notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BellOff className="h-4 w-4 mr-2" />
                Mute for 1 hour
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Add the missing useState import
import { useState } from 'react';
