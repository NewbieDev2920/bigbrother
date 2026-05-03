import type { Project } from '@/types/project';
import type { AnalysisResult } from '@/types/analysis';
import type { ChatMessage } from '@/types/chat';

export interface AIAdapter {
  analyzeDocument(file: File): Promise<{ project: Project; analysis: AnalysisResult }>;
  askAboutDocument(projectId: string, question: string): Promise<ChatMessage>;
  searchProjects(query: string): Promise<{ exactMatch: Project | null; similar: Project[] }>;
  checkExisting(fileHash: string): Promise<Project | null>;
  getTrending(): Promise<{ masBuscados: Project[]; mayorRiesgo: Project[]; masMencionados: Project[] }>;
  getProject(id: string): Promise<{ project: Project; analysis: AnalysisResult } | null>;
}
