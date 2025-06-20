import React from 'react';
import { Target, Edit } from 'lucide-react';

const GoalsSection = ({ goals, progress, onEditGoals }) => {
  // Helper function to get the correct progress value
  const getProgressValue = (category, period) => {
    const progressKey = category === 'tv' ? 'TV' : category.charAt(0).toUpperCase() + category.slice(1);
    return progress?.[period]?.[progressKey] || 0;
  };

  // Helper function to get the display name
  const getDisplayName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Helper function to render goal items
  const renderGoalItems = (period, title) => {
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
          {title}
        </h4>
        {goals?.[period] && Object.entries(goals[period]).map(([category, goal]) => {
          const current = getProgressValue(category, period === 'weekly' ? 'weeklyProgress' : 'monthlyProgress');
          const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
          
          return (
            <div key={category} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {getDisplayName(category)}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {current}/{goal}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-att-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Goals
        </h3>
        <button
          onClick={onEditGoals}
          className="text-att-blue hover:text-blue-700 dark:hover:text-blue-300"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-6">
        {renderGoalItems('weekly', 'Weekly Goals')}
        <div className="border-t border-slate-200 dark:border-slate-700"></div>
        {renderGoalItems('monthly', 'Monthly Goals')}
      </div>
    </div>
  );
};

export default GoalsSection; 