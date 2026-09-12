import { X } from 'lucide-react';

interface FloorSelectModalProps {
  isOpen: boolean;
  floorOptions: number[];
  language: string;
  selectedFloor: number | null;
  onSelectFloor: (floor: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function FloorSelectModal({
  isOpen,
  floorOptions,
  language,
  selectedFloor,
  onSelectFloor,
  onConfirm,
  onClose,
}: FloorSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl text-foreground font-medium">
            {language === 'ru' ? 'Выберите этаж' : 'Choose a floor'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === 'ru'
              ? 'Выберите этаж, на котором вы хотите забронировать комнату.'
              : 'Select the floor you would like to book a room on.'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {floorOptions.map((floorOption: number) => (
              <button
                key={floorOption}
                type="button"
                className={`w-full rounded-lg border px-4 py-2 text-left transition ${
                  selectedFloor === floorOption
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-background text-foreground'
                }`}
                onClick={() => onSelectFloor(floorOption)}
              >
                {language === 'ru' ? 'Этаж' : 'Floor'} {floorOption.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={selectedFloor === null}
            onClick={onConfirm}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'ru' ? 'Подтвердить' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
