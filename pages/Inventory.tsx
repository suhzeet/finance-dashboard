import React, { useState } from "react";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Card, Button, Input, Select, Badge } from "../components/UI";

const Inventory: React.FC = () => {
  const { state } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const isDark = state.settings.theme === "dark";

  const categories = [
    "All",
    ...Array.from(new Set(state.products.map((p) => p.category))),
  ];

  const filteredProducts = state.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <h2
              className={`text-xl font-orbitron font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Stock Depository
            </h2>
            <p className="text-xs text-slate-500">
              Manage {state.products.length} catalog entities
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          className="font-orbitron uppercase tracking-widest text-xs"
        >
          <Plus size={18} /> New SKU
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
              placeholder="Search by name or SKU..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                className={`text-left border-b ${
                  isDark ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Product / SKU
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Category
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                  Buying
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                  Selling
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                  In Stock
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
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.lowStockAt;
                const outOfStock = p.stock <= 0;

                return (
                  <tr
                    key={p.id}
                    className={`group transition-colors ${
                      isDark ? "hover:bg-slate-800/20" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-4 px-2">
                      <p
                        className={`text-sm font-bold group-hover:text-cyan-600 transition-colors ${
                          isDark ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {p.sku}
                      </p>
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                          isDark
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-2 text-sm text-right ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Rs.{p.buyPrice.toLocaleString()}
                    </td>
                    <td
                      className={`py-4 px-2 text-sm text-right font-bold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Rs.{p.sellPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span
                        className={`text-sm font-orbitron font-bold ${
                          isLow
                            ? "text-rose-500 animate-pulse"
                            : "text-cyan-500"
                        }`}
                      >
                        {p.stock}{" "}
                        <span className="text-[10px] opacity-50 font-sans">
                          {p.unit}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      {outOfStock ? (
                        <Badge variant="error">Depleted</Badge>
                      ) : isLow ? (
                        <Badge variant="warning">Critical</Badge>
                      ) : (
                        <Badge variant="success">Available</Badge>
                      )}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className={`p-2 transition-colors ${
                            isDark
                              ? "text-slate-500 hover:text-cyan-400"
                              : "text-slate-400 hover:text-cyan-600"
                          }`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={`p-2 transition-colors ${
                            isDark
                              ? "text-slate-500 hover:text-rose-400"
                              : "text-slate-400 hover:text-rose-600"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-20 text-center text-slate-500 italic"
                  >
                    No inventory matches your search criteria.
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

export default Inventory;
