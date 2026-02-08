import type { CanvasTask } from '../types';

export class CanvasParser {
  /**
   * Scans raw content (from announcements or syllabus PDFs) and extracts task objects.
   */
  static async scanContent(_rawText: string, courseName: string): Promise<CanvasTask[]> {
    console.log(`[CanvasParser] Scanning content for ${courseName}...`);
    return [];
  }

  static async parseFromApi(apiResponse: any): Promise<CanvasTask[]> {
    return apiResponse.map((item: any) => ({
      id: item.id.toString(),
      courseName: item.course_name || 'Unknown Course',
      title: item.title,
      dueDate: item.due_at,
      type: item.type || 'assignment',
      status: 'pending',
      syncedAt: new Date().toISOString()
    }));
  }

  static getSimulationTasks(roomId: string): CanvasTask[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const twoDaysLater = new Date(now);
    twoDaysLater.setDate(now.getDate() + 2);

    const tenDaysLater = new Date(now);
    tenDaysLater.setDate(now.getDate() + 10);

    return [
      {
        id: 'sim-quiz-1',
        courseName: '기초 스페인어',
        title: '단어 시험',
        dueDate: tomorrow.toISOString(),
        type: 'quiz',
        status: 'pending',
        syncedAt: now.toISOString(),
        roomId: roomId
      },
      {
        id: 'sim-algo-1',
        courseName: '알고리즘 설계',
        title: '다익스트라 구현',
        dueDate: twoDaysLater.toISOString(),
        type: 'assignment',
        status: 'pending',
        syncedAt: now.toISOString(),
        roomId: roomId
      },
      {
        id: 'sim-mkt-1',
        courseName: '마케팅 원론',
        title: '시장 조사 보고서',
        dueDate: tenDaysLater.toISOString(),
        type: 'assignment',
        status: 'pending',
        syncedAt: now.toISOString(),
        roomId: roomId
      }
    ];
  }
}
