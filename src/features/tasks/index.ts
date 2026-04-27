// Tasks feature - public API (barrel export)
export { TaskProvider, TaskContext, useTasks } from './context/TaskContext';
export { TaskCard } from './components/TaskCard';
export { TaskModal } from './components/TaskModal';
export { default as Dashboard } from './pages/Dashboard';
export { default as MyTasks } from './pages/MyTasks';
export { default as TaskCategories } from './pages/TaskCategories';
export type { Task, Category } from './types';
