import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/add" element={<div>Add Drug Page</div>} />
              <Route path="inventory/expiry" element={<div>Expiry Monitor Page</div>} />
              <Route path="inventory/movement" element={<div>Stock Movement Page</div>} />
              <Route path="sales" element={<Sales />} />
              <Route path="sales/new" element={<Sales />} />
              <Route path="sales/history" element={<div>Sales History Page</div>} />
              <Route path="sales/returns" element={<div>Returns Page</div>} />
              <Route path="purchases" element={<div>Purchases Page</div>} />
              <Route path="purchases/new" element={<div>New Purchase Page</div>} />
              <Route path="purchases/receive" element={<div>Receive Stock Page</div>} />
              <Route path="purchases/history" element={<div>Purchase History Page</div>} />
              <Route path="suppliers" element={<div>Suppliers Page</div>} />
              <Route path="suppliers/add" element={<div>Add Supplier Page</div>} />
              <Route path="suppliers/status" element={<div>Supplier Status Page</div>} />
              <Route path="branches" element={<div>Branches Page</div>} />
              <Route path="branches/transfers" element={<div>Stock Transfers Page</div>} />
              <Route path="branches/reports" element={<div>Branch Reports Page</div>} />
              <Route path="reports" element={<div>Reports Page</div>} />
              <Route path="reports/sales" element={<div>Sales Reports Page</div>} />
              <Route path="reports/expiry" element={<div>Expiry Reports Page</div>} />
              <Route path="reports/top-sellers" element={<div>Top Sellers Page</div>} />
              <Route path="reports/profit-loss" element={<div>P&L Reports Page</div>} />
              <Route path="users" element={<div>Users Page</div>} />
              <Route path="users/roles" element={<div>User Roles Page</div>} />
              <Route path="audit" element={<div>Audit Trail Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
              <Route path="profile" element={<div>Profile Page</div>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
