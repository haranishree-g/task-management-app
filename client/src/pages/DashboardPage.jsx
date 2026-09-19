import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import Navbar from '../components/Navbar';
import StatsHeader from '../components/StatsHeader';
import FilterToolbar from '../components/FilterToolbar';
import KanbanBoard from '../components/KanbanBoard';
import ListView from '../components/ListView';
import TaskModal from '../components/TaskModal';
import { Sparkles, RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, in_progress: 0, to_do: 0, urgent: 0 });
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' | 'list'
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const { socket } = useSocket();

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'created_at'
  });

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data.stats || { total: 0, completed: 0, in_progress: 0, to_do: 0, urgent: 0 });
    } catch (err) {
      console.error('Error fetching task stats:', err);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchTasks(), fetchStats()]);
    setLoading(false);
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle Real-Time WebSockets Sync Events
  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (data) => {
      showToast(`Real-time: New task "${data.task.title}" added`);
      fetchTasks();
      fetchStats();
    };

    const handleTaskUpdated = (data) => {
      showToast(`Real-time: Task "${data.task.title}" updated`);
      fetchTasks();
      fetchStats();
    };

    const handleTaskDeleted = (data) => {
      showToast(`Real-time: Task removed`);
      fetchTasks();
      fetchStats();
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket, fetchTasks, fetchStats]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCreateOrUpdateTask = async (formData) => {
    try {
      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit.id}`, formData);
        showToast('Task updated successfully!');
      } else {
        await api.post('/tasks', formData);
        showToast('Task created successfully!');
      }
      setIsModalOpen(false);
      setTaskToEdit(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error saving task:', err);
      alert('Failed to save task.');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Optimistic state update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

      await api.put(`/tasks/${taskId}`, { ...task, status: newStatus });
      fetchStats();
    } catch (err) {
      console.error('Error updating task status:', err);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      showToast('Task deleted.');
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const seedSampleTasks = async () => {
    const samples = [
      { title: 'Design Landing Page UI', description: 'Create responsive mockups in Figma for modern dark mode layout.', status: 'to_do', priority: 'high', category: 'work', due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] },
      { title: 'Setup Express & SQLite REST API', description: 'Build user authentication and CRUD task routes with JWT.', status: 'completed', priority: 'high', category: 'work', due_date: new Date().toISOString().split('T')[0] },
      { title: 'Integrate WebSockets Live Sync', description: 'Connect Socket.io client to listen for real-time task broadcasts.', status: 'in_progress', priority: 'medium', category: 'work', due_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] },
      { title: 'Weekly Gym Workout Routine', description: 'Complete 45 min strength training and cardio session.', status: 'to_do', priority: 'low', category: 'personal', due_date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0] }
    ];

    for (const sample of samples) {
      await api.post('/tasks', sample);
    }
    fetchTasks();
    fetchStats();
    showToast('Sample tasks generated!');
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'created_at'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 pb-16">
      
      {/* Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCreateModal={() => { setTaskToEdit(null); setIsModalOpen(true); }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        
        {/* Real-time Toast Alert */}
        {toastMessage && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-600/90 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-between animate-slide-down">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              {toastMessage}
            </span>
          </div>
        )}

        {/* Analytics Header Cards */}
        <StatsHeader stats={stats} />

        {/* Filter & Search Toolbar */}
        <FilterToolbar
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
        />

        {/* Content Views */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
            <span className="text-sm font-medium">Loading task workspace...</span>
          </div>
        ) : tasks.length === 0 && filters.status === 'all' && !filters.search ? (
          /* Empty Workspace Welcome Screen */
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center mb-4 border border-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Your Workspace is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Get started by creating your first task or generate quick sample data to test out features!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
              >
                + Create First Task
              </button>
              <button
                onClick={seedSampleTasks}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                Generate Demo Tasks
              </button>
            </div>
          </div>
        ) : activeView === 'kanban' ? (
          <KanbanBoard
            tasks={tasks}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={(task) => { setTaskToEdit(task); setIsModalOpen(true); }}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <ListView
            tasks={tasks}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={(task) => { setTaskToEdit(task); setIsModalOpen(true); }}
            onDeleteTask={handleDeleteTask}
          />
        )}

      </main>

      {/* Task Modal Dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />

    </div>
  );
};

export default DashboardPage;
