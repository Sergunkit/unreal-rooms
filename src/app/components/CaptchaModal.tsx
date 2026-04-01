/* eslint-disable prettier/prettier */
import { Search, X } from 'lucide-react';

import type { Captcha } from '../data/hotels-data/hotelTypes';

export type CaptchaMode = 'sequence' | 'toggle';

export interface CaptchaModalProps {
  open: boolean;
  onClose: () => void;
  captcha: Captcha;
  selection: string[];
  setSelection: React.Dispatch<React.SetStateAction<string[]>>;
  onConfirm: () => void;
  errorMessage?: string;
  title?: string;
  mode?: CaptchaMode;
  showSelection?: boolean;
  confirmLabel?: string;
  captchaReason?: 'alien' | 'human';  // ← Новый проп
}

export function CaptchaModal({
  open,
  onClose,
  captcha,
  selection,
  setSelection,
  onConfirm,
  errorMessage,
  title,
  mode = 'sequence',
  showSelection = true,
  confirmLabel,
  captchaReason = 'human',  // ← По умолчанию human
}: CaptchaModalProps) {
  if (!open) return null;

  // Выбираем items и вопрос в зависимости от типа капчи
  const items = captchaReason === 'alien' 
    ? (captcha.alienItems || captcha.items)
    : captcha.items;
  
  const question = captchaReason === 'alien'
    ? (captcha.alienQuestion || captcha.question)
    : captcha.question;

  const handleItemClick = (itemId: string) => {
    setSelection((prev) => {
      if (mode === 'toggle') {
        return prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      }
      // sequence mode: preserve duplicates (for codes like 1911)
      return [...prev, itemId];
    });
  };

  return (
    <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full my-4">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-primary" />
            <h2 className="text-2xl text-foreground font-medium">{title || 'Captcha'}</h2>
          </div>
          <button
            onClick={() => {
              onClose();
              setSelection([]);
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <p className="text-sm text-foreground mb-4">{question}</p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}

          {showSelection && selection.length > 0 && (
            <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm text-primary font-medium mb-2">
                {mode === 'sequence' ? 'Selected sequence:' : 'Selected:'}
              </p>
              {mode === 'sequence' ? (
                <div className="flex gap-2 flex-wrap">
                  {selection.map((id, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded font-mono text-sm"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              ) : (
                <span>{selection.join(', ')}</span>
              )}
              <button
                onClick={() => setSelection([])}
                className="text-xs text-primary hover:underline mt-2"
              >
                Clear
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            {items.map((item) => {
              const isSelected = selection.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/20'
                      : 'border-secondary hover:border-primary/50'
                  }`}
                >
                  <div className="w-full aspect-[1/1] bg-secondary flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {item.label && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                      {item.label}
                    </div>
                  )}
                  {isSelected && mode === 'toggle' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                onClose();
                setSelection([]);
              }}
              className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {confirmLabel || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
