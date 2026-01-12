import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Plus, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Card, Button, Input, Badge } from "../components/UI";

const Sales: React.FC = () => {
  const { state } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const isDark = state.settings.theme === "dark";

  const filteredSales = state.sales.filter(
    (s) =>
      s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2
              className={`text-xl font-orbitron font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Sales Registry
            </h2>
            <p className="text-xs text-slate-500">
              History of all hardware transfers
            </p>
          </div>
        </div>
        <Link to="/sales/new">
          <Button variant="primary">
            <Plus size={18} /> New Transaction
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <Input
              placeholder="Search by Invoice # or Customer..."
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
                  Invoice / Date
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Customer Entity
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                  Items
                </th>
                <th className="pb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                  Total Credits
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
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className={`group transition-colors ${
                    isDark ? "hover:bg-slate-800/20" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-4 px-2">
                    <p
                      className={`text-sm font-bold group-hover:text-cyan-600 transition-colors font-orbitron ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {sale.invoiceNo}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {sale.customer.name}
                    </p>
                  </td>
                  <td className="py-4 px-2 text-center text-sm text-slate-500 font-bold">
                    {sale.items.length}
                  </td>
                  <td className="py-4 px-2 text-right text-sm font-bold text-cyan-600 font-orbitron">
                    Rs.{sale.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-2">
                    <Badge
                      variant={
                        sale.payment.status === "paid" ? "success" : "warning"
                      }
                    >
                      {sale.payment.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Link
                      to={`/sales/${sale.id}`}
                      className="inline-flex items-center gap-2 p-2 text-slate-500 hover:text-cyan-600 transition-colors"
                    >
                      <span className="text-[10px] font-bold hidden md:inline tracking-widest">
                        VIEW RECORD
                      </span>
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-20 text-center text-slate-500 italic"
                  >
                    No transactions detected on this frequency.
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

export default Sales;
