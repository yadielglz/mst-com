import React from 'react';
import { Plus, ExternalLink, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

export const MobileDashboard = ({ metrics, onOpenSaleModal }) => (
  <div className="md:hidden mb-4">
    <div className="grid grid-cols-2 gap-4 mb-4">
      <a
        href="https://mst.att.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-800 text-att-blue dark:text-att-blue-light font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <ExternalLink className="w-5 h-5" />
        Open MST
      </a>
      <button
        onClick={onOpenSaleModal}
        className="flex items-center justify-center gap-2 w-full bg-att-blue text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-blue-800 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Log New Sale
      </button>
    </div>
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
        <h3 className="text-xs text-att-gray dark:text-slate-400">Sales</h3>
        <p className="font-bold text-lg text-att-blue">{metrics.totalSales}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
        <h3 className="text-xs text-att-gray dark:text-slate-400">Commission</h3>
        <p className="font-bold text-lg text-emerald-600">${metrics.totalCommission.toFixed(0)}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
        <h3 className="text-xs text-att-gray dark:text-slate-400">Avg Comm.</h3>
        <p className="font-bold text-lg text-amber-600">${metrics.avgCommission.toFixed(0)}</p>
      </div>
    </div>
  </div>
);

export const DesktopDashboard = ({ metrics, onOpenSaleModal }) => (
  <div className="hidden md:block mb-6">
    <div className="flex justify-end items-center gap-4 mb-4">
      <a
        href="https://mst.att.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm bg-white dark:bg-slate-700 text-att-blue dark:text-att-blue-light font-semibold py-2 px-3 rounded-lg shadow-sm border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Open MST
      </a>
      <button
        onClick={onOpenSaleModal}
        className="flex items-center justify-center gap-2 text-sm bg-att-blue text-white font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-blue-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Log New Sale
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-att-blue" />
          <div>
            <h2 className="text-att-gray dark:text-slate-400 text-sm font-medium">Total Sales</h2>
            <p className="text-3xl font-bold text-att-blue">{metrics.totalSales}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-emerald-600" />
          <div>
            <h2 className="text-att-gray dark:text-slate-400 text-sm font-medium">Total Commission</h2>
            <p className="text-3xl font-bold text-emerald-600">${metrics.totalCommission.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-amber-600" />
          <div>
            <h2 className="text-att-gray dark:text-slate-400 text-sm font-medium">Average Commission</h2>
            <p className="text-3xl font-bold text-amber-600">${metrics.avgCommission.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
); 