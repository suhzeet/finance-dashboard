import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, ChevronLeft, Download, ShieldCheck, Cpu } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Card, Button, Badge } from "../components/UI";

const InvoiceView: React.FC = () => {
  const { id } = useParams();
  const { state } = useStore();
  const navigate = useNavigate();
  const isDark = state.settings.theme === "dark";

  const sale = state.sales.find((s) => s.id === id);

  if (!sale) {
    return (
      <div className="text-center py-20">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Record Not Found
        </h2>
        <Button onClick={() => navigate("/sales")} className="mt-4">
          Back to Registry
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6 no-print">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/sales")}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800 text-slate-400 hover:text-white"
                : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <h2
            className={`text-xl font-orbitron font-bold uppercase tracking-wider ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            Circuit Record
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handlePrint}>
            <Printer size={18} /> Print Invoice
          </Button>
          <Button variant="primary">
            <Download size={18} /> Export PDF
          </Button>
        </div>
      </div>

      <div
        className={`border rounded-2xl overflow-hidden shadow-2xl transition-colors ${
          isDark ? "bg-[#0c111d] border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        {/* Invoice Header */}
        <div
          className={`p-8 md:p-12 border-b relative ${
            isDark
              ? "bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-slate-800"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cpu size={120} className="text-cyan-500" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div>
              <h1
                className={`text-4xl font-orbitron font-extrabold tracking-tighter mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                NEON<span className="text-cyan-500">CIRCUIT</span>
              </h1>
              <p className="text-cyan-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                Precision Electronics Grid
              </p>
              <div className="text-slate-500 text-sm space-y-1 font-medium">
                <p>{state.settings.address}</p>
                <p>Grid-Link: admin@neoncircuit.io</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h2
                className={`text-2xl font-orbitron font-bold mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {sale.invoiceNo}
              </h2>
              <p className="text-slate-500 text-sm mb-4 font-medium">
                Cycle Date: {new Date(sale.date).toLocaleString()}
              </p>
              <Badge
                variant={sale.payment.status === "paid" ? "success" : "warning"}
              >
                Payment: {sale.payment.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Client & Payment Info */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 border-b ${
            isDark ? "border-slate-800" : "border-slate-100"
          }`}
        >
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Client Destination
            </h4>
            <div
              className={`border p-4 rounded-xl transition-colors ${
                isDark
                  ? "bg-slate-900/40 border-slate-800/50"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <p
                className={`text-lg font-bold mb-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {sale.customer.name}
              </p>
              <p className="text-slate-500 text-sm font-medium">
                {sale.customer.phone || "N/A"}
              </p>
              <p className="text-slate-500 text-xs mt-2 italic font-medium">
                {sale.customer.address || "Direct Network Pickup"}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:items-end">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Payment Protocol
            </h4>
            <div
              className={`border p-4 rounded-xl w-full md:w-64 text-left md:text-right transition-colors ${
                isDark
                  ? "bg-slate-900/40 border-slate-800/50"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <p className="text-sm text-slate-500 font-medium mb-1">
                Standard:{" "}
                <span
                  className={`font-bold uppercase ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  {sale.payment.method}
                </span>
              </p>
              <p className="text-sm text-slate-500 font-medium">
                Transferred:{" "}
                <span className="text-cyan-600 font-bold font-orbitron">
                  Rs.{sale.payment.paidAmount.toLocaleString()}
                </span>
              </p>
              {sale.total > sale.payment.paidAmount && (
                <p className="text-xs text-rose-500 mt-2 font-bold animate-pulse">
                  REMAINING DEBT: Rs.
                  {(sale.total - sale.payment.paidAmount).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="p-8 md:p-12 overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Hardware Module
                </th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Unit-Price
                </th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Qty
                </th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Sum
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-slate-800/50" : "divide-slate-100"
              }`}
            >
              {sale.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-6">
                    <p
                      className={`font-bold ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      MODULE-ID: {item.productId.slice(0, 8).toUpperCase()}
                    </p>
                  </td>
                  <td className="py-6 text-center text-slate-500 font-medium">
                    Rs.{item.unitPrice.toLocaleString()}
                  </td>
                  <td
                    className={`py-6 text-center font-bold font-orbitron ${
                      isDark ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {item.qty}
                  </td>
                  <td className="py-6 text-right text-cyan-600 font-bold font-orbitron">
                    Rs.{(item.unitPrice * item.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div
          className={`p-8 md:p-12 border-t flex flex-col items-end transition-colors ${
            isDark
              ? "bg-slate-900/60 border-slate-800"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>NET CREDIT SUM</span>
              <span
                className={`font-bold ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                Rs.{sale.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>SYSTEM TAX ({state.settings.taxRate}%)</span>
              <span
                className={`font-bold ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                Rs.{sale.tax.toLocaleString()}
              </span>
            </div>
            <div
              className={`h-px my-4 ${
                isDark ? "bg-slate-800" : "bg-slate-200"
              }`}
            ></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">
                TOTAL VALUE
              </span>
              <span
                className={`text-3xl font-orbitron font-extrabold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Rs.{sale.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-8 text-center border-t transition-colors ${
            isDark ? "border-slate-800/50" : "border-slate-100"
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-emerald-500 mb-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Encrypted Proof of Ownership
            </span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
            Thank you for choosing the future. No refunds in the wasteland.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
