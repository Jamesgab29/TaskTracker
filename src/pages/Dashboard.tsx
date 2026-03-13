import React, { useState } from 'react';
import { TaskCard } from '../components/TaskCard';
import type { Task } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { useTasks } from '../context/TaskContext';

import { Plus, Filter } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { tasks, addTask, updateTask, searchQuery, categoryFilter, setCategoryFilter } = useTasks();
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
        const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const todoTasks = filteredTasks.filter(t => t.status !== 'Completed');
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

    const calcPercentage = (status: Task['status']) => {
        if (tasks.length === 0) return 0;
        return Math.round((tasks.filter(t => t.status === status).length / tasks.length) * 100);
    };

    const pCompleted = calcPercentage('Completed');
    const pInProgress = calcPercentage('In Progress');
    const pNotStarted = calcPercentage('Not Started');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full relative">
            {/* Left Column: To-Do Tasks */}
            <div className="lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                            <span className="text-gray-400">📋</span> To-Do
                        </h2>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 text-sm ml-4 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                            <Filter size={14} className="text-gray-400" />
                            <select
                                className="bg-transparent border-none outline-none font-medium text-gray-600 cursor-pointer"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value as any)}
                            >
                                <option value="All">All Categories</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="text-secondary font-medium flex items-center gap-1 hover:text-red-600 transition-colors shrink-0"
                    >
                        <Plus size={18} /> Add task
                    </button>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium mb-4 text-dark">
                    <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</span>
                    <span className="text-gray-400">· Today</span>
                </div>

                <div className="space-y-4 pb-12">
                    {todoTasks.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                            No active tasks found matching criteria.
                        </div>
                    ) : (
                        todoTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClickMenu={() => { setTaskToEdit(task); setIsModalOpen(true); }}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-secondary flex items-center gap-2 mb-6">
                        <span className="text-gray-400">📋</span> Task Status
                    </h2>

                    <div className="flex justify-between items-center px-2">
                        {[{ p: pCompleted, color: '#22c55e', label: 'Completed', bg: 'bg-green-500' },
                        { p: pInProgress, color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-500' },
                        { p: pNotStarted, color: '#ef4444', label: 'Not Started', bg: 'bg-secondary' }
                        ].map(({ p, color, label, bg }) => (
                            <div className="text-center" key={label}>
                                <div className="relative w-20 h-20 mb-2">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                                        <circle cx="40" cy="40" r="36" fill="transparent" stroke={color} strokeWidth="8" strokeDasharray="226" strokeDashoffset={226 - (226 * p) / 100} className="transition-all duration-1000 ease-out" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">{p}%</div>
                                </div>
                                <div className="text-xs font-semibold flex items-center gap-1 justify-center">
                                    <span className={`w-2 h-2 rounded-full ${bg}`}></span> {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex-1">
                    <h2 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4">
                        <span className="text-gray-400">📥</span> Completed Task
                    </h2>
                    <div className="space-y-4">
                        {completedTasks.length === 0 ? (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                No completed tasks yet.
                            </div>
                        ) : (
                            completedTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClickMenu={() => { setTaskToEdit(task); setIsModalOpen(true); }}
                                />
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

export default Dashboard;
