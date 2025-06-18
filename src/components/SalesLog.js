import React from 'react';
import { format } from 'date-fns';
import { Plus, Search, Trash2, Smartphone, Wifi, Tv } from 'lucide-react';

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

  if (sales.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            Sales Log
          </h3>
          <div className="w-full md:w-auto mt-3 md:mt-0 md:ml-4 flex justify-end">
            <button
              onClick={onAddSale}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Open search"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4 mt-3 md:mt-0">
            <select
              value={filterProduct}
              onChange={(e) => onFilterChange(e.target.value)}
              className="form-input w-auto"
            >
              <option value="all">All</option>
              <option value="Mobile">Mobile</option>
              <option value="Internet">Internet</option>
              <option value="DirecTV">TV</option>
            </select>
            <select
              value={sortSales}
              onChange={(e) => onSortChange(e.target.value)}
              className="form-input w-auto"
            >
              <option value="date_desc">Newest</option>
              <option value="date_asc">Oldest</option>
              <option value="commission_desc">High Comm.</option>
              <option value="commission_asc">Low Comm.</option>
            </select>
          </div>
        </div>
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          <div className="w-12 h-12 mx-auto mb-2 text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              <path d="M10 9H8"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
            </svg>
          </div>
          <p>No sales logged yet.</p>
          <button
            onClick={onAddSale}
            className="mt-4 btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Your First Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Sales Log
        </h3>
        <div className="w-full md:w-auto mt-3 md:mt-0 md:ml-4 flex justify-end">
          <button
            onClick={onAddSale}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Open search"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="hidden md:flex items-center space-x-4 mt-3 md:mt-0">
          <select
            value={filterProduct}
            onChange={(e) => onFilterChange(e.target.value)}
            className="form-input w-auto"
          >
            <option value="all">All</option>
            <option value="Mobile">Mobile</option>
            <option value="Internet">Internet</option>
            <option value="DirecTV">TV</option>
          </select>
          <select
            value={sortSales}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-input w-auto"
          >
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="commission_desc">High Comm.</option>
            <option value="commission_asc">Low Comm.</option>
          </select>
        </div>
      </div>
      
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {sales.map((sale) => {
          const mainCategory = sale.services[0]?.category || 'Misc';
          const color = getCategoryColor(mainCategory);
          
          return (
            <div
              key={sale.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 fade-in"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-full ${color}`}>
                  {getCategoryIcon(mainCategory)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {sale.customerName}
                  </p>
                  <ul className="list-disc list-inside ml-4">
                    {sale.services.map((service, index) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {service.planName}
                        {service.lines ? ` (${service.lines} lines)` : ''}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
    </div>
  );
};

export default SalesLog; 