export type RiskLevel = 'low' | 'medium' | 'high';
export type ProjectStatus = 'en_proceso' | 'finalizado' | 'suspendido';

export interface Contratista {
  nombre: string;
  nit: string;
  representanteLegal?: string;
}

export interface Ubicacion {
  lat: number;
  lng: number;
  direccion: string;
  municipio: string;
  departamento: string;
}

export interface Project {
  id: string;
  nombre: string;
  entidad: string;
  contratista: Contratista;
  costo: number;
  fechaInicio: string;
  fechaFin: string;
  avanceReal: number;
  avanceReportado: number;
  riesgoCorrupcion: number;
  ubicacion: Ubicacion;
  imagenes: {
    antes?: string;
    proyeccion?: string;
    actual?: string;
  };
  pdfUrl: string;
  estado: ProjectStatus;
  categoria: string;
  modalidadContratacion: string;
  createdAt: string;
}
