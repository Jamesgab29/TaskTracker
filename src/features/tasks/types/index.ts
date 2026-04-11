// Task feature types

export type Category = 'Work' | 'Personal' | 'Other';

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
