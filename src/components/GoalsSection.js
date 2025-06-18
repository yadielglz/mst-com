import React from 'react';
import { Target, Edit } from 'lucide-react';

const GoalsSection = ({ goals, progress, onEditGoals }) => {
  const renderGoalProgress = (period, periodGoals, periodProgress) => (
    <div key={period}>
      <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <Target className="w-5 h-5 text-att-blue" />
        {period}
      </h4>
      <div className="space-y-3">
        {['Mobile', 'Internet', 'TV'].map(category => {
          const target = periodGoals[category.toLowerCase()] || 0;
          const current = periodProgress[category];
          const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
          const label = category === 'Mobile' ? 'Lines' : 'Services';
          
          return (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{category} {label}</span>
                <span>{current} / {target}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Performance Goals
        </h3>
        <button
          onClick={onEditGoals}
          className="text-att-blue hover:text-blue-800 dark:text-att-blue-light dark:hover:text-white"
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderGoalProgress('This Week', goals.weekly, progress.weeklyProgress)}
        {renderGoalProgress('This Month', goals.monthly, progress.monthlyProgress)}
      </div>
    </div>
  );
};

export default GoalsSection; 