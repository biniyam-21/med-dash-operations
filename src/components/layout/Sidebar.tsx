import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Building2,
  BarChart3,
  Users,
  ClipboardList,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  AlertTriangle,
  History,
  ReceiptText,
  RotateCcw,
  UserPlus,
  Heart,
  Ban,
  ArrowUpDown,
  PieChart,
  TrendingUp,
  UserCog,
  Shield,
  Menu,
  X,
  Cross,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavItem[];
  permission?: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    permission: 'dashboard'
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    permission: 'inventory',
    children: [
      { id: 'add-drug', label: 'Add Drug', icon: Plus, path: '/inventory/add', permission: 'inventory' },
      { id: 'view-drugs', label: 'View All Drugs', icon: Eye, path: '/inventory', permission: 'inventory.view' },
      { id: 'expiry-monitor', label: 'Expiry & Low Stock', icon: AlertTriangle, path: '/inventory/expiry', permission: 'inventory.view' },
      { id: 'stock-movement', label: 'Stock Movement Log', icon: History, path: '/inventory/movement', permission: 'inventory.view' },
    ]
  },
  {
    id: 'sales',
    label: 'Sales (POS)',
    icon: ShoppingCart,
    permission: 'sales',
    children: [
      { id: 'new-sale', label: 'New Sale', icon: Plus, path: '/sales/new', permission: 'sales' },
      { id: 'sales-history', label: 'Sales History', icon: ReceiptText, path: '/sales/history', permission: 'sales.view' },
      { id: 'returns', label: 'Returns / Refunds', icon: RotateCcw, path: '/sales/returns', permission: 'sales' },
    ]
  },
  {
    id: 'purchases',
    label: 'Purchases',
    icon: Truck,
    permission: 'purchases',
    children: [
      { id: 'new-purchase', label: 'New Purchase Order', icon: Plus, path: '/purchases/new', permission: 'purchases' },
      { id: 'receive-stock', label: 'Receive Stock', icon: Package, path: '/purchases/receive', permission: 'purchases' },
      { id: 'purchase-history', label: 'Purchase History', icon: History, path: '/purchases/history', permission: 'purchases.view' },
    ]
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    icon: Building2,
    permission: 'suppliers',
    children: [
      { id: 'manage-suppliers', label: 'Manage Suppliers', icon: Users, path: '/suppliers', permission: 'suppliers.view' },
      { id: 'add-supplier', label: 'Add Supplier', icon: UserPlus, path: '/suppliers/add', permission: 'suppliers' },
      { id: 'supplier-status', label: 'Preferred / Blacklisted', icon: Heart, path: '/suppliers/status', permission: 'suppliers.view' },
    ]
  },
  {
    id: 'branches',
    label: 'Branches',
    icon: Building2,
    permission: 'branches',
    children: [
      { id: 'view-branches', label: 'View Branches', icon: Eye, path: '/branches', permission: 'branches.view' },
      { id: 'stock-transfers', label: 'Stock Transfers', icon: ArrowUpDown, path: '/branches/transfers', permission: 'branches' },
      { id: 'branch-reports', label: 'Branch Reports', icon: BarChart3, path: '/branches/reports', permission: 'reports.view' },
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: BarChart3,
    permission: 'reports',
    children: [
      { id: 'sales-reports', label: 'Sales Reports', icon: TrendingUp, path: '/reports/sales', permission: 'reports.view' },
      { id: 'expiry-reports', label: 'Expiry Reports', icon: AlertTriangle, path: '/reports/expiry', permission: 'reports.view' },
      { id: 'top-sellers', label: 'Top Sellers', icon: PieChart, path: '/reports/top-sellers', permission: 'reports.view' },
      { id: 'profit-loss', label: 'Profit & Loss', icon: BarChart3, path: '/reports/profit-loss', permission: 'reports.view' },
    ]
  },
  {
    id: 'users',
    label: 'Users & Roles',
    icon: Users,
    permission: 'users',
    children: [
      { id: 'manage-users', label: 'Manage Accounts', icon: UserCog, path: '/users', permission: 'users' },
      { id: 'assign-roles', label: 'Assign Roles', icon: Shield, path: '/users/roles', permission: 'users' },
    ]
  },
  {
    id: 'audit',
    label: 'Audit Trail',
    icon: ClipboardList,
    path: '/audit',
    permission: 'audit'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    permission: 'settings'
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapsed }) => {
  const { user, hasPermission, logout } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['inventory', 'sales']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (children: NavItem[]) => {
    return children.some(child => child.path && isActiveRoute(child.path));
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.path ? isActiveRoute(item.path) : isParentActive(item.children || []);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => !isCollapsed && toggleExpanded(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              level > 0 && "ml-4"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            )}
          </button>
          
          {!isCollapsed && isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id} className="mb-1">
        <NavLink
          to={item.path!}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            level > 0 && "ml-4"
          )}
          onClick={() => window.innerWidth < 768 && onClose()}
          title={isCollapsed ? item.label : undefined}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        // Mobile behavior
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-72 lg:w-auto", // Mobile full width, desktop auto
        // Desktop width states
        isCollapsed ? "lg:w-16" : "lg:w-72"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex items-center border-b border-border transition-all duration-300",
            isCollapsed ? "justify-center p-3" : "justify-between p-6"
          )}>
            <div className={cn(
              "flex items-center transition-all duration-300",
              isCollapsed ? "gap-0" : "gap-3"
            )}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Cross className="h-4 w-4 text-white" />
              </div>
              <div className={cn(
                "transition-all duration-300 overflow-hidden",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <h1 className="text-lg font-bold text-foreground whitespace-nowrap">PharmaCare</h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Inventory System</p>
              </div>
            </div>
            
            {/* Toggle button for desktop */}
            <div className={cn(
              "flex items-center gap-2",
              isCollapsed ? "absolute top-3 right-3" : ""
            )}>
              {/* Desktop toggle button - only visible on lg+ screens */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapsed}
                className="hidden lg:flex"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
              
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navigationItems.map(item => renderNavItem(item))}
            </nav>
          </div>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className={cn(
              "flex items-center gap-3 mb-3",
              isCollapsed && "lg:justify-center lg:gap-0"
            )}>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <NavLink
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                title={isCollapsed ? "Profile" : undefined}
              >
                <User className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>Profile</span>}
              </NavLink>
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                title={isCollapsed ? "Logout" : undefined}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};