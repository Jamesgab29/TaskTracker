import React, { createContext, useState, type ReactNode, useContext } from 'react';
import type { Task } from '../components/TaskCard';

export type Category = 'Work' | 'Personal' | 'Other';

interface TaskContextType {
    tasks: Task[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    categoryFilter: Category | 'All';
    setCategoryFilter: (c: Category | 'All') => void;
    addTask: (task: Omit<Task, 'id' | 'createdOn'>) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => void;
}

const mockInitialTasks: Task[] = [
    {
        id: '1',
        title: "Attend Nischal's Birthday Party",
        description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements).....",
        priority: "Moderate",
        status: "Not Started",
        category: 'Personal',
        createdOn: "20/06/2023"
    },
    {
        id: '2',
        title: "Landing Page Design for TravelDays",
        description: "Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)",
        priority: "Moderate",
        status: "In Progress",
        category: 'Work',
        createdOn: "20/06/2023"
    }
];

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(mockInitialTasks);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');

    const addTask = (newTaskData: Omit<Task, 'id' | 'createdOn'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: Math.random().toString(36).substr(2, 9),
            createdOn: new Date().toLocaleDateString('en-GB')
        };
        setTasks([newTask, ...tasks]);
    };

    const updateTask = (updatedTask: Task) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <TaskContext.Provider value={{
            tasks, addTask, updateTask, deleteTask,
            searchQuery, setSearchQuery,
            categoryFilter, setCategoryFilter
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
