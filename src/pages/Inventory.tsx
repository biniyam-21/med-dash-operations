import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
  location: string;
}

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const drugs: Drug[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Analgesics',
      manufacturer: 'PharmaCorp',
      batchNumber: 'PC2024001',
      expiryDate: '2025-08-15',
      quantity: 245,
      reorderLevel: 50,
      unitPrice: 0.45,
      status: 'in-stock',
      location: 'A1-S2'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      manufacturer: 'BioMed Ltd',
      batchNumber: 'BM2024015',
      expiryDate: '2024-12-30',
      quantity: 8,
      reorderLevel: 25,
      unitPrice: 1.25,
      status: 'low-stock',
      location: 'B2-S1'
    },
    {
      id: '3',
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      category: 'Anti-inflammatory',
      manufacturer: 'HealthMax',
      batchNumber: 'HM2024007',
      expiryDate: '2024-09-20',
      quantity: 156,
      reorderLevel: 30,
      unitPrice: 0.75,
      status: 'in-stock',
      location: 'A3-S1'
    },
    {
      id: '4',
      name: 'Aspirin 100mg',
      genericName: 'Acetylsalicylic Acid',
      category: 'Cardiovascular',
      manufacturer: 'CardioMeds',
      batchNumber: 'CM2023089',
      expiryDate: '2024-08-10',
      quantity: 0,
      reorderLevel: 40,
      unitPrice: 0.35,
      status: 'out-of-stock',
      location: 'C1-S3'
    },
    {
      id: '5',
      name: 'Vitamin C 1000mg',
      genericName: 'Ascorbic Acid',
      category: 'Vitamins',
      manufacturer: 'VitaLife',
      batchNumber: 'VL2024032',
      expiryDate: '2026-03-15',
      quantity: 89,
      reorderLevel: 20,
      unitPrice: 0.65,
      status: 'in-stock',
      location: 'D1-S2'
    }
  ];

  const categories = [
    'Analgesics', 'Antibiotics', 'Anti-inflammatory', 
    'Cardiovascular', 'Vitamins', 'Respiratory', 'Digestive'
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
      case 'low-stock':
        return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-destructive text-destructive-foreground">Out of Stock</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-destructive border-destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring-soon';
    if (daysUntilExpiry <= 90) return 'expiring-later';
    return 'good';
  };

  const getExpiryBadge = (expiryDate: string) => {
    const status = getExpiryStatus(expiryDate);
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (status) {
      case 'expired':
        return <Badge variant="destructive" className="text-xs">Expired</Badge>;
      case 'expiring-soon':
        return <Badge variant="outline" className="text-warning border-warning text-xs">{daysUntilExpiry}d</Badge>;
      case 'expiring-later':
        return <Badge variant="outline" className="text-xs">{daysUntilExpiry}d</Badge>;
      default:
        return <span className="text-xs text-muted-foreground">{expiry.toLocaleDateString()}</span>;
    }
  };

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || drug.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || drug.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const inventoryStats = {
    total: drugs.length,
    inStock: drugs.filter(d => d.status === 'in-stock').length,
    lowStock: drugs.filter(d => d.status === 'low-stock').length,
    outOfStock: drugs.filter(d => d.status === 'out-of-stock').length,
    expiringSoon: drugs.filter(d => getExpiryStatus(d.expiryDate) === 'expiring-soon').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your pharmacy inventory and monitor stock levels
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-accent">
          <Plus className="h-4 w-4" />
          Add New Drug
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.total}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{inventoryStats.inStock}</div>
            <p className="text-xs text-muted-foreground">Well stocked items</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{inventoryStats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{inventoryStats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Unavailable items</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{inventoryStats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search drugs by name, generic name, or manufacturer..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Drug Inventory
          </CardTitle>
          <CardDescription>
            Complete list of all drugs in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Information</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Batch & Location</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrugs.map((drug) => (
                <TableRow key={drug.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{drug.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {drug.genericName} • {drug.manufacturer}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {drug.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Batch: {drug.batchNumber}</div>
                      <div className="text-muted-foreground">Loc: {drug.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{drug.quantity} units</div>
                      <div className="text-xs text-muted-foreground">
                        Reorder at: {drug.reorderLevel}
                      </div>
                      {drug.quantity <= drug.reorderLevel && (
                        <div className="flex items-center gap-1 text-warning">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">Below reorder level</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getExpiryBadge(drug.expiryDate)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${drug.unitPrice}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(drug.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Drug
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete Drug
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;