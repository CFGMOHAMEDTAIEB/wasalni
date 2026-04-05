import { Button } from '../ui/button';
import { Card } from '../ui/card';

type SeatPosition = 'front' | 'back-left' | 'back-right' | 'back-middle';

interface SeatMapProps {
  selectedSeat?: SeatPosition;
  onSeatSelect: (seat: SeatPosition) => void;
  availableSeat?: boolean;
}

const SEAT_LABELS: Record<SeatPosition, string> = {
  'front': 'Devant',
  'back-left': 'Arrière gauche',
  'back-right': 'Arrière droit',
  'back-middle': 'Arrière centre',
};

export function SeatMap({ selectedSeat, onSeatSelect, availableSeat = true }: SeatMapProps) {
  if (!availableSeat) {
    return (
      <Card className="p-4 bg-gray-50">
        <p className="text-center text-sm text-gray-600">Aucune place disponible</p>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {/* SVG Car Top View */}
      <div className="flex justify-center mb-6">
        <svg
          viewBox="0 0 300 400"
          className="w-full max-w-xs border-2 border-gray-300 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 p-4"
        >
          {/* Car body */}
          <rect x="50" y="20" width="200" height="360" rx="20" fill="none" stroke="#333" strokeWidth="2" />

          {/* Windshield */}
          <path d="M 70 50 L 230 50 L 210 90 L 90 90 Z" fill="none" stroke="#333" strokeWidth="2" opacity="0.5" />

          {/* Front seats (driver + passenger) */}
          {/* Driver seat */}
          <g>
            <rect
              x="70"
              y="100"
              width="50"
              height="60"
              rx="4"
              fill={selectedSeat === 'front' ? '#3b82f6' : '#e5e7eb'}
              stroke={selectedSeat === 'front' ? '#1e40af' : '#9ca3af'}
              strokeWidth="2"
              className="cursor-pointer hover:fill-blue-100 transition"
              onClick={() => onSeatSelect('front')}
            />
            <circle cx="95" cy="120" r="4" fill="#666" />
            <circle cx="95" cy="150" r="4" fill="#666" />
            <text x="95" y="180" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
              Conducteur
            </text>
          </g>

          {/* Back row */}
          {/* Back Left */}
          <g>
            <rect
              x="70"
              y="210"
              width="50"
              height="60"
              rx="4"
              fill={selectedSeat === 'back-left' ? '#10b981' : '#e5e7eb'}
              stroke={selectedSeat === 'back-left' ? '#047857' : '#9ca3af'}
              strokeWidth="2"
              className="cursor-pointer hover:fill-green-100 transition"
              onClick={() => onSeatSelect('back-left')}
            />
            <circle cx="95" cy="230" r="4" fill="#666" />
            <circle cx="95" cy="260" r="4" fill="#666" />
            <text x="95" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#333">
              Gauche
            </text>
          </g>

          {/* Back Middle */}
          <g>
            <rect
              x="125"
              y="210"
              width="50"
              height="60"
              rx="4"
              fill={selectedSeat === 'back-middle' ? '#f59e0b' : '#e5e7eb'}
              stroke={selectedSeat === 'back-middle' ? '#d97706' : '#9ca3af'}
              strokeWidth="2"
              className="cursor-pointer hover:fill-amber-100 transition"
              onClick={() => onSeatSelect('back-middle')}
            />
            <circle cx="150" cy="230" r="4" fill="#666" />
            <circle cx="150" cy="260" r="4" fill="#666" />
            <text x="150" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#333">
              Centre
            </text>
          </g>

          {/* Back Right */}
          <g>
            <rect
              x="180"
              y="210"
              width="50"
              height="60"
              rx="4"
              fill={selectedSeat === 'back-right' ? '#ef4444' : '#e5e7eb'}
              stroke={selectedSeat === 'back-right' ? '#dc2626' : '#9ca3af'}
              strokeWidth="2"
              className="cursor-pointer hover:fill-red-100 transition"
              onClick={() => onSeatSelect('back-right')}
            />
            <circle cx="205" cy="230" r="4" fill="#666" />
            <circle cx="205" cy="260" r="4" fill="#666" />
            <text x="205" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#333">
              Droit
            </text>
          </g>

          {/* Rear */}
          <path d="M 70 310 L 230 310 Q 230 320 150 330 Q 70 320 70 310 Z" fill="none" stroke="#333" strokeWidth="2" opacity="0.5" />
        </svg>
      </div>

      {/* Selection Display */}
      {selectedSeat && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-center">
            <span className="font-semibold">Siège sélectionné:</span>{' '}
            <span className="text-blue-700 font-medium">{SEAT_LABELS[selectedSeat]}</span>
          </p>
        </Card>
      )}

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="text-xs justify-center"
          onClick={() => onSeatSelect('front')}
        >
          🔵 Devant
        </Button>
        <Button
          variant="outline"
          className="text-xs justify-center"
          onClick={() => onSeatSelect('back-left')}
        >
          🟢 Arrière G.
        </Button>
        <Button
          variant="outline"
          className="text-xs justify-center"
          onClick={() => onSeatSelect('back-middle')}
        >
          🟡 Arrière C.
        </Button>
        <Button
          variant="outline"
          className="text-xs justify-center"
          onClick={() => onSeatSelect('back-right')}
        >
          🔴 Arrière D.
        </Button>
      </div>
    </div>
  );
}
