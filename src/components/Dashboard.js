import React from 'react';
import { Plus, ExternalLink, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

export const MobileDashboard = ({ metrics, onOpenSaleModal }) => (
  <div className="md:hidden mb-4">
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
        <h3 className="text-xs text-slate-500 dark:text-slate-400">Quotes</h3>
        <p className="font-bold text-lg text-att-blue">{metrics.totalQuotes}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
        <h3 className="text-xs text-slate-500 dark:text-slate-400">Monthly</h3>
        <p className="font-bold text-lg text-emerald-600">${metrics.totalMonthlyRevenue.toFixed(0)}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
        <h3 className="text-xs text-slate-500 dark:text-slate-400">One-Time</h3>
        <p className="font-bold text-lg text-amber-600">${metrics.totalOneTimeRevenue.toFixed(0)}</p>
      </div>
    </div>
  </div>
);

export const DesktopDashboard = ({ metrics, onOpenSaleModal }) => (
  <div className="hidden md:block mb-6">
    <div className="flex justify-end items-center gap-4 mb-4">
      <a
        href="https://mst.t-mobile.com"
        target="_blank"
        rel="noopener noreferrer"
        className="btn bg-white border border-slate-300 dark:border-slate-700 text-att-blue hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Open MST
      </a>
      <button
        onClick={onOpenSaleModal}
        className="btn btn-primary"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create New Quote
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card flex items-center gap-4 p-5">
        <div className="bg-att-blue/10 p-3 rounded-full">
          <BarChart3 className="w-6 h-6 text-att-blue" />
        </div>
        <div>
          <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Quotes</h2>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.totalQuotes}</p>
        </div>
      </div>
      <div className="card flex items-center gap-4 p-5">
        <div className="bg-emerald-500/10 p-3 rounded-full">
          <DollarSign className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Revenue</h2>
          <p className="text-2xl font-bold text-emerald-600">${metrics.totalMonthlyRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="card flex items-center gap-4 p-5">
        <div className="bg-amber-500/10 p-3 rounded-full">
          <TrendingUp className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium">One-Time Revenue</h2>
          <p className="text-2xl font-bold text-amber-600">${metrics.totalOneTimeRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  </div>
); 