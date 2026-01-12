import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  StoreState,
  StoreAction,
  Product,
  Sale,
  Purchase,
  AppSettings,
  Customer,
  Supplier,
} from "../types";

const INITIAL_SETTINGS: AppSettings = {
  storeName: "Sujit Electronics",
  address: "Bharatpur-11, Chitwan",
  currency: "USD",
  taxRate: 8,
  theme: "light",
};

const SEED_PRODUCTS: Product[] = [
  {
    id: "1",
    sku: "NEON-IP15-P",
    name: "iPhone 15 Pro Max",
    category: "Phones",
    unit: "pcs",
    stock: 12,
    buyPrice: 126350,
    sellPrice: 159467,
    lowStockAt: 5,
  },
  {
    id: "2",
    sku: "NEON-S24-U",
    name: "Samsung Galaxy S24 Ultra",
    category: "Phones",
    unit: "pcs",
    stock: 8,
    buyPrice: 119700,
    sellPrice: 172767,
    lowStockAt: 3,
  },
  {
    id: "3",
    sku: "NEON-MBP-14",
    name: 'MacBook Pro 14" M3',
    category: "Laptops",
    unit: "pcs",
    stock: 5,
    buyPrice: 186200,
    sellPrice: 265867,
    lowStockAt: 2,
  },
  {
    id: "4",
    sku: "NEON-ROG-ST",
    name: "ASUS ROG Strix G16",
    category: "Laptops",
    unit: "pcs",
    stock: 3,
    buyPrice: 146300,
    sellPrice: 199367,
    lowStockAt: 2,
  },
  {
    id: "5",
    sku: "NEON-SNY-XM5",
    name: "Sony WH-1000XM5",
    category: "Audio",
    unit: "pcs",
    stock: 25,
    buyPrice: 29260,
    sellPrice: 46417,
    lowStockAt: 10,
  },
  {
    id: "6",
    sku: "NEON-LGT-GPW",
    name: "Logitech G Pro Wireless",
    category: "Accessories",
    unit: "pcs",
    stock: 45,
    buyPrice: 10640,
    sellPrice: 17157,
    lowStockAt: 15,
  },
  {
    id: "7",
    sku: "NEON-SAM-G7",
    name: 'Samsung Odyssey G7 32"',
    category: "Monitors",
    unit: "pcs",
    stock: 6,
    buyPrice: 59850,
    sellPrice: 92967,
    lowStockAt: 3,
  },
  {
    id: "8",
    sku: "NEON-KEY-K2",
    name: "Keychron K2 Mechanical",
    category: "Accessories",
    unit: "pcs",
    stock: 18,
    buyPrice: 8645,
    sellPrice: 13167,
    lowStockAt: 5,
  },
  {
    id: "9",
    sku: "NEON-PWB-20",
    name: "Anker PowerCore 20K",
    category: "Accessories",
    unit: "pcs",
    stock: 50,
    buyPrice: 4655,
    sellPrice: 7847,
    lowStockAt: 20,
  },
];

const SEED_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "John Doe",
    phone: "555-0101",
    address: "Upper Hive, Sector 4",
  },
  {
    id: "c2",
    name: "Jane Smith",
    phone: "555-0202",
    address: "Tech District 9",
  },
  { id: "c3", name: "Cipher Zero", phone: "555-0999", address: "Undergrid B3" },
];

const SEED_SUPPLIERS: Supplier[] = [
  {
    id: "sup1",
    name: "Global Tech Distro",
    phone: "999-222",
    address: "Logistics Hub A",
  },
  {
    id: "sup2",
    name: "Neon-Core Manufacturing",
    phone: "999-333",
    address: "Factory Zone 7",
  },
];

const generateSales = (): Sale[] => {
  const sales: Sale[] = [];
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const prod = SEED_PRODUCTS[i % SEED_PRODUCTS.length];
    const subtotal = prod.sellPrice;
    const tax = subtotal * 0.08;
    sales.push({
      id: `s${i}`,
      invoiceNo: `INV-202${i}`,
      date: date.toISOString(),
      customer: SEED_CUSTOMERS[i % SEED_CUSTOMERS.length],
      items: [
        {
          productId: prod.id,
          name: prod.name,
          qty: 1,
          unitPrice: prod.sellPrice,
          buyPrice: prod.buyPrice,
          discount: 0,
        },
      ],
      subtotal,
      tax,
      total: subtotal + tax,
      payment: {
        status: i % 3 === 0 ? "partial" : "paid",
        method: i % 2 === 0 ? "card" : "cash",
        paidAmount: i % 3 === 0 ? subtotal / 2 : subtotal + tax,
      },
    });
  }
  return sales;
};

const generatePurchases = (): Purchase[] => {
  const purchases: Purchase[] = [];
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const date = new Date(now.getTime() - i * 3 * 24 * 60 * 60 * 1000);
    const prod = SEED_PRODUCTS[i % SEED_PRODUCTS.length];
    purchases.push({
      id: `p${i}`,
      poNo: `PO-88${i}`,
      date: date.toISOString(),
      supplier: SEED_SUPPLIERS[i % SEED_SUPPLIERS.length],
      items: [
        {
          productId: prod.id,
          name: prod.name,
          qty: 10,
          unitCost: prod.buyPrice,
        },
      ],
      total: prod.buyPrice * 10,
      status: i === 0 ? "pending" : "received",
    });
  }
  return purchases;
};

const INITIAL_STATE: StoreState = {
  products: SEED_PRODUCTS,
  sales: generateSales(),
  purchases: generatePurchases(),
  customers: SEED_CUSTOMERS,
  suppliers: SEED_SUPPLIERS,
  settings: INITIAL_SETTINGS,
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_SALE":
      return {
        ...state,
        sales: [action.payload, ...state.sales],
        products: state.products.map((p) => {
          const item = action.payload.items.find((i) => i.productId === p.id);
          return item ? { ...p, stock: p.stock - item.qty } : p;
        }),
      };
    case "ADD_PURCHASE":
      return {
        ...state,
        purchases: [action.payload, ...state.purchases],
        products: state.products.map((p) => {
          const item = action.payload.items.find((i) => i.productId === p.id);
          return item ? { ...p, stock: p.stock + item.qty } : p;
        }),
      };
    case "UPSERT_PRODUCT": {
      const exists = state.products.find((p) => p.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          products: state.products.map((p) =>
            p.id === action.payload.id ? action.payload : p
          ),
        };
      }
      return { ...state, products: [...state.products, action.payload] };
    }
    case "UPDATE_STOCK":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.productId
            ? { ...p, stock: p.stock + action.payload.adjustment }
            : p
        ),
      };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "RESET_DATA":
      return INITIAL_STATE;
    default:
      return state;
  }
}

const StoreContext = createContext<
  | {
      state: StoreState;
      dispatch: React.Dispatch<StoreAction>;
    }
  | undefined
>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(storeReducer, INITIAL_STATE);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
