import { Project } from '@/types/project';
import { PROJECTS_DATA } from '@/constants/projects';

export class ProjectStore {
  static async getProjects(): Promise<Project[]> {
    return JSON.parse(JSON.stringify(PROJECTS_DATA));
  }

  static async getProjectById(id: string): Promise<Project | null> {
    const project = PROJECTS_DATA.find((p) => p.id === id);
    return project ? JSON.parse(JSON.stringify(project)) : null;
  }
}
