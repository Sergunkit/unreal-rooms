interface BookingCompleteModalProps {
  isOpen: boolean;
  bookingResult?: 'safe' | 'unsafe';
  bookingConfirmed: string;
  endBookingMessage: string;
  endBookingMessageEn: string;
  endWrongBookingMessage: string;
  endWrongBookingMessageEn: string;
  language: string;
}

export function BookingCompleteModal({
  isOpen,
  bookingResult,
  bookingConfirmed,
  endBookingMessage,
  endBookingMessageEn,
  endWrongBookingMessage,
  endWrongBookingMessageEn,
  language,
}: BookingCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl text-foreground font-medium mb-2">{bookingConfirmed}</h3>
          <p className="text-muted-foreground">
            {bookingResult === 'unsafe'
              ? language === 'ru'
                ? endWrongBookingMessage
                : endWrongBookingMessageEn
              : language === 'ru'
                ? endBookingMessage
                : endBookingMessageEn}
          </p>
        </div>
      </div>
    </div>
  );
}
