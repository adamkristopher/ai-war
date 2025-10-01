import { useEffect, useRef } from 'react';
import { GameEvent } from '../../shared/types/index';

interface EventLogProps {
  events: GameEvent[];
}

export function EventLog({ events }: EventLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-lg font-bold text-white">Event Log</h3>
      </div>
      <div
        ref={logRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-0"
      >
        {events.slice(-50).map((event) => (
          <div
            key={event.id}
            className={`text-sm p-2 rounded ${
              event.type === 'ATTACK' ? 'bg-red-900 text-red-100' :
              event.type === 'ELIMINATION' ? 'bg-purple-900 text-purple-100' :
              event.type === 'WARNING' ? 'bg-yellow-900 text-yellow-100' :
              'bg-gray-700 text-gray-100'
            }`}
          >
            {event.message}
          </div>
        ))}
      </div>
    </div>
  );
}
