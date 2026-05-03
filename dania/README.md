# Dania — Frontend

> Plataforma para detección de señales de corrupción en contratación pública colombiana mediante un modelo de IA de 5 capas.
>
> **Dania** (דָּנִיָּה — "Dios es mi juez")

SPA en React + TypeScript con datos mock. Diseñada para que la conexión al backend real sea cambiar una variable de entorno y completar `src/services/ai/realAdapter.ts` — sin tocar componentes.

## Setup

```bash
npm install
npm run dev
```

Abrir http://localhost:5173.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (paleta navy/royal/ember + rangos de riesgo)
- React Router v6
- TanStack Query
- Zustand (con `persist` para historial, seguidos, chat)
- Recharts
- react-pdf
- Framer Motion
- lucide-react

## Estructura

- `src/routes/` — 4 vistas: Home, Project, Detail, History
- `src/services/ai/` — `aiAdapter` interface + `mockAdapter` + `realAdapter` placeholder
- `src/data/mock.ts` — 5 proyectos con análisis completos
- `src/store/` — stores Zustand persistidos en localStorage
- `src/components/` — layout, ui primitives, charts, project, chat, search

## Activar backend real

1. Implementar el backend respetando los contratos de `aiAdapter.ts`.
2. En `.env.local`:
   ```
   VITE_USE_MOCK_AI=false
   VITE_API_URL=https://api.dania.example
   VITE_DANIA_KEY=...
   ```
3. Si el backend devuelve campos con otros nombres, hacer el mapeo dentro de `realAdapter.ts`.

## Lenguaje

El frontend nunca afirma "esto es corrupto" o "fraude confirmado". Solo "señales detectadas", "posibles inconsistencias", "anomalía identificada". El modelo sugiere, no juzga.

## Licencia

Proyecto académico — Universidad de los Andes, Introducción a la Ingeniería de Sistemas.

Equipo: Carlos de la Rosa, Juan Rodriguez Vivas, Samuel Jiménez, Jhonatan Forero, Andrés Felipe Osorio.
