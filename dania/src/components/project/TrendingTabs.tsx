import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ai } from '@/services/ai';
import { ProjectCard } from './ProjectCard';
import { Tabs } from '@/components/ui/Tabs';
import { Spinner } from '@/components/ui/Spinner';

const tabs = [
  { key: 'masBuscados', label: 'Más buscados' },
  { key: 'mayorRiesgo', label: 'Mayor riesgo' },
  { key: 'masMencionados', label: 'Más mencionados' },
];

export function TrendingTabs() {
  const [active, setActive] = useState('masBuscados');
  const { data, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => ai.getTrending(),
  });

  const list = data?.[active as keyof typeof data] ?? [];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-navy-900">Trending</h2>
        <Tabs items={tabs} active={active} onChange={setActive} />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}
