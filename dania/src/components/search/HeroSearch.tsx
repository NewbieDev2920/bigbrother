import { useState } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults } from './SearchResults';

export function HeroSearch() {
  const [value, setValue] = useState('');
  const { data, isFetching } = useSearch(value);
  const showResults = value.trim().length >= 2;

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" size={18} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar contrato, entidad, NIT, municipio..."
          className="h-14 w-full rounded-2xl border border-canvas-border bg-canvas-card pl-12 pr-4 text-base text-navy-900 shadow-card placeholder:text-navy-300 focus:border-navy-500"
          aria-label="Buscar proyecto"
        />
      </div>
      {showResults && (
        <SearchResults
          query={value}
          loading={isFetching}
          exactMatch={data?.exactMatch ?? null}
          similar={data?.similar ?? []}
        />
      )}
    </div>
  );
}
