import { MessageSquare, Sparkles, X } from 'lucide-react';
import type { FeedBack } from '@/app/data/hotels-data/hotelTypes';
import { MarkdownText } from '../MarkdownText';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbacks: FeedBack[];
  language: string;
}

export function FeedbackModal({ isOpen, onClose, feedbacks, language }: FeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl text-foreground font-medium">
              {language === 'ru' ? 'Отзывы' : 'Feedback'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            {feedbacks.map((feedback, index) => (
              <div key={feedback.id}>
                <p className="text-sm font-medium text-foreground mb-2">{feedback.author}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <MarkdownText text={language === 'ru' ? feedback.text : feedback.textEn} />
                </p>
                {index < feedbacks.length - 1 && (
                  <div className="flex items-center justify-center my-6">
                    <Sparkles className="w-5 h-5 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
