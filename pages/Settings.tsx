import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Store,
  ShieldAlert,
  Moon,
  Sun,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { Card, Button, Input, Select, Badge } from "../components/UI";

const Settings: React.FC = () => {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    storeName: state.settings.storeName,
    address: state.settings.address,
    currency: state.settings.currency,
    taxRate: state.settings.taxRate,
    theme: state.settings.theme,
  });
  const [saved, setSaved] = useState(false);

  // Sync theme immediately for real-time preview
  useEffect(() => {
    if (formData.theme !== state.settings.theme) {
      dispatch({ type: "UPDATE_SETTINGS", payload: { theme: formData.theme } });
    }
  }, [formData.theme, state.settings.theme, dispatch]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_SETTINGS", payload: formData });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "CRITICAL ACTION: This will purge all transaction data and reset to factory defaults. Proceed?"
      )
    ) {
      dispatch({ type: "RESET_DATA" });
      window.location.reload();
    }
  };

  const isDark = state.settings.theme === "dark";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2
              className={`text-xl font-orbitron font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              System Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Calibrate store identity and fiscal rules
            </p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={18} />
            GRID UPDATED
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <Card title="Identity Grid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Input
                label="Store Alias"
                icon={<Store size={16} />}
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                placeholder="Sujit Electronics"
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  Physical Grid Location
                </label>
                <textarea
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all h-24 resize-none ${
                    isDark
                      ? "bg-slate-900/60 border-slate-800 text-slate-200"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>
            <div
              className={`flex flex-col items-center justify-center border-l hidden md:flex ${
                isDark ? "border-slate-800/50" : "border-slate-100"
              }`}
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center font-bold text-white text-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-4">
                NC
              </div>
              <p className="text-xs text-slate-500 font-orbitron uppercase tracking-widest">
                SYSTEM EMBLEM
              </p>
              <Button variant="ghost" size="sm" className="mt-4">
                Update Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Financial Section
        <Card title="Fiscal Protocols">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select 
              label="Primary Credit Currency" 
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
            >
              <option value="USD">USD - United States Credits</option>
              <option value="EUR">EUR - Euro Union Credits</option>
              <option value="JPY">JPY - Neo-Tokyo Yen</option>
              <option value="BTC">BTC - Digital Gold</option>
            </Select>
            <Input 
              label="Standard Grip Tax (%)" 
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})}
            />
          </div>
        </Card>
         */}

        {/* UI Section */}
        <Card title="Interface Calibration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Theme Protocol
              </label>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, theme: "dark" })}
                className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                  formData.theme === "dark"
                    ? "bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : isDark
                    ? "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon
                    className={
                      formData.theme === "dark"
                        ? "text-cyan-400"
                        : "text-slate-500"
                    }
                    size={20}
                  />
                  <div className="text-left">
                    <p
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      Neon Night
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                      Recommended for eye preservation
                    </p>
                  </div>
                </div>
                {formData.theme === "dark" && (
                  <Badge variant="success">Active</Badge>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, theme: "light" })}
                className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                  formData.theme === "light"
                    ? "bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : isDark
                    ? "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun
                    className={
                      formData.theme === "light"
                        ? "text-cyan-500"
                        : "text-slate-500"
                    }
                    size={20}
                  />
                  <div className="text-left">
                    <p
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      Silicon Day
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                      High contrast daylight mode
                    </p>
                  </div>
                </div>
                {formData.theme === "light" && (
                  <Badge variant="success">Active</Badge>
                )}
              </button>
            </div>

            <div
              className={`p-5 border rounded-xl space-y-4 ${
                isDark
                  ? "bg-rose-500/5 border-rose-500/20"
                  : "bg-rose-50 border-rose-100"
              }`}
            >
              <div className="flex items-center gap-3 text-rose-500">
                <ShieldAlert size={20} />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Danger Zone
                </p>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Resetting the data matrix will delete all sales, purchases, and
                custom stock changes. This action cannot be intercepted once
                initiated.
              </p>
              <Button
                type="button"
                variant="danger"
                className="w-full text-xs font-bold uppercase tracking-widest"
                onClick={handleReset}
              >
                <Trash2 size={16} /> Factory Data Reset
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto font-orbitron uppercase tracking-widest"
          >
            <Save size={18} /> Commit Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
