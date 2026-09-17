import { Project } from '@/types/project';
import { MOCK_PROJECTS } from '@/lib/mocks/projects';

export class ProjectService {
  static async getProjects(): Promise<Project[]> {
    return JSON.parse(JSON.stringify(MOCK_PROJECTS));
  }

  static async getProjectById(id: string): Promise<Project | null> {
    const project = MOCK_PROJECTS.find((p) => p.id === id);
    return project ? JSON.parse(JSON.stringify(project)) : null;
  }
}
