import React from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useStore } from "../context/StoreContext";
import { Card, Badge, Button } from "../components/UI";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { state } = useStore();
  const isDark = state.settings.theme === "dark";

  const today = new Date().toISOString().split("T")[0];
  const todaySales = state.sales
    .filter((s) => s.date.startsWith(today))
    .reduce((acc, s) => acc + s.total, 0);

  const totalRevenue = state.sales.reduce((acc, s) => acc + s.total, 0);
  const totalCost = state.sales.reduce((acc, s) => {
    return (
      acc +
      s.items.reduce((itemAcc, item) => itemAcc + item.buyPrice * item.qty, 0)
    );
  }, 0);
  const estimatedProfit = totalRevenue - totalCost;

  const lowStockCount = state.products.filter(
    (p) => p.stock <= p.lowStockAt
  ).length;

  // Mock chart data
  const chartData = [
    { name: "Day 1", sales: 4000, purchases: 2400 },
    { name: "Day 5", sales: 3000, purchases: 1398 },
    { name: "Day 10", sales: 2000, purchases: 9800 },
    { name: "Day 15", sales: 2780, purchases: 3908 },
    { name: "Day 20", sales: 1890, purchases: 4800 },
    { name: "Day 25", sales: 2390, purchases: 3800 },
    { name: "Day 30", sales: 3490, purchases: 4300 },
  ];

  const topProducts = state.products
    .sort((a, b) => b.sellPrice - a.sellPrice)
    .slice(0, 5)
    .map((p) => ({
      name: p.name.split(" ").slice(0, 2).join(" "),
      value: p.sellPrice,
    }));

  const COLORS = ["#06b6d4", "#8b5cf6", "#d946ef", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Header */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-8 transition-all ${
          isDark
            ? "bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-slate-800"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="relative z-10">
          <h2
            className={`text-3xl font-orbitron font-bold mb-2  ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Welcome back, Sujit.
          </h2>
          <p
            className={`${
              isDark ? "text-slate-400" : "text-slate-600"
            } max-w-lg`}
          >
            Your electronics empire is thriving.{" "}
            {lowStockCount > 0
              ? `${lowStockCount} items require immediate inventory restock.`
              : "All systems normal."}
          </p>
          <div className="flex gap-4 mt-6">
            <Link to="/sales/new">
              <Button size="md">
                <Plus size={18} /> New Sale
              </Button>
            </Link>
            <Link to="/purchases/new">
              <Button variant="neon-purple" size="md">
                Restock
              </Button>
            </Link>
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-500/5"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-64 h-64 blur-[100px] rounded-full ${
            isDark ? "bg-purple-500/10" : "bg-purple-500/5"
          }`}
        ></div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:translate-y-[-4px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Today's Revenue
              </p>
              <h4
                className={`text-2xl font-bold  ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Rs.{todaySales.toLocaleString()}
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <span className="text-xl font-bold">Rs</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-500 font-bold">
            <ArrowUpRight size={14} className="mr-1" />
            <span>+12.5% from yesterday</span>
          </div>
        </Card>

        <Card className="hover:translate-y-[-4px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Month Sales
              </p>
              <h4
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Rs.{totalRevenue.toLocaleString()}
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-500 font-bold">
            <ArrowUpRight size={14} className="mr-1" />
            <span>+8.2% from last month</span>
          </div>
        </Card>

        <Card className="hover:translate-y-[-4px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Estimated Profit
              </p>
              <h4
                className={`text-2xl font-bold  ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Rs.{estimatedProfit.toLocaleString()}
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-rose-500 font-bold">
            <ArrowDownRight size={14} className="mr-1" />
            <span>-2.1% margin drop</span>
          </div>
        </Card>

        <Card className="hover:translate-y-[-4px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Low Stock
              </p>
              <h4
                className={`text-2xl font-bold  ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {lowStockCount} Items
              </h4>
            </div>
            <div
              className={`p-3 rounded-xl ${
                lowStockCount > 0
                  ? "bg-rose-500/10 text-rose-500"
                  : isDark
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span>Critical threshold alert active</span>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Finance Trajectory">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorPurchases"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? "#1e293b" : "#e2e8f0"}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    color: isDark ? "#e2e8f0" : "#1e293b",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorPurchases)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top Inventory Revenue">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748b"
                  fontSize={10}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {topProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity List */}
      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`text-left border-b ${
                  isDark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Entity / Invoice
                </th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Amount
                </th>
                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="pb-4 text-right"></th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-slate-800/50" : "divide-slate-100"
              }`}
            >
              {state.sales.slice(0, 5).map((sale) => (
                <tr
                  key={sale.id}
                  className={`group transition-colors ${
                    isDark ? "hover:bg-slate-800/20" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-4">
                    <p
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {sale.customer.name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {sale.invoiceNo}
                    </p>
                  </td>
                  <td className="py-4 text-sm text-slate-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-sm font-orbitron text-cyan-500 font-bold">
                    Rs.{sale.total.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <Badge
                      variant={
                        sale.payment.status === "paid" ? "success" : "warning"
                      }
                    >
                      {sale.payment.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      to={`/sales/${sale.id}`}
                      className="text-slate-400 group-hover:text-cyan-500 transition-colors"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {state.sales.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-slate-500 text-sm italic"
                  >
                    No recent transactions recorded.
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

export default Dashboard;
