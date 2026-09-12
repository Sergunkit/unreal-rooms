import type { ReactNode } from 'react';
import { Calendar, X } from 'lucide-react';

interface BookingFlowModalProps {
  isOpen: boolean;
  language: string;
  onClose: () => void;
  children: ReactNode;
}

export function BookingFlowModal({ isOpen, language, onClose, children }: BookingFlowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl text-foreground font-medium">
              {language === 'ru' ? 'Бронирование номера' : 'Room Booking'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
