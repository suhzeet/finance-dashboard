
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  lowStockAt: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  buyPrice: number;
  discount: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  date: string;
  customer: Customer;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment: {
    status: 'paid' | 'unpaid' | 'partial';
    method: 'cash' | 'card' | 'upi' | 'other';
    paidAmount: number;
  };
}

export interface PurchaseItem {
  productId: string;
  name: string;
  qty: number;
  unitCost: number;
}

export interface Purchase {
  id: string;
  poNo: string;
  date: string;
  supplier: Supplier;
  items: PurchaseItem[];
  total: number;
  status: 'received' | 'pending' | 'cancelled';
}

export interface AppSettings {
  storeName: string;
  address: string;
  currency: string;
  taxRate: number;
  theme: 'dark' | 'light';
}

export interface StoreState {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  customers: Customer[];
  suppliers: Supplier[];
  settings: AppSettings;
}

export type StoreAction =
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'ADD_PURCHASE'; payload: Purchase }
  | { type: 'UPSERT_PRODUCT'; payload: Product }
  | { type: 'UPDATE_STOCK'; payload: { productId: string; adjustment: number } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'RESET_DATA' };
