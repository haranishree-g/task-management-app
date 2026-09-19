import React from 'react';
import { 
  Clock, 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Tag,
  ArrowRight
} from 'lucide-react';

const KanbanBoard = ({ tasks, onUpdateStatus, onEditTask, onDeleteTask }) => {
  const columns = [
    { id: 'to_do', title: 'To Do', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
    { id: 'in_progress', title: 'In Progress', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' }
  ];

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

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateStatus(Number(taskId), targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(column => {
        const columnTasks = tasks.filter(task => task.status === column.id);

        return (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col min-h-[500px] transition-all"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${column.color}`}>
                  {column.title}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Task Cards Stack */}
            <div className="flex-1 space-y-3">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs text-center p-4">
                  <span>No tasks in {column.title.toLowerCase()}</span>
                  <span className="text-[10px] text-slate-600 mt-1">Drag task here to update status</span>
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="group bg-slate-800 border border-slate-700/70 hover:border-slate-600 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                  >
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.category && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                          <Tag className="w-2.5 h-2.5" />
                          {task.category}
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <h3 className={`font-semibold text-sm text-slate-100 mb-1 group-hover:text-indigo-300 transition-colors ${
                      task.status === 'completed' ? 'line-through text-slate-400' : ''
                    }`}>
                      {task.title}
                    </h3>

                    {/* Description preview */}
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 font-normal">
                        {task.description}
                      </p>
                    )}

                    {/* Due Date & Action Footer */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-700/40 text-xs">
                      {task.due_date ? (
                        <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500">No due date</div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        {/* Quick Toggle Status */}
                        {task.status !== 'completed' ? (
                          <button
                            onClick={() => onUpdateStatus(task.id, 'completed')}
                            title="Mark as Completed"
                            className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateStatus(task.id, 'to_do')}
                            title="Move back to To Do"
                            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors"
                          >
                            <Circle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onEditTask(task)}
                          title="Edit Task"
                          className="p-1 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete Task"
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
