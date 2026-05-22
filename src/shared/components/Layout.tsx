import React, { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTasks } from '../../features/tasks/context/TaskContext';
import { LayoutDashboard, CheckSquare, List, Settings, LogOut, Search, Bell, Calendar } from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom';
import { CalendarModal } from './CalendarModal';
import { TaskModal } from '../../features/tasks/components/TaskModal';
import type { Task } from '../../features/tasks/types';

export const Layout: React.FC = () => {
    const { logout } = useAuth();
    const { searchQuery, setSearchQuery, addTask, updateTask } = useTasks();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [defaultDate, setDefaultDate] = useState<string>('');

    const handleSaveTask = (taskData: any) => {
        if (taskToEdit) {
            updateTask(taskData as Task);
        } else {
            addTask(taskData);
        }
    };

    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setDefaultDate('');
        setIsTaskModalOpen(true);
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${
            isActive
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/5 text-white/90'
        }`;

    return (
        <div className="min-h-screen flex bg-light font-sans text-dark">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-primary text-white flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="h-20 flex items-center px-8 bg-white text-dark">
                        <h1 className="text-2xl font-black">
                            <span className="text-secondary">Dash</span>board
                        </h1>
                    </div>
                    <nav className="mt-8 space-y-2 px-4">
                        <NavLink to="/dashboard" className={navLinkClass}>
                            <LayoutDashboard size={20} /> Dashboard
                        </NavLink>
                        <NavLink to="/my-tasks" className={navLinkClass}>
                            <CheckSquare size={20} /> My Task
                        </NavLink>
                        <NavLink to="/task-categories" className={navLinkClass}>
                            <List size={20} /> Task Categories
                        </NavLink>
                        <NavLink to="/settings" className={navLinkClass}>
                            <Settings size={20} /> Settings
                        </NavLink>
                    </nav>
                </div>

                <div className="p-4 mb-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-4 py-3 w-full hover:bg-white/5 rounded-xl transition-colors text-white/90"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top View / Header */}
                <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 w-full sticky top-0 md:bg-transparent md:shadow-none pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-4 w-full max-w-2xl bg-white rounded-xl shadow-sm px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your task here..."
                            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
                        />
                        <button className="bg-secondary text-white p-2 rounded-lg hover:bg-red-600 transition-colors">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="pointer-events-auto hidden md:flex items-center gap-6">
                        <button className="bg-secondary/10 text-secondary p-2.5 rounded-xl hover:bg-secondary/20 transition-colors">
                            <Bell size={20} />
                        </button>
                        <button 
                            onClick={() => setIsCalendarOpen(true)}
                            className="bg-secondary/10 text-secondary p-2.5 rounded-xl hover:bg-secondary/20 transition-colors cursor-pointer"
                        >
                            <Calendar size={20} />
                        </button>
                        <div className="text-right ml-4 border-l border-gray-200 pl-6">
                            <p className="text-sm font-semibold text-dark leading-snug">
                                {new Date().toLocaleDateString('en-GB', { weekday: 'long' })}
                            </p>
                            <p className="text-xs font-semibold text-blue-400">
                                {new Date().toLocaleDateString('en-GB')}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>

            <CalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onEditTask={handleEditTask}
            />

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleSaveTask}
                taskToEdit={taskToEdit}
                defaultDate={defaultDate}
            />
        </div>
    );
};
