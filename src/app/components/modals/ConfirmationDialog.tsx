import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import type { TempBookingFormData } from '@/app/data/hotels-data/hotelTypes';

interface ConfirmationDialogStrings {
  room: string;
  roomNumberLabel: string;
  floorLabel: string;
  checkIn: string;
  checkOut: string;
  mealType: string;
  additionalServices: string;
  totalCost: string;
  confirmTitle: string;
  confirmDesc: string;
  warning: string;
  cancel: string;
  confirm: string;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  t: ConfirmationDialogStrings;
  roomType: string;
  roomNumber: string | undefined;
  showFloor: boolean;
  floor: number | undefined;
  language: string;
  tempBookingForm: TempBookingFormData;
  selectedBookingMealType?: { label: string; labelEn: string } | null;
  additionalBookingServices?: { name: string; nameEn: string }[];
  calculateTotalDisplay: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  t,
  roomType,
  roomNumber,
  showFloor,
  floor,
  language,
  tempBookingForm,
  selectedBookingMealType,
  additionalBookingServices,
  calculateTotalDisplay,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.confirmTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">{t.confirmDesc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3 border border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.room}:</span>
              <span>{roomType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.roomNumberLabel}:</span>
              <span>#{roomNumber}</span>
            </div>
            {showFloor && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.floorLabel}:</span>
                <span>{floor}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.checkIn}:</span>
              <span>
                {tempBookingForm.checkInDate &&
                  format(new Date(tempBookingForm.checkInDate), 'PP', {
                    locale: language === 'ru' ? ru : enUS,
                  })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.checkOut}:</span>
              <span>
                {tempBookingForm.checkOutDate &&
                  format(new Date(tempBookingForm.checkOutDate), 'PP', {
                    locale: language === 'ru' ? ru : enUS,
                  })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.mealType}:</span>
              <span>
                {language === 'ru'
                  ? selectedBookingMealType?.label
                  : selectedBookingMealType?.labelEn}
              </span>
            </div>
            {additionalBookingServices && additionalBookingServices.length > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">{t.additionalServices}:</span>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {additionalBookingServices.map((service, idx) => (
                    <li key={idx}>{language === 'ru' ? service.name : service.nameEn}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-border">
              <span>{t.totalCost}:</span>
              <span className="text-primary">₽{calculateTotalDisplay.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{t.warning}</span>
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1 border-border">
            {t.cancel}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
          >
            {t.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
