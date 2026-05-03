import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { HeroSearch } from '@/components/search/HeroSearch';
import { UploadDropzone } from '@/components/search/UploadDropzone';
import { TrendingTabs } from '@/components/project/TrendingTabs';

export default function HomePage() {
  return (
    <PageShell>
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
            Plataforma para detectar señales en contratación pública colombiana mediante un modelo
            de IA de cinco capas.
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
    </PageShell>
  );
}
