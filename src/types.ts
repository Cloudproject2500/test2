export type UrgencyLevel = 'Critical' | 'Upcoming' | 'Planned' | 'Finished';

export interface CanvasTask {
    id: string;
    courseName: string;
    title: string;
    dueDate: string; // ISO string
    type: 'assignment' | 'exam' | 'announcement' | 'quiz';
    description?: string;
    points?: number;
    weight?: number; // e.g. 100 for high priority
    location?: string; // for exams
    syllabusCover?: string; // for exams
    roomId?: string;
    status: 'pending' | 'submitted' | 'finished';
    syncedAt: string;
}

export interface ScheduledTask extends CanvasTask {
    priority: number;
    remainingTime: string;
    urgency: UrgencyLevel;
    examCountdown?: string; // Countdown for exams
}

export interface Course {
    id: string;
    code: string;
    name: string;
    instructor: string;
    days: string[]; // ['Mo', 'We']
    startTime: string; // '14:00'
    endTime: string;   // '15:15'
    room: string;
    status: 'Open' | 'Closed';
    attributes: string[]; // ['QI', 'CW', 'FF']
    category: string;
    prefix: string; // ACCTG, CS, etc.
}

export interface TimetableEntry {
    courseId: string;
    color: string;
}

export interface LifePage {
    id: string;
    name: string;
    icon: string;
    type: 'default' | 'custom';
}

export interface PersonalTodo {
    id: string;
    pageId: string;
    text: string;
    completed: boolean;
    category?: string;
    tag?: string;
    icon?: string;
    progress?: number; // e.g., 50 (for "50/300")
    goal?: number;     // e.g., 300
    color?: string;
}

export interface CategoryTemplate {
    id: string;
    name: string;
    category: string;
    tasks: { text: string; icon: string; goal?: number }[];
}


