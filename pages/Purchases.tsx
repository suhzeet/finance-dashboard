import React, { useState } from "react";
import { Truck, Search, Plus, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Card, Button, Input, Badge } from "../components/UI";

const Purchases: React.FC = () => {
  const { state } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const isDark = state.settings.theme === "dark";

  const filteredPurchases = state.purchases.filter(
    (p) =>
      p.poNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
            <Truck size={24} />
          </div>
          <div>
            <h2
              className={`text-xl font-orbitron font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Import Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Factory restocks and supply shipments
            </p>
          </div>
        </div>
        <Button variant="neon-purple">
          <Plus size={18} /> New Purchase
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <Input
              placeholder="Search by PO # or Supplier..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                className={`text-left border-b ${
                  isDark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  PO # / Date
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Supplier Source
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                  SKUs
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                  Investment
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="pb-4 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-slate-800/50" : "divide-slate-100"
              }`}
            >
              {filteredPurchases.map((p) => (
                <tr
                  key={p.id}
                  className={`group transition-colors ${
                    isDark ? "hover:bg-slate-800/20" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-4 px-2">
                    <p
                      className={`text-sm font-bold group-hover:text-purple-600 transition-colors font-orbitron ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {p.poNo}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {new Date(p.date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {p.supplier.name}
                    </p>
                  </td>
                  <td className="py-4 px-2 text-center text-sm text-slate-500 font-bold">
                    {p.items.length}
                  </td>
                  <td className="py-4 px-2 text-right text-sm font-bold text-purple-500 font-orbitron">
                    Rs.{p.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-2">
                    <Badge
                      variant={p.status === "received" ? "success" : "warning"}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button
                      className={`p-2 transition-colors ${
                        isDark
                          ? "text-slate-500 hover:text-purple-400"
                          : "text-slate-400 hover:text-purple-600"
                      }`}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-20 text-center text-slate-500 italic"
                  >
                    Import pipeline is currently empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Purchases;
