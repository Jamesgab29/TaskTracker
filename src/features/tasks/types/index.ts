// Task feature types

export interface Category {
    id: string;
    name: string;
}

export interface Subtask {
    id?: string;
    name: string;
    completed: boolean;
}

export interface Task {
    id?: string; // UUID from backend
    title: string;
    description: string;
    priority: 'High' | 'Moderate' | 'Low';
    status: 'Completed' | 'In Progress' | 'Not Started';
    category?: Category; // Fully mapped category object from backend
    categoryId?: string; // used for requests
    userId?: string;     // user who owns task
    createdOn?: string;
    dueDate?: string;
    completedOn?: string;
    subtasks?: Subtask[];
}
