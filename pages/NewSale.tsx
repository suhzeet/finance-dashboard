import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Save,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Card, Button, Input, Select } from "../components/UI";
import { SaleItem, Customer } from "../types";

const NewSale: React.FC = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const isDark = state.settings.theme === "dark";

  const [customer, setCustomer] = useState<Partial<Customer>>({
    name: "",
    phone: "",
  });
  const [items, setItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "upi" | "other"
  >("card");
  const [paidAmount, setPaidAmount] = useState<string>("0");

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        name: "",
        qty: 1,
        unitPrice: 0,
        buyPrice: 0,
        discount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<SaleItem>) => {
    const newItems = [...items];
    const product = state.products.find((p) => p.id === updates.productId);

    if (product && updates.productId) {
      newItems[index] = {
        ...newItems[index],
        productId: product.id,
        name: product.name,
        unitPrice: product.sellPrice,
        buyPrice: product.buyPrice,
        ...updates,
      };
    } else {
      newItems[index] = { ...newItems[index], ...updates };
    }
    setItems(newItems);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.qty - item.discount,
    0
  );
  const tax = subtotal * (state.settings.taxRate / 100);
  const total = subtotal + tax;

  useEffect(() => {
    setPaidAmount(total.toFixed(2));
  }, [total]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customer.name) return;

    const newSale = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      customer: {
        id: Math.random().toString(36).substr(2, 9),
        name: customer.name || "Walk-in",
        phone: customer.phone,
        address: customer.address,
      },
      items,
      subtotal,
      tax,
      total,
      payment: {
        status: (parseFloat(paidAmount) >= total ? "paid" : "partial") as any,
        method: paymentMethod,
        paidAmount: parseFloat(paidAmount),
      },
    };

    dispatch({ type: "ADD_SALE", payload: newSale });
    navigate(`/sales/${newSale.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800 text-slate-400 hover:text-white"
                : "bg-white text-slate-500 hover:text-slate-900 shadow-sm border border-slate-200"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <h2
            className={`text-xl font-orbitron font-bold tracking-wider ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Execute New Transaction
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card title="Customer Interface">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Identity / Full Name"
                placeholder="Nexus User #001"
                required
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <Input
                label="Comm-link / Phone"
                placeholder="555-NEON-01"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
            </div>
          </Card>

          <Card title="Hardware Allocation">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-12 gap-3 items-end p-3 rounded-lg border transition-colors group ${
                    isDark
                      ? "bg-slate-900/40 border-slate-800/50"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="col-span-5">
                    <Select
                      label="Select Unit"
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(index, { productId: e.target.value })
                      }
                    >
                      <option value="">-- Choose Hardware --</option>
                      {state.products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Rs.{p.sellPrice})
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Qty"
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(index, {
                          qty: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Price"
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, {
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 text-right px-2 pb-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Sum
                    </p>
                    <p className="text-sm font-bold text-cyan-500 font-orbitron">
                      Rs.{(item.unitPrice * item.qty).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-1 pb-1">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div
                  className={`text-center py-8 border-2 border-dashed rounded-xl ${
                    isDark ? "border-slate-800" : "border-slate-200 bg-white/50"
                  }`}
                >
                  <ShoppingCart
                    className="mx-auto text-slate-400 mb-2 opacity-30"
                    size={32}
                  />
                  <p className="text-slate-500 text-sm italic">
                    Allocation queue is empty. Scan for units.
                  </p>
                </div>
              )}

              <Button
                type="button"
                variant="secondary"
                className="w-full border-dashed"
                onClick={addItem}
              >
                <Plus size={18} /> Link Hardware Part
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Billing Summary">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Sub-Total</span>
                <span
                  className={`font-bold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Rs.{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">
                  Grip Tax ({state.settings.taxRate}%)
                </span>
                <span
                  className={`font-bold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Rs.{tax.toLocaleString()}
                </span>
              </div>
              <div
                className={`h-px my-2 ${
                  isDark ? "bg-slate-800" : "bg-slate-100"
                }`}
              ></div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest mt-1">
                  Total Credits
                </span>
                <span
                  className={`text-2xl font-orbitron font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Rs.{total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Select
                label="Relay Protocol / Payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <option value="card">Neural Card</option>
                <option value="upi">Direct Link (UPI)</option>
                <option value="cash">Hard Currency (Cash)</option>
                <option value="other">Encrypted Other</option>
              </Select>

              <Input
                label="Credits Transferred"
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 py-4 font-orbitron tracking-widest"
              variant="primary"
              disabled={items.length === 0 || !customer.name}
            >
              <Save size={18} /> Finalize Transaction
            </Button>
          </Card>

          <div
            className={`p-4 border rounded-xl flex gap-3 ${
              isDark
                ? "bg-purple-500/5 border-purple-500/20"
                : "bg-purple-50 border-purple-100"
            }`}
          >
            <AlertCircle className="text-purple-500 shrink-0" size={20} />
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Verify hardware IDs before committing to the grid. All
              transactions are final and logged in the circuit.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewSale;
