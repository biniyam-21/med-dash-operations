import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Search, 
  Calculator,
  CreditCard,
  DollarSign,
  Receipt,
  User,
  Calendar,
  Trash2,
  Scan
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Drug {
  id: string;
  name: string;
  genericName: string;
  unitPrice: number;
  stockQuantity: number;
  batchNumber: string;
  expiryDate: string;
}

interface CartItem {
  drug: Drug;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Customer {
  name?: string;
  phone?: string;
  email?: string;
  prescriptionNumber?: string;
}

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({});
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance'>('cash');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  // Mock drug data
  const availableDrugs: Drug[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      unitPrice: 0.45,
      stockQuantity: 245,
      batchNumber: 'PC2024001',
      expiryDate: '2025-08-15'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      unitPrice: 1.25,
      stockQuantity: 8,
      batchNumber: 'BM2024015',
      expiryDate: '2024-12-30'
    },
    {
      id: '3',
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      unitPrice: 0.75,
      stockQuantity: 156,
      batchNumber: 'HM2024007',
      expiryDate: '2024-09-20'
    },
    {
      id: '4',
      name: 'Vitamin C 1000mg',
      genericName: 'Ascorbic Acid',
      unitPrice: 0.65,
      stockQuantity: 89,
      batchNumber: 'VL2024032',
      expiryDate: '2026-03-15'
    },
    {
      id: '5',
      name: 'Cough Syrup 100ml',
      genericName: 'Dextromethorphan',
      unitPrice: 3.50,
      stockQuantity: 67,
      batchNumber: 'CS2024018',
      expiryDate: '2025-11-22'
    }
  ];

  const filteredDrugs = availableDrugs.filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (drug: Drug) => {
    const existingItem = cart.find(item => item.drug.id === drug.id);
    
    if (existingItem) {
      if (existingItem.quantity < drug.stockQuantity) {
        updateQuantity(drug.id, existingItem.quantity + 1);
      }
    } else {
      const newItem: CartItem = {
        drug,
        quantity: 1,
        unitPrice: drug.unitPrice,
        total: drug.unitPrice
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (drugId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(drugId);
      return;
    }

    setCart(cart.map(item => {
      if (item.drug.id === drugId) {
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice
        };
      }
      return item;
    }));
  };

  const removeFromCart = (drugId: string) => {
    setCart(cart.filter(item => item.drug.id !== drugId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const resetSale = () => {
    setCart([]);
    setCustomer({});
    setDiscount(0);
    setNotes('');
    setPaymentMethod('cash');
  };

  const completeSale = () => {
    // Here you would normally process the sale
    console.log('Processing sale:', {
      cart,
      customer,
      total,
      paymentMethod,
      discount,
      notes
    });
    
    // Reset for next sale
    resetSale();
    
    // Show success message (you would use a toast notification)
    alert('Sale completed successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Point of Sale (POS)</h1>
          <p className="text-muted-foreground mt-1">
            Process customer sales and manage transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSale}>
            Clear Sale
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent">
            <Receipt className="h-4 w-4" />
            Sales History
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Search & Selection */}
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Products
              </CardTitle>
              <CardDescription>
                Find and add drugs to the sale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search drugs by name or generic name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredDrugs.map((drug) => (
                    <div
                      key={drug.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{drug.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {drug.genericName} • Stock: {drug.stockQuantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">${drug.unitPrice}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(drug)}
                          disabled={drug.stockQuantity === 0}
                          className="gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredDrugs.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-muted-foreground">
                      No drugs found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="customerName">Name</Label>
                    <Input
                      id="customerName"
                      placeholder="Customer name"
                      value={customer.name || ''}
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      placeholder="Phone number"
                      value={customer.phone || ''}
                      onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="prescriptionNumber">Prescription Number (Optional)</Label>
                  <Input
                    id="prescriptionNumber"
                    placeholder="Prescription reference"
                    value={customer.prescriptionNumber || ''}
                    onChange={(e) => setCustomer({...customer, prescriptionNumber: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart & Checkout */}
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart
                {cart.length > 0 && (
                  <Badge className="ml-2">{cart.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No items in cart</p>
                  <p className="text-sm">Search and add products to begin sale</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.drug.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.drug.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${item.unitPrice} each
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.drug.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.drug.id, item.quantity + 1)}
                          disabled={item.quantity >= item.drug.stockQuantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="w-20 text-right font-medium">
                        ${item.total.toFixed(2)}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.drug.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checkout */}
          {cart.length > 0 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Checkout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Discount */}
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label>Payment Method</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('cash')}
                        className="flex-1"
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Cash
                      </Button>
                      <Button
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('card')}
                        className="flex-1"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Card
                      </Button>
                      <Button
                        variant={paymentMethod === 'insurance' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('insurance')}
                        className="flex-1"
                      >
                        Insurance
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes for this sale..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <Separator />

                  {/* Total Calculation */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>Discount ({discount}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={completeSale}
                    className="w-full gap-2 bg-gradient-to-r from-success to-accent"
                    size="lg"
                  >
                    <Receipt className="h-4 w-4" />
                    Complete Sale - ${total.toFixed(2)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;