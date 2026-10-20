import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useEarthquakes } from '@/hooks/useEarthquakes';
import { useEonetEvents } from '@/hooks/useEonetEvents';
import { useFires } from '@/hooks/useFirms';
import type { NormalizedEvent } from '@/types/common';
import type { UseEarthquakesResult } from '@/hooks/useEarthquakes';
import type { UseEonetEventsResult } from '@/hooks/useEonetEvents';
import type { UseFiresResult } from '@/hooks/useFirms';
import { useToast } from '@/components/ui/Toast';

interface DataContextValue {
  earthquakes: UseEarthquakesResult;
  eonet: UseEonetEventsResult;
  fires: UseFiresResult;
  /** All events merged for global search + analytics. */
  allEvents: NormalizedEvent[];
  /** Refresh every source at once. */
  refreshAll: () => void;
  lastUpdated: number | null;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useDataStore(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataStore must be used within DataProvider');
  return ctx;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const earthquakes = useEarthquakes();
  const eonet = useEonetEvents(undefined, 'open', 500);
  const fires = useFires();
  const { toast } = useToast();

  const refreshAll = useCallback(() => {
    earthquakes.refresh();
    eonet.refresh();
    fires.refresh();
    toast('Refreshing all data sources', { variant: 'info' });
  }, [earthquakes, eonet, fires, toast]);

  const allEvents = useMemo<NormalizedEvent[]>(() => {
    return [...earthquakes.events, ...eonet.events, ...fires.events];
  }, [earthquakes.events, eonet.events, fires.events]);

  const lastUpdated = useMemo(() => {
    const candidates = [earthquakes.lastUpdated, eonet.lastUpdated, fires.lastUpdated].filter(
      (v): v is number => v != null,
    );
    return candidates.length ? Math.max(...candidates) : null;
  }, [earthquakes.lastUpdated, eonet.lastUpdated, fires.lastUpdated]);

  const value = useMemo<DataContextValue>(
    () => ({ earthquakes, eonet, fires, allEvents, refreshAll, lastUpdated }),
    [earthquakes, eonet, fires, allEvents, refreshAll, lastUpdated],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
