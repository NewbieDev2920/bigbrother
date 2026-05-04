import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ArrowLeft } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { HeroSearch } from '@/components/search/HeroSearch';
import { UploadDropzone } from '@/components/search/UploadDropzone';
import { TrendingTabs } from '@/components/project/TrendingTabs';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { RiskGauge } from '@/components/project/RiskGauge';
import { ProjectInfo } from '@/components/project/ProjectInfo';
import { MediaPanel } from '@/components/project/MediaPanel';
import { PdfPreview } from '@/components/project/PdfPreview';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { AnalysisCard } from '@/components/project/AnalysisCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ASPECT_KEYS } from '@/types/analysis';
import type { AspectKey } from '@/types/analysis';

export default function HomePage() {
  const { currentProject, currentAnalysis, clear } = useAnalysisStore();

  return (
    <PageShell contained={false}>
      <AnimatePresence mode="wait">
        {!currentAnalysis ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-7xl px-4"
          >
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 py-10 text-center"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="rounded-2xl bg-navy-50 p-3 text-navy-700">
                  <Scale size={32} strokeWidth={2} />
                </span>
                <h1 className="font-serif text-4xl text-navy-900 sm:text-5xl">Dania</h1>
                <p className="text-sm italic text-navy-300">"Dios es mi juez"</p>
                <p className="mt-2 max-w-xl text-sm text-navy-700">
                  Plataforma para detectar señales en contratación pública colombiana mediante un
                  modelo de IA de cinco capas.
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-4">
                <HeroSearch />
                <div className="flex w-full max-w-2xl items-center gap-3 text-xs uppercase tracking-wider text-navy-300">
                  <span className="h-px flex-1 bg-canvas-border" />
                  <span>o</span>
                  <span className="h-px flex-1 bg-canvas-border" />
                </div>
                <UploadDropzone />
              </div>
            </motion.section>

            <div className="mt-8">
              <TrendingTabs />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col"
          >
            {/* Header / Navigation back */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-canvas-border bg-canvas/80 px-6 py-3 backdrop-blur-md">
                <Button variant="ghost" size="sm" onClick={clear} className="gap-2">
                  <ArrowLeft size={16} /> Analizar otro documento
                </Button>
                <span className="text-xs font-medium text-navy-300 font-mono">ID: {currentProject?.id}</span>
            </div>

            <ProjectHeader project={currentProject!} />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
              {/* Top section: Info + Risk */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="flex flex-col items-center gap-4 p-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-navy-300">
                    Riesgo de corrupción
                  </h2>
                  <RiskGauge score={currentProject!.riesgoCorrupcion} />
                  <div className="w-full">
                    <div className="mb-1 flex items-center justify-between text-xs text-navy-300">
                      <span>Avance real</span>
                      <span className="font-mono text-navy-700">
                        {currentProject!.avanceReal || 0}% (reportado {currentProject!.avanceReportado || 0}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-canvas-border">
                      <div
                        className="h-full rounded-full bg-navy-700 transition-all"
                        style={{ width: `${currentProject!.avanceReal || 0}%` }}
                      />
                    </div>
                  </div>
                  <ProjectInfo project={currentProject!} analysis={currentAnalysis} />
                </Card>
                <MediaPanel project={currentProject!} />
              </div>

              {/* Middle section: PDF + Chat */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(320px,420px)]">
                <PdfPreview url={currentProject!.pdfUrl} title={`Contrato — ${currentProject!.nombre}`} />
                <ChatPanel projectId={currentProject!.id} documentName={currentProject!.nombre} />
              </div>

              {/* Bottom: Analysis cards */}
              <div>
                <h2 className="mb-3 font-serif text-lg text-navy-900">Análisis por aspectos</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {ASPECT_KEYS.map((aspect: AspectKey) => (
                    <AnalysisCard
                      key={aspect}
                      projectId={currentProject!.id}
                      aspect={aspect}
                      score={currentAnalysis.aspectos?.[aspect] || { score: 0, resumen: 'N/A', hallazgos: [], chartData: {} }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
