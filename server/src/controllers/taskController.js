import { dbQuery, dbGet, dbRun } from '../db/database.js';
import { broadcastToUser } from '../sockets/socketHandler.js';

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, category, search, sortBy } = req.query;

    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (priority && priority !== 'all') {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    // Sorting
    switch (sortBy) {
      case 'due_date_asc':
        sql += ' ORDER BY CASE WHEN due_date IS NULL OR due_date = "" THEN 1 ELSE 0 END, due_date ASC';
        break;
      case 'due_date_desc':
        sql += ' ORDER BY CASE WHEN due_date IS NULL OR due_date = "" THEN 1 ELSE 0 END, due_date DESC';
        break;
      case 'priority':
        sql += " ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END";
        break;
      case 'title':
        sql += ' ORDER BY title ASC';
        break;
      case 'created_at':
      default:
        sql += ' ORDER BY created_at DESC';
        break;
    }

    const tasks = await dbQuery(sql, params);
    res.json({ tasks });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ message: 'Error fetching tasks.' });
  }
};

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description = '', status = 'to_do', priority = 'medium', category = 'work', due_date = null } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const validStatuses = ['to_do', 'in_progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];

    const finalStatus = validStatuses.includes(status) ? status : 'to_do';
    const finalPriority = validPriorities.includes(priority) ? priority : 'medium';

    const result = await dbRun(
      `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title.trim(), description.trim(), finalStatus, finalPriority, category.trim(), due_date || null]
    );

    const newTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [result.id]);

    // Broadcast real-time event to active user sockets
    broadcastToUser(userId, 'task:created', { task: newTask, actor: req.user.username });

    res.status(201).json({ task: newTask, message: 'Task created successfully.' });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Error creating task.' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existingTask = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    const {
      title = existingTask.title,
      description = existingTask.description,
      status = existingTask.status,
      priority = existingTask.priority,
      category = existingTask.category,
      due_date = existingTask.due_date
    } = req.body;

    const updatedTime = new Date().toISOString();

    await dbRun(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?, category = ?, due_date = ?, updated_at = ?
       WHERE id = ? AND user_id = ?`,
      [title.trim(), description.trim(), status, priority, category.trim(), due_date || null, updatedTime, id, userId]
    );

    const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);

    // Broadcast real-time event
    broadcastToUser(userId, 'task:updated', { task: updatedTask, actor: req.user.username });

    res.json({ task: updatedTask, message: 'Task updated successfully.' });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ message: 'Error updating task.' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existingTask = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    await dbRun('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    // Broadcast real-time event
    broadcastToUser(userId, 'task:deleted', { taskId: Number(id), actor: req.user.username });

    res.json({ message: 'Task deleted successfully.', taskId: Number(id) });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ message: 'Error deleting task.' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await dbGet(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'to_do' THEN 1 ELSE 0 END) as to_do,
        SUM(CASE WHEN priority = 'high' AND status != 'completed' THEN 1 ELSE 0 END) as urgent
       FROM tasks WHERE user_id = ?`,
      [userId]
    );

    res.json({
      stats: {
        total: stats.total || 0,
        completed: stats.completed || 0,
        in_progress: stats.in_progress || 0,
        to_do: stats.to_do || 0,
        urgent: stats.urgent || 0
      }
    });
  } catch (error) {
    console.error('Get Task Stats Error:', error);
    res.status(500).json({ message: 'Error calculating task statistics.' });
  }
};
