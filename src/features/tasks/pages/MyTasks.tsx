import React, { useState } from 'react';
import { TaskCard } from '../components/TaskCard';
import type { Task } from '../types';
import { TaskModal } from '../components/TaskModal';
import { useTasks } from '../context/TaskContext';
import { Plus, Filter } from 'lucide-react';

const MyTasks: React.FC = () => {
    const { tasks, categories, addTask, updateTask, searchQuery, categoryFilter, setCategoryFilter } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const handleSaveTask = (taskData: any) => {
        if (taskToEdit) {
            updateTask(taskData as Task);
        } else {
            addTask(taskData);
        }
    };

    const openCreateModal = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    // Searching and Filtering Logic
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || task.category?.id === categoryFilter || task.category?.name === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const todoTasks = filteredTasks.filter(t => t.status === 'Not Started');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress');
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-dark flex items-center gap-3">
                        <span className="text-2xl">📝</span> My Tasks
                    </h1>
                    
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 text-sm ml-4 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <select
                            className="bg-transparent border-none outline-none font-medium text-gray-600 cursor-pointer"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as any)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={openCreateModal}
                    className="px-5 py-2.5 bg-primary hover:bg-teal-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                    <Plus size={18} /> Create New Task
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* To Do Column */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full overflow-y-auto">
                    <h2 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4 sticky top-0 bg-white z-10 pb-2">
                        <span className="w-3 h-3 rounded-full bg-secondary"></span> Not Started ({todoTasks.length})
                    </h2>
                    <div className="space-y-4">
                        {todoTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                                No tasks in this status
                            </div>
                        ) : (
                            todoTasks.map(task => (
                                <TaskCard key={task.id} task={task} onClickMenu={() => { setTaskToEdit(task); setIsModalOpen(true); }} />
                            ))
                        )}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full overflow-y-auto">
                    <h2 className="text-lg font-bold text-blue-500 flex items-center gap-2 mb-4 sticky top-0 bg-white z-10 pb-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> In Progress ({inProgressTasks.length})
                    </h2>
                    <div className="space-y-4">
                        {inProgressTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                                No tasks in this status
                            </div>
                        ) : (
                            inProgressTasks.map(task => (
                                <TaskCard key={task.id} task={task} onClickMenu={() => { setTaskToEdit(task); setIsModalOpen(true); }} />
                            ))
                        )}
                    </div>
                </div>

                {/* Completed Column */}
                <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200 flex flex-col h-full overflow-y-auto">
                    <h2 className="text-lg font-bold text-green-500 flex items-center gap-2 mb-4 sticky top-0 bg-gray-50/80 z-10 pb-2 backdrop-blur-sm">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span> Completed ({completedTasks.length})
                    </h2>
                    <div className="space-y-4 opacity-80">
                        {completedTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                                No tasks in this status
                            </div>
                        ) : (
                            completedTasks.map(task => (
                                <TaskCard key={task.id} task={task} onClickMenu={() => { setTaskToEdit(task); setIsModalOpen(true); }} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                taskToEdit={taskToEdit}
            />
        </div>
    );
};

export default MyTasks;
