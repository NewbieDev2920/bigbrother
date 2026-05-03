import type { Project } from '@/types/project';
import type { AnalysisResult, AspectKey, CapaKey, Hallazgo } from '@/types/analysis';

const h = (
  id: string,
  severidad: Hallazgo['severidad'],
  titulo: string,
  descripcion: string,
  capa: CapaKey,
  pagina: number
): Hallazgo => ({ id, severidad, titulo, descripcion, capa, ubicacionEnDocumento: { pagina } });

// =========================================================================
// PROJECTS
// =========================================================================

export const mockProjects: Project[] = [
  {
    id: 'via-prosperidad',
    nombre: 'Vía de la Prosperidad — Tramo Magdalena',
    entidad: 'Gobernación del Magdalena',
    contratista: {
      nombre: 'UT Caribe Vial 2023',
      nit: '901.234.567-8',
      representanteLegal: 'Carlos Andrés Mejía Ramírez',
    },
    costo: 432_000_000_000,
    fechaInicio: '2023-03-15',
    fechaFin: '2025-12-20',
    avanceReal: 34,
    avanceReportado: 68,
    riesgoCorrupcion: 67,
    ubicacion: {
      lat: 10.96854,
      lng: -74.78132,
      direccion: 'Corredor vial Plato — El Difícil',
      municipio: 'Plato',
      departamento: 'Magdalena',
    },
    imagenes: {
      antes: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900',
      proyeccion: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=900',
      actual: 'https://images.unsplash.com/photo-1597844808175-ee5d6ab7e8e1?w=900',
    },
    pdfUrl: '/mock-pdfs/via-prosperidad.pdf',
    estado: 'en_proceso',
    categoria: 'Infraestructura vial',
    modalidadContratacion: 'Licitación Pública',
    createdAt: '2023-03-01T10:00:00Z',
  },
  {
    id: 'centros-poblados',
    nombre: 'Centros Poblados — Conectividad rural',
    entidad: 'Ministerio de Tecnologías (MinTIC)',
    contratista: {
      nombre: 'UT Centros Poblados',
      nit: '901.456.789-0',
      representanteLegal: 'Iván Felipe Beltrán Cortés',
    },
    costo: 1_070_000_000_000,
    fechaInicio: '2020-12-15',
    fechaFin: '2022-08-31',
    avanceReal: 7,
    avanceReportado: 42,
    riesgoCorrupcion: 78,
    ubicacion: {
      lat: 4.57087,
      lng: -74.29733,
      direccion: 'Ámbito nacional — Ejecución rural',
      municipio: 'Bogotá',
      departamento: 'Cundinamarca',
    },
    imagenes: {
      antes: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=900',
      proyeccion: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900',
      actual: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900',
    },
    pdfUrl: '/mock-pdfs/centros-poblados.pdf',
    estado: 'suspendido',
    categoria: 'Tecnología y conectividad',
    modalidadContratacion: 'Licitación Pública',
    createdAt: '2020-12-01T10:00:00Z',
  },
  {
    id: 'ungrd-carrotanques',
    nombre: 'UNGRD — Suministro carrotanques La Guajira',
    entidad: 'Unidad Nacional para la Gestión del Riesgo de Desastres',
    contratista: {
      nombre: 'Impo Comercializadora SAS',
      nit: '900.789.123-4',
      representanteLegal: 'Olmedo López Martínez',
    },
    costo: 46_800_000_000,
    fechaInicio: '2023-09-10',
    fechaFin: '2024-02-28',
    avanceReal: 12,
    avanceReportado: 80,
    riesgoCorrupcion: 82,
    ubicacion: {
      lat: 11.54444,
      lng: -72.90778,
      direccion: 'Corregimientos de La Alta Guajira',
      municipio: 'Riohacha',
      departamento: 'La Guajira',
    },
    imagenes: {
      antes: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
      proyeccion: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=900',
      actual: 'https://images.unsplash.com/photo-1605713288610-00ec3c2a45a8?w=900',
    },
    pdfUrl: '/mock-pdfs/ungrd-carrotanques.pdf',
    estado: 'suspendido',
    categoria: 'Atención de emergencias',
    modalidadContratacion: 'Contratación Directa (Urgencia Manifiesta)',
    createdAt: '2023-09-01T10:00:00Z',
  },
  {
    id: 'ruta-sol-2',
    nombre: 'Ruta del Sol II — Tramo central',
    entidad: 'Agencia Nacional de Infraestructura (ANI)',
    contratista: {
      nombre: 'Concesionaria Ruta del Sol SAS',
      nit: '900.234.567-1',
      representanteLegal: 'Luis Fernando Andrade (histórico)',
    },
    costo: 5_300_000_000_000,
    fechaInicio: '2010-01-01',
    fechaFin: '2024-12-31',
    avanceReal: 65,
    avanceReportado: 70,
    riesgoCorrupcion: 45,
    ubicacion: {
      lat: 5.5353,
      lng: -73.367,
      direccion: 'Puerto Salgar — San Roque',
      municipio: 'Puerto Salgar',
      departamento: 'Cundinamarca',
    },
    imagenes: {
      antes: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900',
      proyeccion: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=900',
      actual: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900',
    },
    pdfUrl: '/mock-pdfs/ruta-sol-2.pdf',
    estado: 'finalizado',
    categoria: 'Infraestructura vial',
    modalidadContratacion: 'Concesión',
    createdAt: '2010-01-01T10:00:00Z',
  },
  {
    id: 'proyecto-prueba',
    nombre: 'Proyecto Prueba — Adecuación Parque Simón Bolívar',
    entidad: 'Alcaldía Mayor de Bogotá D.C.',
    contratista: {
      nombre: 'Constructora Urbana del Centro SAS',
      nit: '900.555.444-2',
      representanteLegal: 'Andrés Felipe Morales Gutiérrez',
    },
    costo: 8_200_000_000,
    fechaInicio: '2024-01-15',
    fechaFin: '2025-03-30',
    avanceReal: 82,
    avanceReportado: 84,
    riesgoCorrupcion: 6,
    ubicacion: {
      lat: 4.65861,
      lng: -74.09361,
      direccion: 'Calle 63 — Av. Cra 68, Parque Simón Bolívar',
      municipio: 'Bogotá',
      departamento: 'Cundinamarca',
    },
    imagenes: {
      antes: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900',
      proyeccion: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=900',
      actual: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900',
    },
    pdfUrl: '/mock-pdfs/proyecto-prueba.pdf',
    estado: 'en_proceso',
    categoria: 'Espacio público y parques',
    modalidadContratacion: 'Selección Abreviada',
    createdAt: '2024-01-05T09:00:00Z',
  },
  {
    id: 'colegio-rural',
    nombre: 'Construcción Colegio Rural — La Esperanza',
    entidad: 'Alcaldía Municipal de Yacopí',
    contratista: {
      nombre: 'Constructora Cundinamarca SAS',
      nit: '900.111.222-3',
      representanteLegal: 'María Elena Cárdenas Pinilla',
    },
    costo: 3_450_000_000,
    fechaInicio: '2024-02-01',
    fechaFin: '2025-06-30',
    avanceReal: 78,
    avanceReportado: 80,
    riesgoCorrupcion: 8,
    ubicacion: {
      lat: 5.45722,
      lng: -74.33778,
      direccion: 'Vereda La Esperanza',
      municipio: 'Yacopí',
      departamento: 'Cundinamarca',
    },
    imagenes: {
      antes: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=900',
      proyeccion: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900',
      actual: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=900',
    },
    pdfUrl: '/mock-pdfs/colegio-rural.pdf',
    estado: 'en_proceso',
    categoria: 'Educación',
    modalidadContratacion: 'Selección Abreviada',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

// =========================================================================
// ANALYSES — verbose
// =========================================================================

const aspectChartData = (project: Project) => ({
  presupuesto: {
    series: [
      { name: 'Estudios previos', estudio: 80, contrato: 100, mercado: 78 },
      { name: 'Obra civil', estudio: 90, contrato: 118, mercado: 92 },
      { name: 'Suministros', estudio: 85, contrato: 110, mercado: 88 },
      { name: 'Operación', estudio: 70, contrato: 95, mercado: 72 },
    ],
  },
  contratista: {
    radar: [
      { eje: 'Experiencia', valor: 60 },
      { eje: 'Financiero', valor: 45 },
      { eje: 'Antecedentes', valor: 30 },
      { eje: 'Redes', valor: 25 },
      { eje: 'Sanciones', valor: 50 },
    ],
  },
  tiempo: {
    timeline: [
      { hito: 'Adjudicación', mes: 0, planeado: 100, real: 100 },
      { hito: 'Acta de inicio', mes: 1, planeado: 100, real: 95 },
      { hito: 'Diseños finales', mes: 4, planeado: 100, real: 60 },
      { hito: 'Obra 25%', mes: 8, planeado: 100, real: 40 },
      { hito: 'Obra 50%', mes: 14, planeado: 100, real: project.avanceReal },
      { hito: 'Obra 75%', mes: 20, planeado: 100, real: 0 },
      { hito: 'Entrega', mes: 24, planeado: 100, real: 0 },
    ],
  },
  transparencia: {
    grid: [
      { doc: 'Estudios previos', score: 0.7 },
      { doc: 'Análisis sector', score: 0.4 },
      { doc: 'Pliego inicial', score: 0.6 },
      { doc: 'Adendas', score: 0.3 },
      { doc: 'Adjudicación', score: 0.8 },
      { doc: 'Contrato', score: 0.7 },
      { doc: 'Otrosíes', score: 0.2 },
      { doc: 'Actas', score: 0.5 },
      { doc: 'Pagos', score: 0.4 },
      { doc: 'Interventoría', score: 0.3 },
    ],
  },
  avance: {
    monthly: [
      { mes: 'M1', real: 5, reportado: 8 },
      { mes: 'M2', real: 9, reportado: 18 },
      { mes: 'M3', real: 14, reportado: 32 },
      { mes: 'M4', real: 19, reportado: 45 },
      { mes: 'M5', real: 26, reportado: 55 },
      { mes: 'M6', real: project.avanceReal, reportado: project.avanceReportado },
    ],
  },
});

const buildAnalysis = (
  project: Project,
  config: {
    capaScores: Record<CapaKey, number>;
    aspectScores: Record<AspectKey, number>;
    hallazgos: Record<CapaKey, Hallazgo[]>;
    detalles: Record<AspectKey, { resumen: string; detalle: string }>;
  }
): AnalysisResult => {
  const charts = aspectChartData(project);
  const aspectHallazgos: Record<AspectKey, Hallazgo[]> = {
    presupuesto: [...config.hallazgos.capa2_coherencia, ...config.hallazgos.capa4_semantico].slice(0, 4),
    contratista: [...config.hallazgos.capa5_redes, ...config.hallazgos.capa1_documental].slice(0, 4),
    tiempo: [...config.hallazgos.capa3_clausulas, ...config.hallazgos.capa2_coherencia].slice(0, 4),
    transparencia: [...config.hallazgos.capa1_documental, ...config.hallazgos.capa3_clausulas].slice(0, 4),
    avance: [...config.hallazgos.capa2_coherencia, ...config.hallazgos.capa4_semantico].slice(0, 4),
  };
  return {
    projectId: project.id,
    riesgoGlobal: project.riesgoCorrupcion,
    capas: {
      capa1_documental: {
        score: config.capaScores.capa1_documental,
        resumen: config.hallazgos.capa1_documental[0]?.descripcion ?? 'Sin observaciones documentales relevantes.',
        hallazgos: config.hallazgos.capa1_documental,
      },
      capa2_coherencia: {
        score: config.capaScores.capa2_coherencia,
        resumen: config.hallazgos.capa2_coherencia[0]?.descripcion ?? 'Coherencia documental adecuada.',
        hallazgos: config.hallazgos.capa2_coherencia,
      },
      capa3_clausulas: {
        score: config.capaScores.capa3_clausulas,
        resumen: config.hallazgos.capa3_clausulas[0]?.descripcion ?? 'Cláusulas dentro de estándares.',
        hallazgos: config.hallazgos.capa3_clausulas,
      },
      capa4_semantico: {
        score: config.capaScores.capa4_semantico,
        resumen: config.hallazgos.capa4_semantico[0]?.descripcion ?? 'Análisis semántico sin alertas.',
        hallazgos: config.hallazgos.capa4_semantico,
      },
      capa5_redes: {
        score: config.capaScores.capa5_redes,
        resumen: config.hallazgos.capa5_redes[0]?.descripcion ?? 'Sin patrones de red sospechosos.',
        hallazgos: config.hallazgos.capa5_redes,
      },
    },
    aspectos: {
      presupuesto: {
        score: config.aspectScores.presupuesto,
        resumen: config.detalles.presupuesto.resumen,
        detalle: config.detalles.presupuesto.detalle,
        hallazgos: aspectHallazgos.presupuesto,
        chartData: charts.presupuesto as unknown as Record<string, unknown>,
      },
      contratista: {
        score: config.aspectScores.contratista,
        resumen: config.detalles.contratista.resumen,
        detalle: config.detalles.contratista.detalle,
        hallazgos: aspectHallazgos.contratista,
        chartData: charts.contratista as unknown as Record<string, unknown>,
      },
      tiempo: {
        score: config.aspectScores.tiempo,
        resumen: config.detalles.tiempo.resumen,
        detalle: config.detalles.tiempo.detalle,
        hallazgos: aspectHallazgos.tiempo,
        chartData: charts.tiempo as unknown as Record<string, unknown>,
      },
      transparencia: {
        score: config.aspectScores.transparencia,
        resumen: config.detalles.transparencia.resumen,
        detalle: config.detalles.transparencia.detalle,
        hallazgos: aspectHallazgos.transparencia,
        chartData: charts.transparencia as unknown as Record<string, unknown>,
      },
      avance: {
        score: config.aspectScores.avance,
        resumen: config.detalles.avance.resumen,
        detalle: config.detalles.avance.detalle,
        hallazgos: aspectHallazgos.avance,
        chartData: charts.avance as unknown as Record<string, unknown>,
      },
    },
    generadoEn: new Date().toISOString(),
  };
};

// ---- Vía de la Prosperidad ----
const aViaProsperidad = buildAnalysis(mockProjects.find(p => p.id === 'via-prosperidad')!, {
  capaScores: {
    capa1_documental: 55,
    capa2_coherencia: 32,
    capa3_clausulas: 41,
    capa4_semantico: 38,
    capa5_redes: 60,
  },
  aspectScores: { presupuesto: 45, contratista: 72, tiempo: 30, transparencia: 55, avance: 25 },
  hallazgos: {
    capa1_documental: [
      h('vp-1-1', 'medium', 'Estudios previos genéricos', 'Los estudios previos reutilizan textos de otros corredores viales del país, sin evidenciar análisis de oferta local.', 'capa1_documental', 12),
      h('vp-1-2', 'high', 'Ausencia de matriz de riesgos detallada', 'La matriz de riesgos es de una sola página y no cuantifica probabilidad/impacto, lo que dificulta la imputación de costos contingentes.', 'capa1_documental', 18),
      h('vp-1-3', 'medium', 'Análisis del sector incompleto', 'No se documenta análisis comparativo de precios con corredores similares en la región Caribe.', 'capa1_documental', 22),
    ],
    capa2_coherencia: [
      h('vp-2-1', 'high', 'Discrepancia entre CDP y RP', 'El Certificado de Disponibilidad Presupuestal indica $410 mil millones, pero el Registro Presupuestal final asciende a $432 mil millones sin justificación documentada.', 'capa2_coherencia', 8),
      h('vp-2-2', 'high', 'Sobrecosto del 18% en concreto MR-45', 'Se cobra a $1.250.000/m³ cuando el promedio de mercado regional es $1.058.000/m³.', 'capa2_coherencia', 47),
      h('vp-2-3', 'medium', 'Inconsistencia avance reportado vs evidencia fotográfica', 'El interventor reporta 68% de avance, pero las imágenes adjuntas muestran obra incipiente.', 'capa2_coherencia', 89),
    ],
    capa3_clausulas: [
      h('vp-3-1', 'high', 'Otrosí #4 elimina cláusula de penalización por mora', 'La modificación retira la sanción del 0.5% diario por incumplimiento, dejando al contratista sin presión efectiva.', 'capa3_clausulas', 134),
      h('vp-3-2', 'medium', 'Plazos extendidos sin causa de fuerza mayor', 'Tres prórrogas suman 14 meses adicionales sin acreditar caso fortuito.', 'capa3_clausulas', 156),
      h('vp-3-3', 'medium', 'Pliego sastre — experiencia ad hoc', 'El pliego exige experiencia exacta en "vías de doble calzada en zona costera", criterio que ajusta a un único proponente.', 'capa3_clausulas', 31),
    ],
    capa4_semantico: [
      h('vp-4-1', 'high', 'APU inflado en ítem "Material seleccionado"', 'Análisis de Precios Unitarios indica $145.000/m³ contra $98.000/m³ en proyectos comparables del INVIAS.', 'capa4_semantico', 58),
      h('vp-4-2', 'medium', 'Lenguaje ambiguo en alcance de obra', 'La descripción del alcance usa términos como "según condiciones del terreno" sin parámetros medibles.', 'capa4_semantico', 41),
    ],
    capa5_redes: [
      h('vp-5-1', 'medium', 'Representante legal con vínculos previos a la entidad', 'El representante legal del consorcio fue contratista directo de la Gobernación entre 2018-2020.', 'capa5_redes', 168),
      h('vp-5-2', 'medium', 'Subcontratación concentrada', 'El 73% del valor subcontratado se asigna a tres empresas con domicilio en la misma dirección.', 'capa5_redes', 174),
    ],
  },
  detalles: {
    presupuesto: {
      resumen: 'Sobrecostos focalizados en obra civil — desviación promedio del 18% frente al mercado.',
      detalle:
        'El presupuesto presenta inconsistencias significativas entre los estudios previos, los APU del contrato y los precios de mercado regional. Tres ítems concentran el 64% del sobrecosto: concreto MR-45, material seleccionado y acero de refuerzo.\n\nLa diferencia entre el CDP y el RP final ($22 mil millones) no encuentra respaldo en actos administrativos de adición. La modalidad por precios unitarios incrementables, sumada a otrosíes que ampliaron cantidades en un 23%, configura un patrón de costo en aumento sostenido.\n\nEl sistema sugiere revisar los soportes de los APU contra precios de referencia INVIAS y solicitar a la interventoría la conciliación de cantidades ejecutadas.',
    },
    contratista: {
      resumen: 'Capacidad financiera y experiencia razonables; antecedentes con observaciones puntuales.',
      detalle:
        'La Unión Temporal Caribe Vial 2023 cumple los requisitos formales de experiencia y capacidad financiera, aunque uno de sus integrantes registra dos sanciones administrativas en proyectos con la Gobernación del Atlántico (2019, 2021).\n\nEl representante legal mantuvo relación contractual directa con la entidad contratante en el periodo 2018-2020, lo que sin configurar inhabilidad legal expresa, sí amerita verificación de acuerdo a la Ley 1474 de 2011 sobre puerta giratoria.\n\nEl análisis de redes detecta que el 73% de los subcontratos se concentra en tres empresas con domicilio compartido, patrón asociado en el modelo a riesgo de empresas de papel.',
    },
    tiempo: {
      resumen: 'Avance real (34%) significativamente menor al reportado (68%); tres prórrogas acumuladas.',
      detalle:
        'El cronograma original contemplaba entrega en diciembre de 2024. Tres modificaciones contractuales han extendido el plazo en 14 meses sin acreditar causales de fuerza mayor o caso fortuito en los términos del artículo 1604 del Código Civil.\n\nLa relación entre avance reportado y evidencia fotográfica disponible muestra una desviación sostenida desde el mes 4 del contrato. La curva real se aplana mientras el reporte mantiene crecimiento lineal — patrón característico de sobreestimación en interventoría.\n\nEl otrosí #4 eliminó la cláusula de penalización por mora, debilitando el instrumento contractual de presión al cumplimiento.',
    },
    transparencia: {
      resumen: 'Documentación parcial publicada en SECOP II; otrosíes y actas de pago con baja trazabilidad.',
      detalle:
        'La trazabilidad documental en SECOP II es heterogénea. Los documentos previos a la firma del contrato presentan cumplimiento del 70%, pero los otrosíes y actas de pago caen al 30% y 40% respectivamente.\n\nLa interventoría entrega informes mensuales, pero estos no se cargan a la plataforma sino que circulan internamente. Esto limita el control social y la fiscalización ciudadana.\n\nSe recomienda solicitar formalmente la publicación de la totalidad de los soportes del contrato, en cumplimiento del Decreto 1082 de 2015.',
    },
    avance: {
      resumen: 'Brecha de 34 puntos entre avance real (34%) y reportado (68%) — desviación crítica.',
      detalle:
        'La medición independiente realizada por el modelo, contrastando hitos contractuales, evidencia fotográfica y reportes de interventoría, sitúa el avance real en torno al 34%. El avance reportado oficialmente es del 68%.\n\nEsta brecha de 34 puntos porcentuales es consistente con el patrón de "facturación adelantada" descrito por la Contraloría General en informes sobre infraestructura en la región Caribe. El sistema sugiere verificar las actas de pago contra la ejecución física certificada por terceros independientes.\n\nEl ritmo actual de obra, de mantenerse, llevaría a la entrega real al primer trimestre de 2027, frente al compromiso contractual modificado de febrero de 2026.',
    },
  },
});

// ---- Centros Poblados ----
const aCentrosPoblados = buildAnalysis(mockProjects.find(p => p.id === 'centros-poblados')!, {
  capaScores: {
    capa1_documental: 35,
    capa2_coherencia: 22,
    capa3_clausulas: 28,
    capa4_semantico: 30,
    capa5_redes: 18,
  },
  aspectScores: { presupuesto: 28, contratista: 15, tiempo: 12, transparencia: 35, avance: 8 },
  hallazgos: {
    capa1_documental: [
      h('cp-1-1', 'high', 'Pólizas con vigencia inferior al contrato', 'Las garantías depositadas vencen 8 meses antes de la fecha contractual de entrega.', 'capa1_documental', 14),
      h('cp-1-2', 'high', 'Documentos de capacidad financiera con fecha de corte irregular', 'Los estados financieros aportados tienen fecha de corte que no coincide con cierre fiscal estándar.', 'capa1_documental', 28),
    ],
    capa2_coherencia: [
      h('cp-2-1', 'high', 'Anticipo del 50% sin amortización clara', 'Se desembolsó anticipo de $535 mil millones sin cronograma documentado de amortización.', 'capa2_coherencia', 67),
      h('cp-2-2', 'high', 'Reporte de instalaciones no verificable en campo', 'Se reportan 3.000 puntos instalados; muestreo independiente verifica solo 220.', 'capa2_coherencia', 142),
    ],
    capa3_clausulas: [
      h('cp-3-1', 'high', 'Cláusula de exclusividad en garantías', 'El contrato permite garantías de un único asegurador que opera en cobertura limitada.', 'capa3_clausulas', 91),
      h('cp-3-2', 'medium', 'Mecanismo de terminación unilateral debilitado', 'La terminación requiere "acuerdo bilateral" en lugar de la potestad excepcional de la Ley 80.', 'capa3_clausulas', 105),
    ],
    capa4_semantico: [
      h('cp-4-1', 'high', 'Cantidades infladas en propuesta económica', 'Se cotizaron 7.277 puntos cuando el alcance original mencionaba 7.000.', 'capa4_semantico', 53),
      h('cp-4-2', 'medium', 'Términos vagos en obligaciones técnicas', 'La descripción de "cobertura efectiva" carece de criterios técnicos medibles.', 'capa4_semantico', 71),
    ],
    capa5_redes: [
      h('cp-5-1', 'high', 'Aseguradora vinculada al contratista', 'La aseguradora que emite las garantías comparte beneficiario final con uno de los miembros de la UT.', 'capa5_redes', 188),
      h('cp-5-2', 'high', 'Patrón de licitaciones sucesivas con mismos competidores', 'Los tres principales proponentes en este proceso coincidieron en otras 4 licitaciones del MinTIC entre 2018-2020.', 'capa5_redes', 195),
    ],
  },
  detalles: {
    presupuesto: {
      resumen: 'Anticipo del 50% sin amortización clara y cantidades sobreestimadas.',
      detalle:
        'El presupuesto del contrato presenta dos focos críticos: el anticipo del 50% ($535 mil millones) carece de cronograma de amortización documentado, y las cantidades cotizadas exceden en 277 unidades las del alcance original.\n\nEl modelo identifica que la facturación reconocida no corresponde a unidades efectivamente instaladas en campo, lo que sugiere reconocimiento contable adelantado de obras no ejecutadas.\n\nLa concentración del riesgo financiero en el anticipo, sumada a la vigencia limitada de las pólizas, configura un escenario de exposición fiscal alta para el Estado.',
    },
    contratista: {
      resumen: 'Vínculos cruzados entre contratista y aseguradora; historial de licitaciones concentradas.',
      detalle:
        'La Unión Temporal Centros Poblados presenta múltiples señales en el análisis de redes. El asegurador que emite las pólizas comparte beneficiario final con uno de los integrantes de la UT, lo que constituye un riesgo de garantía circular.\n\nEl historial de licitaciones del MinTIC entre 2018-2020 muestra que los tres principales proponentes de este proceso participaron juntos —rotando posiciones— en otros 4 procesos. El modelo asigna alta probabilidad a un patrón de competencia simulada.\n\nLa capacidad financiera fue acreditada con estados financieros de fecha de corte irregular, lo cual amerita verificación contra los registros oficiales de la Supersociedades.',
    },
    tiempo: {
      resumen: 'Contrato con vencimiento en 2022; ejecución real congelada desde 2021.',
      detalle:
        'El contrato fijó entrega para agosto de 2022. La ejecución real, según verificación independiente, se detuvo en el último trimestre de 2021. El proceso fue suspendido en 2022 por la entidad contratante.\n\nDe los 7.277 puntos contratados, las visitas independientes verifican menos del 8% efectivamente operando. Las pólizas de cumplimiento, cuya vigencia es inferior al plazo contractual, vencieron antes de que se materializara el incumplimiento total.\n\nEl modelo recomienda priorizar acciones de recuperación del anticipo y trazabilidad del flujo financiero post-desembolso.',
    },
    transparencia: {
      resumen: 'Información parcial en SECOP; auditoría de la Contraloría con hallazgos confirmados.',
      detalle:
        'La documentación pública en SECOP II permite reconstruir la fase precontractual y contractual, pero la información de ejecución es fragmentaria. Los informes de interventoría no fueron publicados en formato accesible.\n\nLa Contraloría General de la República emitió hallazgos de responsabilidad fiscal por $70.000 millones en relación al anticipo no amortizado y a las pólizas defectuosas.\n\nLa colaboración de la entidad contratante con investigaciones posteriores ha sido adecuada según los reportes de organismos de control.',
    },
    avance: {
      resumen: 'Avance real estimado en 7%; reportado oficialmente alcanzó 42% antes de suspensión.',
      detalle:
        'El avance real de instalación efectiva, contrastado con muestreos en sitio realizados por veedurías ciudadanas y por la propia Contraloría, no supera el 7% del alcance contratado.\n\nLos reportes oficiales habían alcanzado 42% al momento de la suspensión, lo que evidencia una brecha de 35 puntos porcentuales entre lo facturado y lo entregado. Esta es una de las mayores brechas históricas registradas en contratación pública colombiana.\n\nEl modelo flag estado "suspendido" como evento de alta correlación con detección retrospectiva de incumplimiento estructural.',
    },
  },
});

// ---- UNGRD Carrotanques ----
const aUngrd = buildAnalysis(mockProjects.find(p => p.id === 'ungrd-carrotanques')!, {
  capaScores: {
    capa1_documental: 25,
    capa2_coherencia: 18,
    capa3_clausulas: 22,
    capa4_semantico: 20,
    capa5_redes: 12,
  },
  aspectScores: { presupuesto: 18, contratista: 10, tiempo: 15, transparencia: 22, avance: 18 },
  hallazgos: {
    capa1_documental: [
      h('un-1-1', 'high', 'Justificación de urgencia manifiesta cuestionable', 'La declaratoria de urgencia se apoya en circunstancias preexistentes y previsibles, no en hechos imprevistos.', 'capa1_documental', 8),
      h('un-1-2', 'high', 'Estudios previos de 4 páginas', 'Para un contrato de $46 mil millones, los estudios previos suman 4 páginas sin análisis técnico de mercado.', 'capa1_documental', 14),
    ],
    capa2_coherencia: [
      h('un-2-1', 'high', 'Sobrecosto del 250% sobre precio de mercado', 'Carrotanques cotizados a $750 millones cuando el precio de mercado es $214 millones por unidad equivalente.', 'capa2_coherencia', 32),
      h('un-2-2', 'high', 'Sin coherencia entre necesidad técnica y solución', 'Los corregimientos beneficiarios carecen de infraestructura vial para el tránsito de carrotanques de las dimensiones contratadas.', 'capa2_coherencia', 41),
    ],
    capa3_clausulas: [
      h('un-3-1', 'high', 'Plazo de entrega de 30 días sin penalización', 'La cláusula de plazo no prevé sanción específica por mora, en contradicción con el carácter urgente alegado.', 'capa3_clausulas', 56),
      h('un-3-2', 'high', 'Anticipo del 60% atípico para suministro', 'Los suministros de bienes muebles típicamente no requieren anticipo superior al 30%.', 'capa3_clausulas', 62),
    ],
    capa4_semantico: [
      h('un-4-1', 'high', 'Especificaciones técnicas ajustadas a un proveedor', 'Las especificaciones combinan parámetros de chasis, capacidad y motor que solo coinciden con un único distribuidor en el país.', 'capa4_semantico', 38),
    ],
    capa5_redes: [
      h('un-5-1', 'high', 'Contratista sin trayectoria en suministros similares', 'Impo Comercializadora SAS fue creada 8 meses antes de la firma del contrato; sin RUP previo en bienes de esta categoría.', 'capa5_redes', 78),
      h('un-5-2', 'high', 'Beneficiario final coincide con persona expuesta', 'Análisis de cadena societaria identifica al beneficiario final con vínculos personales declarados con funcionarios de la entidad contratante.', 'capa5_redes', 84),
    ],
  },
  detalles: {
    presupuesto: {
      resumen: 'Sobrecosto del 250% por unidad; anticipo del 60% atípico para suministros.',
      detalle:
        'Cada carrotanque fue cotizado en $750 millones, mientras el precio de mercado nacional para vehículos de capacidad y especificaciones equivalentes oscila entre $190 y $230 millones. La desviación supera el 250%.\n\nEl anticipo del 60% del valor contractual ($28 mil millones) constituye una exposición financiera atípica para un contrato de suministro, donde la práctica habitual no excede el 30%.\n\nLa estructuración del precio no encuentra respaldo en estudios de mercado documentados; los estudios previos consisten en 4 páginas sin tablas comparativas ni cotizaciones formales de proveedores alternativos.',
    },
    contratista: {
      resumen: 'Empresa creada 8 meses antes; beneficiario final con vínculos personales en la entidad.',
      detalle:
        'Impo Comercializadora SAS fue inscrita en Cámara de Comercio 8 meses antes de la firma del contrato. No registra inscripción previa en el RUP en la categoría de bienes contratados, ni experiencia documentada en suministro de vehículos especiales.\n\nEl análisis de cadena societaria, cruzado con bases de personas expuestas políticamente, identifica al beneficiario final con vínculos personales declarados en otros expedientes con funcionarios de la entidad contratante.\n\nEste perfil —empresa nueva, sin trayectoria, con vínculos en la cadena— configura el patrón clásico de empresa instrumental documentado en investigaciones previas de la Fiscalía.',
    },
    tiempo: {
      resumen: 'Urgencia manifiesta cuestionable; plazo sin penalización por mora.',
      detalle:
        'La declaratoria de urgencia manifiesta se sustenta en una situación de desabastecimiento de agua que era preexistente y conocida desde al menos 2018, lo que contradice los requisitos del artículo 42 de la Ley 80 que exige situaciones imprevistas.\n\nEl plazo contractual de 30 días no incluye cláusula penal específica por mora, debilitando el carácter urgente alegado.\n\nA pesar del carácter "urgente", el avance real del contrato no supera el 12% de las unidades efectivamente entregadas y operando en zona, configurando un patrón de uso indebido de la figura excepcional.',
    },
    transparencia: {
      resumen: 'Proceso por contratación directa con publicación mínima en SECOP.',
      detalle:
        'La modalidad de contratación directa por urgencia manifiesta exime de publicación previa, lo que limita estructuralmente el control social. Aún así, la publicación posterior en SECOP II presenta cumplimiento bajo: solo se publican el contrato y dos otrosíes, sin actas, informes de interventoría ni soportes de pago.\n\nEl proceso fue objeto de denuncia ciudadana y de investigación por la Fiscalía General. Posterior a la denuncia, la entidad contratante ha colaborado con los organismos de control aportando información reservada.\n\nLa trazabilidad pública del contrato es insuficiente para una veeduría ciudadana efectiva.',
    },
    avance: {
      resumen: 'De 40 carrotanques contratados, 5 entregados; 0 operando en zona objetivo.',
      detalle:
        'De los 40 carrotanques contratados, solo 5 unidades fueron entregadas físicamente. Verificación independiente en los corregimientos beneficiarios encuentra 0 unidades operando.\n\nLas 5 unidades entregadas no cumplen las especificaciones técnicas para tránsito en las vías destapadas de la Alta Guajira; la incompatibilidad técnica era previsible desde la fase de estudios previos.\n\nEl modelo asigna a este caso el patrón "suministro inviable", donde la solución contratada no responde a la necesidad técnica del territorio.',
    },
  },
});

// ---- Ruta del Sol II ----
const aRutaSol = buildAnalysis(mockProjects.find(p => p.id === 'ruta-sol-2')!, {
  capaScores: {
    capa1_documental: 60,
    capa2_coherencia: 55,
    capa3_clausulas: 50,
    capa4_semantico: 58,
    capa5_redes: 45,
  },
  aspectScores: { presupuesto: 50, contratista: 35, tiempo: 60, transparencia: 65, avance: 55 },
  hallazgos: {
    capa1_documental: [
      h('rs-1-1', 'medium', 'Modificaciones contractuales numerosas', 'Más de 20 modificaciones contractuales con justificaciones técnicas heterogéneas.', 'capa1_documental', 145),
    ],
    capa2_coherencia: [
      h('rs-2-1', 'medium', 'Variaciones de TIR a lo largo del contrato', 'La Tasa Interna de Retorno proyectada se ajustó al alza en tres reestructuraciones financieras.', 'capa2_coherencia', 87),
    ],
    capa3_clausulas: [
      h('rs-3-1', 'high', 'Cláusulas de equilibrio económico activadas múltiples veces', 'Las activaciones del equilibrio económico configuran un patrón histórico bajo investigación.', 'capa3_clausulas', 178),
      h('rs-3-2', 'medium', 'Subcontratos con empresas vinculadas a la cadena societaria', 'Algunos subcontratos se asignaron a empresas con beneficiarios finales relacionados.', 'capa3_clausulas', 192),
    ],
    capa4_semantico: [
      h('rs-4-1', 'medium', 'APU revisados por interventoría con observaciones', 'Múltiples APU fueron revisados al alza tras observaciones de interventoría.', 'capa4_semantico', 134),
    ],
    capa5_redes: [
      h('rs-5-1', 'high', 'Cadena societaria del contratista bajo investigación judicial', 'La estructura corporativa del consorcio fue objeto de investigaciones penales con sentencias condenatorias en otros tramos.', 'capa5_redes', 215),
      h('rs-5-2', 'medium', 'Aportes a campañas políticas documentados', 'Aportes electorales documentados a campañas que coinciden con periodos de adjudicación.', 'capa5_redes', 224),
    ],
  },
  detalles: {
    presupuesto: {
      resumen: 'Estructura financiera ajustada al alza en sucesivas reestructuraciones.',
      detalle:
        'El modelo de concesión estructuró el contrato con una TIR proyectada inicial del 9.5%. Tres reestructuraciones financieras posteriores ajustaron la TIR final al 14.2%, con activaciones del equilibrio económico cuyo soporte técnico fue cuestionado por la propia ANI.\n\nLos subcontratos representan el 68% del valor ejecutado; un 22% de ellos se asignó a empresas con beneficiarios finales relacionados al consorcio principal, configurando una estructura de extracción de valor.\n\nLas investigaciones penales sobre tramos asociados confirmaron sobornos para favorecer la adjudicación inicial, lo que afecta la legitimidad de la estructura financiera completa.',
    },
    contratista: {
      resumen: 'Cadena societaria del consorcio con sentencias condenatorias en investigaciones de soborno.',
      detalle:
        'La Concesionaria Ruta del Sol SAS, en su composición original, tuvo entre sus integrantes a empresas hoy condenadas por delitos de soborno transnacional. Las investigaciones judiciales finalizadas con sentencia revelaron pagos a funcionarios para influir en la adjudicación.\n\nLa fase actual de operación del tramo se desarrolla con un esquema patrimonial reorganizado, pero la trazabilidad de aportes a campañas políticas en el periodo de adjudicación permanece como hallazgo.\n\nEl modelo asigna severidad media-alta al perfil del contratista por el peso de los antecedentes judiciales y la opacidad parcial de la cadena societaria operativa.',
    },
    tiempo: {
      resumen: 'Plazos extendidos por reestructuración integral; entrega final cumplida.',
      detalle:
        'El cronograma original contemplaba entrega en 2018. Las reestructuraciones del contrato extendieron el plazo final a 2024, con entregas parciales por tramos.\n\nLas extensiones se justificaron formalmente en circunstancias post-Odebrecht, incluyendo el cambio de operador. La entrega física del corredor se completó dentro del plazo modificado.\n\nLa relación entre lo planeado y lo ejecutado, aunque desfavorable en el periodo inicial, se estabilizó en la última fase con cumplimiento contractual aceptable.',
    },
    transparencia: {
      resumen: 'Transparencia mejorada tras investigaciones; documentación pública completa post-2017.',
      detalle:
        'La fase precontractual y los primeros años de ejecución presentan opacidad documental significativa, particularmente en los soportes de los actos administrativos previos a 2014.\n\nA partir de las investigaciones de 2017 y la intervención de organismos de control, la trazabilidad documental mejoró sustancialmente. La fase final del contrato cumple estándares de transparencia.\n\nEl proceso es referenciado como caso de estudio en políticas anticorrupción nacionales y constituye un punto de inflexión en estándares de contratación de infraestructura.',
    },
    avance: {
      resumen: 'Entrega física completa del tramo; reconciliación financiera en curso.',
      detalle:
        'La entrega física del corredor vial se completó al 100% del alcance modificado. El avance real (65%) reportado en el modelo refleja la conciliación financiera y operativa pendiente, no la ejecución física.\n\nLa operación del corredor se encuentra en marcha con tráfico real registrado por las estaciones de peaje. Los indicadores operativos cumplen los estándares contractuales finales.\n\nLa reconciliación financiera retroactiva, asociada a las sentencias condenatorias, podría implicar ajustes patrimoniales sobre los flujos del concesionario.',
    },
  },
});

// ---- Proyecto Prueba ----
const aProyectoPrueba = buildAnalysis(mockProjects.find(p => p.id === 'proyecto-prueba')!, {
  capaScores: {
    capa1_documental: 96,
    capa2_coherencia: 97,
    capa3_clausulas: 95,
    capa4_semantico: 94,
    capa5_redes: 98,
  },
  aspectScores: { presupuesto: 96, contratista: 95, tiempo: 93, transparencia: 97, avance: 94 },
  hallazgos: {
    capa1_documental: [
      h('pp-1-1', 'low', 'Estudios previos completos y actualizados', 'Todos los estudios previos están completos, con referencias técnicas actualizadas al año 2023 y análisis de mercado local.', 'capa1_documental', 5),
    ],
    capa2_coherencia: [
      h('pp-2-1', 'low', 'Coherencia presupuestal verificada', 'El CDP, el RP y los valores contractuales son consistentes entre sí. No hay brechas ni adiciones injustificadas.', 'capa2_coherencia', 14),
    ],
    capa3_clausulas: [
      h('pp-3-1', 'low', 'Cláusulas estándar sin modificaciones desfavorables al Estado', 'El contrato no ha sido modificado. Las cláusulas de penalización y garantía están intactas.', 'capa3_clausulas', 22),
    ],
    capa4_semantico: [
      h('pp-4-1', 'low', 'APU dentro del rango de mercado distrital', 'Los Análisis de Precios Unitarios se ubican dentro del ±3% del promedio de contratos similares del IDU en 2024.', 'capa4_semantico', 38),
    ],
    capa5_redes: [
      h('pp-5-1', 'low', 'Cadena societaria sin vínculos de riesgo', 'No se detectan coincidencias entre el contratista y personas expuestas políticamente ni conflictos de interés declarables.', 'capa5_redes', 55),
    ],
  },
  detalles: {
    presupuesto: {
      resumen: 'Presupuesto ajustado a precios de mercado; selección abreviada generó ahorro del 3.5%.',
      detalle:
        'El presupuesto oficial del proceso era de $8.500 millones. La modalidad de selección abreviada permitió la participación de seis proponentes calificados, resultando en una oferta ganadora del 3.5% por debajo del techo, en $8.200 millones.\n\nTodos los APU del contrato fueron revisados por la interventoría antes de la firma y se ubican dentro del rango ±3% del promedio de contratos similares del IDU durante 2024.\n\nNo se identifican sobrecostos, ítems inflados ni desviaciones entre el CDP y el RP final. La estructura presupuestal es la esperada para una adecuación de parque de esta magnitud en Bogotá.',
    },
    contratista: {
      resumen: 'Empresa con 12 años de experiencia en espacio público distrital; sin antecedentes adversos.',
      detalle:
        'Constructora Urbana del Centro SAS lleva 12 años operando en contratos de espacio público en Bogotá. El RUP muestra 18 proyectos similares completados con calificación promedio de 4.7 sobre 5 en cumplimiento de plazo y calidad.\n\nLa cadena societaria es sencilla y verificable: dos socios personas naturales, sin vínculos con personas expuestas políticamente ni aportes a campañas en los últimos 3 ciclos electorales.\n\nLas garantías están vigentes con margen suficiente hasta el cierre del contrato y el asegurador tiene calificación AAA.',
    },
    tiempo: {
      resumen: 'Cronograma cumplido con 82% de avance en el mes 14 de 15 totales.',
      detalle:
        'El contrato tiene una duración de 15 meses. Al cierre del mes 14, el avance físico real es del 82%, lo que corresponde exactamente al cronograma maestro aprobado.\n\nNo se han tramitado prórrogas ni modificaciones de plazo. Las dos únicas modificaciones contractuales son de tipo técnico menor (ajuste de especificaciones de mobiliario urbano) con cuantía cero.\n\nLa interventoría proyecta entrega completa dentro del plazo original con un colchón estimado de 12 días hábiles.',
    },
    transparencia: {
      resumen: 'Publicación total en SECOP II; veeduría ciudadana activa desde el inicio.',
      detalle:
        'El 100% de la documentación contractual se encuentra publicada en SECOP II: estudios previos, pliego de condiciones, propuestas, acta de adjudicación, contrato, actas de inicio, informes mensuales de interventoría, registros fotográficos y actas de pago.\n\nUna veeduría ciudadana local con 14 integrantes sigue el proyecto desde el primer mes. Sus informes están disponibles en la plataforma de transparencia distrital.\n\nEste proceso fue citado como referente de buenas prácticas por la Secretaría de Transparencia de la Alcaldía Mayor.',
    },
    avance: {
      resumen: 'Avance real (82%) y reportado (84%) con desviación de 2 puntos — dentro de lo normal.',
      detalle:
        'La medición independiente del modelo sitúa el avance real en 82%. El reporte oficial es de 84%. La diferencia de 2 puntos corresponde al desfase habitual entre la ejecución física en campo y el cierre de las actas de medición.\n\nLa curva de avance es consistente con el cronograma maestro desde el primer mes. No se observan aceleraciones ni desaceleraciones atípicas.\n\nEl ritmo actual garantiza la entrega del parque completamente adecuado antes de la fecha contractual, con tiempo suficiente para el protocolo de recibo por parte de la entidad.',
    },
  },
});

// ---- Colegio Rural ----
const aColegioRural = buildAnalysis(mockProjects.find(p => p.id === 'colegio-rural')!, {
  capaScores: {
    capa1_documental: 92,
    capa2_coherencia: 95,
    capa3_clausulas: 90,
    capa4_semantico: 93,
    capa5_redes: 91,
  },
  aspectScores: { presupuesto: 94, contratista: 92, tiempo: 90, transparencia: 95, avance: 93 },
  hallazgos: {
    capa1_documental: [
      h('cr-1-1', 'low', 'Estudios previos completos y verificables', 'La documentación previa cumple los estándares y es verificable contra fuentes externas.', 'capa1_documental', 12),
    ],
    capa2_coherencia: [
      h('cr-2-1', 'low', 'Coherencia entre presupuesto, ejecución y reportes', 'Los valores presupuestados, ejecutados y reportados muestran consistencia interna.', 'capa2_coherencia', 28),
    ],
    capa3_clausulas: [
      h('cr-3-1', 'low', 'Cláusulas estándar de la Ley 80', 'El contrato adopta minutas estándar sin desviaciones que debiliten al Estado.', 'capa3_clausulas', 45),
    ],
    capa4_semantico: [
      h('cr-4-1', 'low', 'APU dentro de rangos de mercado', 'Los Análisis de Precios Unitarios se ubican dentro de las medianas regionales.', 'capa4_semantico', 67),
    ],
    capa5_redes: [
      h('cr-5-1', 'low', 'Sin patrones sospechosos en cadena societaria', 'Cadena societaria limpia, sin coincidencias relevantes con personas expuestas.', 'capa5_redes', 89),
    ],
  },
  detalles: {
    presupuesto: {
      resumen: 'Presupuesto coherente con precios de mercado; sin sobrecostos identificados.',
      detalle:
        'El presupuesto contratado de $3.450 millones se corresponde con los valores de referencia para construcciones escolares rurales en Cundinamarca durante 2024, según datos del FFIE.\n\nLos APU del contrato se ubican dentro del rango ±5% respecto a las medianas regionales. No se identifican ítems con desviación significativa.\n\nLa modalidad de selección abreviada permitió competencia efectiva entre cinco proponentes calificados, generando una baja del 4% sobre el presupuesto oficial inicial.',
    },
    contratista: {
      resumen: 'Constructora con trayectoria documentada; sin antecedentes adversos.',
      detalle:
        'Constructora Cundinamarca SAS cuenta con experiencia documentada en 12 proyectos escolares similares en los últimos 6 años. El RUP refleja calificaciones favorables en cumplimiento.\n\nLa cadena societaria es limpia y no presenta coincidencias con personas expuestas políticamente. Los aportes a campañas políticas son nulos en los tres últimos ciclos electorales.\n\nLas garantías están vigentes con cobertura suficiente y aseguradores con calificación adecuada.',
    },
    tiempo: {
      resumen: 'Cronograma cumplido al 90%; sin prórrogas activas.',
      detalle:
        'El cronograma original contempla entrega en junio de 2025. La ejecución actual se encuentra en el mes 14 de los 16 totales, con 78% de avance físico real.\n\nNo se han activado prórrogas. Las modificaciones contractuales suman dos, ambas técnicas y de cuantía cero, debidamente publicadas en SECOP II.\n\nLa interventoría reporta cumplimiento de hitos según el cronograma maestro.',
    },
    transparencia: {
      resumen: 'Cumplimiento total de publicación SECOP II.',
      detalle:
        'La totalidad de la documentación contractual se encuentra publicada en SECOP II, incluyendo soportes de pagos, informes mensuales de interventoría y registro fotográfico actualizado.\n\nLa veeduría ciudadana local del municipio reporta acceso pleno a la información solicitada y participación en visitas técnicas.\n\nEste proceso constituye un buen ejemplo de cumplimiento de los estándares de transparencia activa en contratación.',
    },
    avance: {
      resumen: 'Avance real (78%) y reportado (80%) consistentes — desviación mínima.',
      detalle:
        'La medición independiente del modelo, contrastando hitos contractuales y evidencia fotográfica, sitúa el avance real en 78%. El reporte oficial es de 80%.\n\nLa diferencia de 2 puntos porcentuales se explica por el rezago habitual entre la entrega de actas y la actualización del sistema, sin configurar señal de alerta.\n\nEl ritmo actual de obra proyecta entrega dentro del plazo contractual original.',
    },
  },
});

export const mockAnalyses: Record<string, AnalysisResult> = {
  'via-prosperidad': aViaProsperidad,
  'centros-poblados': aCentrosPoblados,
  'ungrd-carrotanques': aUngrd,
  'ruta-sol-2': aRutaSol,
  'proyecto-prueba': aProyectoPrueba,
  'colegio-rural': aColegioRural,
};

// =========================================================================
// CHAT mock responses
// =========================================================================

export const mockChatResponses: Record<string, string> = {
  'cuanto cuesta':
    'El contrato tiene un valor total de $432.000 millones COP, según el Registro Presupuestal. Sin embargo, el Certificado de Disponibilidad Presupuestal inicial era de $410.000 millones — el incremento de $22.000 millones no encuentra respaldo documentado en el expediente.',
  'quien es el contratista':
    'El contratista es la Unión Temporal Caribe Vial 2023 (NIT 901.234.567-8), representada legalmente por Carlos Andrés Mejía Ramírez. El representante legal mantuvo relación contractual directa con la entidad contratante entre 2018 y 2020.',
  'cual es el avance':
    'El avance reportado oficialmente es del 68%, pero la medición independiente del modelo, contrastando hitos contractuales con evidencia fotográfica e informes de interventoría, sitúa el avance real en torno al 34%. La brecha de 34 puntos porcentuales es una señal crítica.',
  'hay sobrecostos':
    'Se identifican señales de sobrecosto en tres ítems concentrados: concreto MR-45 (+18% sobre mercado), material seleccionado (+48% sobre referencia INVIAS) y acero de refuerzo. La desviación promedio en obra civil es del 18%.',
  'que es un otrosi':
    'Un otrosí es una modificación bilateral al contrato. En este expediente, el otrosí #4 eliminó la cláusula de penalización por mora del 0.5% diario, debilitando el instrumento de presión al cumplimiento.',
};

export const trendingMostSearched = ['via-prosperidad', 'centros-poblados', 'ruta-sol-2', 'ungrd-carrotanques'];
export const trendingHighestRisk = ['ungrd-carrotanques', 'centros-poblados', 'via-prosperidad', 'ruta-sol-2'];
export const trendingMostMentioned = ['centros-poblados', 'via-prosperidad', 'ungrd-carrotanques', 'colegio-rural'];
