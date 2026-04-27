import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Folder, ListPlus, X, Check, Loader2 } from 'lucide-react';

const TaskCategories: React.FC = () => {
    const { categories, tasks, addCategory } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        
        setIsSaving(true);
        await addCategory(newCategoryName.trim());
        setNewCategoryName('');
        setIsSaving(false);
        setIsModalOpen(false);
    };

    const getTaskCountForCategory = (categoryId: string) => {
        return tasks.filter(t => t.category?.id === categoryId).length;
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-dark flex items-center gap-3">
                        <span className="text-2xl">🗂️</span> Task Categories
                    </h1>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-primary hover:bg-teal-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                    <ListPlus size={18} /> New Category
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const taskCount = getTaskCountForCategory(category.id);
                        return (
                            <div 
                                key={category.id} 
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:border-primary/30 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Folder size={24} />
                                    </div>
                                    <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold border border-gray-100">
                                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-dark mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-400">
                                    Organize and manage your tasks under {category.name.toLowerCase()}.
                                </p>
                            </div>
                        );
                    })}
                    
                    {categories.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                            <Folder size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-dark mb-1">No categories found</p>
                            <p className="text-sm">Categories help you organize your tasks better.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                                <ListPlus size={20} className="text-primary" /> Add New Category
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddCategory} className="p-6">
                            <label className="block text-sm font-semibold text-dark mb-1.5">
                                Category Name
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="e.g. Health, Groceries, Fitness"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm mb-6"
                            />
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-dark rounded-xl font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newCategoryName.trim() || isSaving}
                                    className="px-5 py-2.5 bg-primary hover:bg-teal-600 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCategories;
