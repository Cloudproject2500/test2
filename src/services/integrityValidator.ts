import type { ScheduledTask } from '../types';

export class IntegrityValidator {
    /**
     * Checks if extracted tasks clash with existing DB schedules and removes duplicates.
     */
    static validateAndDeDuplicate(newTasks: ScheduledTask[], existingTasks: ScheduledTask[]): ScheduledTask[] {
        const existingIds = new Set(existingTasks.map(t => t.id));

        return newTasks.filter(task => {
            // Data Security & Precision: Ensure essential fields are present
            if (!task.id || !task.dueDate || isNaN(new Date(task.dueDate).getTime())) {
                console.warn(`[IntegrityValidator] Skipping invalid task: ${task.title}`);
                return false;
            }

            return !existingIds.has(task.id);
        });
    }
}
