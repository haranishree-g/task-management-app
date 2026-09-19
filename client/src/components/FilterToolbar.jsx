import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const FilterToolbar = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all' || filters.sortBy !== 'created_at';

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm backdrop-blur-sm">
      
      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          name="search"
          placeholder="Search tasks by title or details..."
          value={filters.search}
          onChange={handleChange}
          className="w-full bg-slate-900/80 border border-slate-700/70 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Select Filters Group */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        
        {/* Status Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700/70 rounded-lg px-2.5 py-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-slate-200">All Statuses</option>
            <option value="to_do" className="bg-slate-900 text-slate-200">To Do</option>
            <option value="in_progress" className="bg-slate-900 text-slate-200">In Progress</option>
            <option value="completed" className="bg-slate-900 text-slate-200">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700/70 rounded-lg px-2.5 py-1 text-xs">
          <select
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-slate-200">All Priorities</option>
            <option value="high" className="bg-slate-900 text-slate-200">High Priority</option>
            <option value="medium" className="bg-slate-900 text-slate-200">Medium Priority</option>
            <option value="low" className="bg-slate-900 text-slate-200">Low Priority</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700/70 rounded-lg px-2.5 py-1 text-xs">
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-slate-200">All Categories</option>
            <option value="work" className="bg-slate-900 text-slate-200">Work</option>
            <option value="personal" className="bg-slate-900 text-slate-200">Personal</option>
            <option value="urgent" className="bg-slate-900 text-slate-200">Urgent</option>
            <option value="others" className="bg-slate-900 text-slate-200">Others</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700/70 rounded-lg px-2.5 py-1 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="created_at" className="bg-slate-900 text-slate-200">Newest First</option>
            <option value="due_date_asc" className="bg-slate-900 text-slate-200">Due Date (Earliest)</option>
            <option value="due_date_desc" className="bg-slate-900 text-slate-200">Due Date (Latest)</option>
            <option value="priority" className="bg-slate-900 text-slate-200">Priority (High to Low)</option>
            <option value="title" className="bg-slate-900 text-slate-200">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default FilterToolbar;
