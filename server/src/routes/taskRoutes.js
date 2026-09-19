import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, getTaskStats } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/stats', getTaskStats);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
