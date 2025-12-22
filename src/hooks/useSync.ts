import { useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useCradleStore } from '../store/cradle/useCradleStore';

export function useSync() {
  const events = useCradleStore((state) => state.events);
  const syncComplete = useCradleStore((state) => state.syncComplete);

  useEffect(() => {
    const syncPendingEvents = async () => {
      const unsynced = events.filter(e => !e.isSynced);
      
      if (unsynced.length === 0) return;

      for (const event of unsynced) {
        const { error } = await supabase
          .from('care_events')
          .insert({
            correlation_id: event.id,
            event_type: event.type,
            timestamp: new Date(event.timestamp).toISOString(),
            metadata: event.metadata,
          });

        if (!error) {
          syncComplete(event.id);
          console.log(`[Cradle Sync] Committed event: ${event.id}`);
        } else {
          console.error(`[Cradle Sync] Error:`, error.message);
        }
      }
    };

    syncPendingEvents();
  }, [events, syncComplete]);
}