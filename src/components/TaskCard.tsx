import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import type { Category } from '../context/TaskContext';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Moderate' | 'Low';
    status: 'Completed' | 'In Progress' | 'Not Started';
    category: Category;
    createdOn: string;
    completedOn?: string;
}

interface TaskCardProps {
    task: Task;
    onClickMenu?: () => void;
}

const statusColors = {
    'Completed': 'border-green-500 text-green-500',
    'In Progress': 'border-blue-500 text-blue-500',
    'Not Started': 'border-secondary text-secondary',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClickMenu }) => {
    const colorClass = statusColors[task.status];
    const { deleteTask } = useTasks();

    return (
        <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${colorClass} w-full transition-transform hover:-translate-y-1 hover:shadow-md mb-4`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 bg-white ${colorClass}`}></div>
                    <h3 className="font-bold text-dark text-lg leading-tight cursor-pointer hover:underline" onClick={onClickMenu}>{task.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClickMenu}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <Settings size={18} className="rotate-90" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete task"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-4 line-clamp-2 ml-7 cursor-pointer" onClick={onClickMenu}>
                {task.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium ml-7 cursor-pointer" onClick={onClickMenu}>
                <div className="flex gap-2">
                    <span className="text-gray-500">Priority:</span>
                    <span className="text-blue-400">{task.priority}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-purple-500">{task.category}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-500">Status:</span>
                    <span className={`${task.status === 'Not Started' ? 'text-secondary' : task.status === 'In Progress' ? 'text-blue-500' : 'text-green-500'}`}>
                        {task.status}
                    </span>
                </div>
                <div className="text-gray-400 ml-auto">
                    {task.status === 'Completed' && task.completedOn
                        ? `Completed ${task.completedOn}`
                        : `Created on: ${task.createdOn}`}
                </div>
            </div>
        </div>
    );
};
