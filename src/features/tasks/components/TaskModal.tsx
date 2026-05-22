import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Task, Subtask } from '../types';
import { useTasks } from '../context/TaskContext';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: any) => void;
    taskToEdit?: Task | null;
    defaultDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, defaultDate }) => {
    const { categories } = useTasks();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'High' | 'Moderate' | 'Low'>('Moderate');
    const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Not Started'>('Not Started');
    const [categoryId, setCategoryId] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [newSubtaskName, setNewSubtaskName] = useState('');

    useEffect(() => {
        if (categories.length > 0 && !categoryId && !taskToEdit) {
            setCategoryId(categories[0].id);
        }
    }, [categories, categoryId, taskToEdit]);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.priority || 'Moderate');
            setStatus(taskToEdit.status || 'Not Started');
            setCategoryId(taskToEdit.category?.id || categories[0]?.id || '');
            setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
            setSubtasks(taskToEdit.subtasks || []);
        } else {
            setTitle('');
            setDescription('');
            setPriority('Moderate');
            setStatus('Not Started');
            setCategoryId(categories.length > 0 ? categories[0].id : '');
            setDueDate(defaultDate || '');
            setSubtasks([]);
        }
        setNewSubtaskName('');
    }, [taskToEdit, isOpen, categories, defaultDate]);

    if (!isOpen) return null;

    const handleAddSubtask = () => {
        if (newSubtaskName.trim()) {
            setSubtasks([...subtasks, { name: newSubtaskName.trim(), completed: false }]);
            setNewSubtaskName('');
        }
    };

    const handleRemoveSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    const handleToggleSubtask = (index: number) => {
        const updated = [...subtasks];
        updated[index].completed = !updated[index].completed;
        setSubtasks(updated);

        // Auto-complete status if all subtasks are finished
        const allCompleted = updated.length > 0 && updated.every(s => s.completed);
        if (allCompleted) {
            setStatus('Completed');
        } else if (!allCompleted && status === 'Completed') {
            setStatus('In Progress');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...(taskToEdit ? { id: taskToEdit.id, createdOn: taskToEdit.createdOn } : {}),
            title,
            description,
            priority,
            status,
            dueDate: dueDate || undefined,
            categoryId,
            subtasks
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
                <div className="bg-primary px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-xl font-bold">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Task Title</label>
                            <input
                                required
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-dark bg-gray-50"
                                placeholder="e.g., Important project meeting"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-dark bg-gray-50 h-24 resize-none"
                                placeholder="Provide more details about this task..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as any)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-dark bg-gray-50"
                                >
                                    <option value="High">High</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-dark bg-gray-50"
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-dark bg-gray-50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-dark bg-gray-50"
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Subtasks Section */}
                        <div className="space-y-2 pt-2 border-t mt-4">
                            <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Subtasks</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSubtaskName}
                                    onChange={(e) => setNewSubtaskName(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-dark bg-gray-50"
                                    placeholder="Add new subtask"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSubtask();
                                        }
                                    }}
                                />
                                <button type="button" onClick={handleAddSubtask} className="bg-primary text-white p-2 rounded-lg hover:bg-opacity-90">
                                    <Plus size={20} />
                                </button>
                            </div>
                            
                            <div className="space-y-2 mt-2">
                                {subtasks.map((sub, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <input 
                                            type="checkbox" 
                                            checked={sub.completed}
                                            onChange={() => handleToggleSubtask(idx)}
                                            className="w-4 h-4 text-primary rounded"
                                        />
                                        <span className={`flex-1 text-sm ${sub.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                            {sub.name}
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveSubtask(idx)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="task-form"
                        className="px-6 py-2.5 rounded-xl font-medium bg-secondary text-white hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
                    >
                        Save Task
                    </button>
                </div>
            </div>
        </div>
    );
};
