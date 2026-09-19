import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Edit3, 
  Trash2, 
  Calendar, 
  Tag 
} from 'lucide-react';

const ListView = ({ tasks, onUpdateStatus, onEditTask, onDeleteTask }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'low':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">In Progress</span>;
      case 'to_do':
      default:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">To Do</span>;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-400">
        <p className="text-sm font-medium">No tasks found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-700/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4">Task Details</th>
              <th className="py-3 px-4 w-32">Priority</th>
              <th className="py-3 px-4 w-32">Category</th>
              <th className="py-3 px-4 w-36">Due Date</th>
              <th className="py-3 px-4 w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40 text-xs text-slate-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-800/80 transition-colors group">
                
                {/* Status Toggle Checkbox */}
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onUpdateStatus(
                      task.id, 
                      task.status === 'completed' ? 'to_do' : 'completed'
                    )}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </td>

                {/* Title & Description */}
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {task.title}
                    </span>
                    {getStatusBadge(task.status)}
                  </div>
                  {task.description && (
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3 px-4">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  {task.category && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/50">
                      <Tag className="w-2.5 h-2.5 text-indigo-400" />
                      {task.category}
                    </span>
                  )}
                </td>

                {/* Due Date */}
                <td className="py-3 px-4 text-slate-400">
                  {task.due_date ? (
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEditTask(task)}
                      title="Edit Task"
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete Task"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
