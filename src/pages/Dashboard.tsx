import React from 'react';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Users,
  ShoppingCart,
  CalendarDays,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: 'default' | 'success' | 'warning' | 'destructive';
}

const Dashboard: React.FC = () => {
  const { selectedBranch, user } = useAuth();

  const stats: StatCard[] = [
    {
      title: 'Total Drugs',
      value: '2,847',
      description: 'Active inventory items',
      icon: Package,
      trend: '+12% from last month',
      trendUp: true,
      color: 'default'
    },
    {
      title: 'Today\'s Sales',
      value: '$3,247',
      description: '47 transactions completed',
      icon: DollarSign,
      trend: '+8% from yesterday',
      trendUp: true,
      color: 'success'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      description: 'Require immediate attention',
      icon: AlertTriangle,
      trend: '5 critical items',
      trendUp: false,
      color: 'warning'
    },
    {
      title: 'Monthly Revenue',
      value: '$89,247',
      description: 'Current month progress',
      icon: TrendingUp,
      trend: '+24% vs last month',
      trendUp: true,
      color: 'success'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'sale',
      description: 'Paracetamol 500mg sold to John Doe',
      time: '2 minutes ago',
      amount: '$15.50'
    },
    {
      id: 2,
      type: 'stock',
      description: 'Low stock alert: Amoxicillin 250mg',
      time: '15 minutes ago',
      amount: '8 units left'
    },
    {
      id: 3,
      type: 'purchase',
      description: 'Purchase order PO-2024-003 received',
      time: '1 hour ago',
      amount: '$2,450'
    },
    {
      id: 4,
      type: 'expiry',
      description: 'Expiry alert: Ibuprofen 400mg expires in 15 days',
      time: '2 hours ago',
      amount: '45 units'
    }
  ];

  const topSellingDrugs = [
    { name: 'Paracetamol 500mg', sales: 234, revenue: '$3,510', trend: 15 },
    { name: 'Amoxicillin 250mg', sales: 189, revenue: '$2,835', trend: 8 },
    { name: 'Ibuprofen 400mg', sales: 156, revenue: '$2,340', trend: -3 },
    { name: 'Cough Syrup 100ml', sales: 143, revenue: '$2,145', trend: 12 },
    { name: 'Vitamin C 1000mg', sales: 128, revenue: '$1,920', trend: 5 }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return ShoppingCart;
      case 'stock': return AlertTriangle;
      case 'purchase': return Package;
      case 'expiry': return CalendarDays;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-success';
      case 'stock': return 'text-warning';
      case 'purchase': return 'text-primary';
      case 'expiry': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}! Here's what's happening at {selectedBranch?.name}.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${
                  stat.color === 'success' ? 'text-success' :
                  stat.color === 'warning' ? 'text-warning' :
                  stat.color === 'destructive' ? 'text-destructive' :
                  'text-primary'
                }`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                {stat.trend && (
                  <div className={`flex items-center gap-1 mt-2 text-xs ${
                    stat.trendUp ? 'text-success' : 'text-destructive'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${!stat.trendUp && 'rotate-180'}`} />
                    {stat.trend}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest transactions and system alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-muted/50 ${getActivityColor(activity.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.amount}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Drugs */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Selling Drugs
            </CardTitle>
            <CardDescription>
              Best performing products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingDrugs.map((drug, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{drug.name}</p>
                      <Badge 
                        variant={drug.trend > 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {drug.trend > 0 ? '+' : ''}{drug.trend}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{drug.sales} units sold</span>
                      <span className="font-medium text-success">{drug.revenue}</span>
                    </div>
                    <Progress 
                      value={(drug.sales / 250) * 100} 
                      className="h-1 mt-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Add New Drug</p>
                <p className="text-xs text-muted-foreground">Register new inventory</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="p-2 bg-success/10 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-success" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">New Sale</p>
                <p className="text-xs text-muted-foreground">Process customer order</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Stock Alerts</p>
                <p className="text-xs text-muted-foreground">Check low inventory</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Manage Suppliers</p>
                <p className="text-xs text-muted-foreground">Update supplier info</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;