import { NextResponse } from 'next/server';
import { ProjectService } from '@/lib/services/projectService';

export async function GET() {
  try {
    const projects = await ProjectService.getProjects();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects.' },
      { status: 500 }
    );
  }
}
