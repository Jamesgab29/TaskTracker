import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, Calendar } from 'lucide-react';
import type { Task } from '../../features/tasks/types';
import { useTasks } from '../../features/tasks/context/TaskContext';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditTask: (task: Task) => void;
    onAddTaskForDate: (date: Date) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
    isOpen,
    onClose,
    onEditTask,
    onAddTaskForDate,
}) => {
    const { tasks, deleteTask } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    if (!isOpen) return null;

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Generate days of the month grid (42 days to cover 6 weeks)
    const getDaysInMonth = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0: Sun, 1: Mon, etc.
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

        const days = [];

        // Previous month's trailing days
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(currentYear, currentMonth - 1, prevMonthTotalDays - i),
                isCurrentMonth: false,
            });
        }

        // Current month's days
        for (let i = 1; i <= totalDays; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                isCurrentMonth: true,
            });
        }

        // Next month's leading days to make a grid of 42
        const remainingSlots = 42 - days.length;
        for (let i = 1; i <= remainingSlots; i++) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, i),
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const days = getDaysInMonth();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Helper to format Date to match database date strings
    const getTasksForDate = (date: Date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return (
                taskDate.getFullYear() === date.getFullYear() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getDate() === date.getDate()
            );
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (date: Date) => {
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const selectedTasks = getTasksForDate(selectedDate);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-55 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:h-[650px] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Left Side: Calendar Grid */}
                <div className="flex-1 p-6 flex flex-col border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-primary w-6 h-6" />
                            <h2 className="text-xl font-extrabold text-dark tracking-tight">
                                {monthNames[currentMonth]} {currentYear}
                            </h2>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-dark border border-gray-200 shadow-sm"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentDate(new Date());
                                    setSelectedDate(new Date());
                                }}
                                className="px-3 py-1.5 text-xs font-semibold hover:bg-gray-100 rounded-xl transition-all text-gray-600 border border-gray-200 shadow-sm"
                            >
                                Today
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-dark border border-gray-200 shadow-sm"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Weekdays Header */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {weekDays.map(day => (
                            <span key={day} className="text-xs font-bold uppercase tracking-wider text-gray-400 py-1">
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-1 flex-1">
                        {days.map((day, idx) => {
                            const dayTasks = getTasksForDate(day.date);
                            const hasTasks = dayTasks.length > 0;
                            const today = isToday(day.date);
                            const selected = isSelected(day.date);

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`relative flex flex-col justify-between items-center p-2 rounded-2xl h-12 md:h-16 transition-all group ${
                                        day.isCurrentMonth ? 'text-dark' : 'text-gray-300'
                                    } ${
                                        selected 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-95' 
                                            : today
                                                ? 'bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20'
                                                : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <span className={`text-sm md:text-base font-bold ${today && !selected ? 'text-secondary' : ''}`}>
                                        {day.date.getDate()}
                                    </span>

                                    {/* Task Dots */}
                                    <div className="flex justify-center gap-1 mt-1 w-full h-1.5">
                                        {hasTasks && dayTasks.slice(0, 3).map((task, taskIdx) => {
                                            let dotColor = 'bg-blue-400'; // Moderate default
                                            if (task.status === 'Completed') {
                                                dotColor = 'bg-green-400';
                                            } else if (task.priority === 'High') {
                                                dotColor = 'bg-secondary';
                                            } else if (task.priority === 'Low') {
                                                dotColor = 'bg-teal-400';
                                            }

                                            return (
                                                <span
                                                    key={taskIdx}
                                                    className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : dotColor} transition-all`}
                                                />
                                            );
                                        })}
                                        {dayTasks.length > 3 && (
                                            <span className={`text-[8px] leading-[6px] font-bold ${selected ? 'text-white' : 'text-gray-400'}`}>
                                                +
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Tasks List for Selected Day */}
                <div className="w-full md:w-80 bg-gray-50/50 p-6 flex flex-col h-full overflow-hidden shrink-0">
                    <div className="flex justify-between items-start mb-6 shrink-0">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {selectedDate.toLocaleDateString('en-GB', { weekday: 'long' })}
                            </p>
                            <h3 className="text-lg font-extrabold text-dark leading-snug">
                                {selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1.5 hover:bg-gray-200/50 rounded-xl transition-all text-gray-400 hover:text-dark md:hidden"
                        >
                            <X size={20} />
                        </button>
                        <button 
                            onClick={onClose} 
                            className="p-1.5 hover:bg-gray-200/50 rounded-xl transition-all text-gray-400 hover:text-dark hidden md:block"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Add task button for this specific day */}
                    <button
                        onClick={() => onAddTaskForDate(selectedDate)}
                        className="w-full mb-4 py-2.5 px-4 bg-primary hover:bg-teal-600 text-white rounded-2xl font-semibold text-xs tracking-wide transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                        <Plus size={14} /> Add Task for Today
                    </button>

                    {/* Task list container */}
                    <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1">
                        {selectedTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <span className="text-3xl mb-2 opacity-60">🏖️</span>
                                <p className="text-sm font-semibold text-gray-500">No tasks due today</p>
                                <p className="text-xs text-gray-400 mt-1">Enjoy your day or schedule a new task above!</p>
                            </div>
                        ) : (
                            selectedTasks.map(task => {
                                const priorityColors = {
                                    High: 'text-secondary bg-secondary/10',
                                    Moderate: 'text-blue-500 bg-blue-50',
                                    Low: 'text-teal-500 bg-teal-50',
                                };

                                return (
                                    <div 
                                        key={task.id} 
                                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-primary transition-colors">
                                                {task.title}
                                            </h4>
                                            <span className={`text-[10px] px-2 py-0.5 font-bold rounded-lg ${priorityColors[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-400 line-clamp-2">
                                            {task.description || 'No description provided.'}
                                        </p>

                                        <div className="flex justify-between items-center mt-1 border-t border-gray-50 pt-2 shrink-0">
                                            <span className="text-[10px] font-semibold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-lg">
                                                {task.category?.name || 'Uncategorized'}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => onEditTask(task)}
                                                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors"
                                                    title="Edit Task"
                                                >
                                                    <Edit3 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => task.id && deleteTask(task.id)}
                                                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-secondary transition-colors"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
