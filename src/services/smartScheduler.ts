import type { CanvasTask, ScheduledTask, UrgencyLevel } from '../types';

export class SmartScheduler {
    /**
     * Calculates priority based on due date and KST.
     * Priority 1 is highest (closest deadline).
     */
    static calculatePriority(tasks: CanvasTask[]): ScheduledTask[] {
        const now = new Date();

        return tasks
            .map(task => {
                const dueDate = new Date(task.dueDate);
                const diffMs = dueDate.getTime() - now.getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);

                let remainingTime = '';
                if (diffHours < 0) remainingTime = '마감됨';
                else if (diffHours < 24) remainingTime = `${diffHours}시간 남음`;
                else remainingTime = `${diffDays}일 남음`;

                let urgency: UrgencyLevel = 'Planned';
                if (diffMs < 0) urgency = 'Finished';
                else if (diffMs < 86400000) urgency = 'Critical'; // 24 hours
                else if (diffMs < 259200000) urgency = 'Upcoming'; // 3 days

                return {
                    ...task,
                    priority: diffMs, // Smaller diffMs means higher priority (closer)
                    remainingTime,
                    urgency
                };
            })
            .sort((a, b) => a.priority - b.priority);
    }
}
