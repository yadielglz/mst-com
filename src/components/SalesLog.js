import React from 'react';
import { format } from 'date-fns';
import { Plus, Search, Trash2, Smartphone, Wifi, Tv, BarChart3 } from 'lucide-react';

const SalesLog = ({ 
  sales, 
  onAddSale, 
  onDeleteSale, 
  filterProduct, 
  sortSales, 
  onFilterChange, 
  onSortChange 
}) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      case 'Internet': return <Wifi className="w-4 h-4" />;
      case 'DirecTV': return <Tv className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Mobile': return 'bg-blue-100 dark:bg-blue-900/50';
      case 'Internet': return 'bg-green-100 dark:bg-green-900/50';
      case 'DirecTV': return 'bg-purple-100 dark:bg-purple-900/50';
      default: return 'bg-slate-100 dark:bg-slate-700';
    }
  };

  return (
    <div className="card p-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Sales Log
        </h3>
        <div className="flex items-center space-x-2 mt-3 md:mt-0">
          <select
            value={filterProduct}
            onChange={(e) => onFilterChange(e.target.value)}
            className="form-input !py-1.5 !text-sm"
          >
            <option value="all">All</option>
            <option value="Mobile">Mobile</option>
            <option value="Internet">Internet</option>
            <option value="DirecTV">TV</option>
          </select>
          <select
            value={sortSales}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-input !py-1.5 !text-sm"
          >
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="commission_desc">High Comm.</option>
            <option value="commission_asc">Low Comm.</option>
          </select>
        </div>
      </div>
      
      {sales.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="font-semibold">No sales logged yet.</p>
          <p className="text-sm">Click "Log New Sale" to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {sales.map((sale) => {
            const mainCategory = sale.services[0]?.category || 'Misc';
            const color = getCategoryColor(mainCategory);
            
            return (
              <div
                key={sale.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-full ${color}`}>
                    {getCategoryIcon(mainCategory)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {sale.customerName}
                    </p>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {sale.services.map((service, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {service.planName}
                          {service.lines ? `(${service.lines} lines)` : ''}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {format(new Date(sale.saleDate), 'MMM dd, yyyy')}
                    </p>
                    {sale.notes && (
                      <p className="text-xs text-slate-400 mt-1 italic">
                        Note: {sale.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 md:mt-0 w-full md:w-auto">
                  <span className="font-semibold text-emerald-600 text-lg">
                    ${sale.totalCommission.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDeleteSale(sale.id)}
                    className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete sale"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SalesLog; 