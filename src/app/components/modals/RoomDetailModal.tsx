import { Maximize2, Users, BedDouble, Sparkle, X } from 'lucide-react';
import type { Room } from '@/app/data/hotels-data/hotelTypes';

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  language: string;
  onClose: () => void;
  onBook: (room: Room) => void;
}

export function RoomDetailModal({ room, isOpen, language, onClose, onBook }: RoomDetailModalProps) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full h-full max-w-6xl max-h-[95vh] overflow-hidden flex relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-primary rounded-full hover:bg-primary/80 transition-colors z-20"
          id="room-modal-close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="w-[57.5%] h-full relative">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>
        <div className="w-[42.5%] flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl text-foreground font-semibold">
              {language === 'ru' ? room.name : room.nameEn}
            </h3>
          </div>
          <div className="space-y-4 mb-6 text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5" />
                <span>{room.size} м²</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>
                  {room.capacity} {language === 'ru' ? 'гостя' : 'guests'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="w-5 h-5" />
              <span>{language === 'ru' ? room.beds : room.bedsEn}</span>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-lg text-foreground mb-3">
              {language === 'ru' ? 'Удобства' : 'Amenities'}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {(language === 'ru' ? room.amenities : room.amenitiesEn).map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <Sparkle className="w-4 h-4 text-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
            <div>
              <div className="text-3xl text-primary font-semibold">${room.price}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ru' ? 'за ночь' : 'per night'}
              </div>
            </div>
            <button
              onClick={() => onBook(room)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              {language === 'ru' ? 'Забронировать' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
