import React from "react";
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Download,
  FileText,
  Calendar,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Card, Button, Badge } from "../components/UI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

const Reports: React.FC = () => {
  const { state } = useStore();
  const isDark = state.settings.theme === "dark";

  // Calculate some report stats
  const totalRevenue = state.sales.reduce((acc, s) => acc + s.total, 0);
  const totalCost = state.sales.reduce((acc, s) => {
    return (
      acc +
      s.items.reduce((itemAcc, item) => itemAcc + item.buyPrice * item.qty, 0)
    );
  }, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Data for Category Distribution
  const categoryData = state.products.reduce((acc: any[], p) => {
    const existing = acc.find((item) => item.name === p.category);
    if (existing) {
      existing.value += p.stock;
    } else {
      acc.push({ name: p.category, value: p.stock });
    }
    return acc;
  }, []);

  const COLORS = ["#06b6d4", "#8b5cf6", "#d946ef", "#10b981", "#f59e0b"];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dailyTotal = state.sales
      .filter((s) => s.date.startsWith(dateStr))
      .reduce((acc, s) => acc + s.total, 0);
    return {
      name: d.toLocaleDateString(undefined, { weekday: "short" }),
      total: dailyTotal,
    };
  });

  const exportCSV = () => {
    const headers = ["Invoice No", "Date", "Customer", "Total", "Status"];
    const rows = state.sales.map((s) => [
      s.invoiceNo,
      new Date(s.date).toLocaleDateString(),
      s.customer.name,
      s.total.toFixed(2),
      s.payment.status,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "neon_sales_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2
              className={`text-xl font-orbitron font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Data Matrix
            </h2>
            <p className="text-xs text-slate-500">
              System intelligence and performance metrics
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <Download size={16} /> Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.print()}>
            <FileText size={16} /> Print Report
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">
            Accumulated Revenue
          </p>
          <h3
            className={`text-3xl font-orbitron font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Rs.{totalRevenue.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="info">Global Pulse</Badge>
            <span className="text-[10px] text-slate-500 font-bold">
              Lifetime Total
            </span>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">
            Net Margin Extract
          </p>
          <h3 className="text-3xl font-orbitron font-bold text-emerald-500">
            Rs.{totalProfit.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="success">Efficiency: {margin.toFixed(1)}%</Badge>
            <span className="text-[10px] text-slate-500 font-bold">
              Estimated Net
            </span>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">
            Grid Activity
          </p>
          <h3
            className={`text-3xl font-orbitron font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {state.sales.length}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="warning">Transactions</Badge>
            <span className="text-[10px] text-slate-500 font-bold">
              Verified Links
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales Frequency (Last 7 Cycles)">
          <div className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
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
                  cursor={{ fill: isDark ? "#1e293b" : "#f1f5f9" }}
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                  itemStyle={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                />
                <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Inventory Mass Distribution">
          <div className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  ></div>
                  <span
                    className={`text-xs font-bold ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {cat.name} ({cat.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Advanced Data Points">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-cyan-500" size={20} />
              <p
                className={`text-sm font-bold ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Operational Span
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Data aggregation commenced at system initialization. All frequency
              signals are monitored for peak efficiency. Current cycle stability
              is estimated at 99.8%.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="text-purple-500" size={20} />
              <p
                className={`text-sm font-bold ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Trend Extraction
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Predictive models suggest a 15% increase in hardware demand across
              the next 3 cycles. High-capacity power units and neural links are
              identified as priority acquisitions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
