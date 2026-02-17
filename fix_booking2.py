#!/usr/bin/env python3
# Add tempBookingFormData to GameContext and BookingFormPage

# 1. Update GameContext.tsx
with open('src/app/contexts/GameContext.tsx', 'r') as f:
    content = f.read()

# Add TempBookingFormData interface
old_interface = """/**
 * Статус бронирования комнаты
 */
export interface RoomBooking {"""

new_interface = """/**
 * Временные данные формы бронирования (сохраняются между переходами)
 */
export interface TempBookingFormData {
  guests: number;
  rooms: number;
  roomType: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  mealType: string;
  needTransfer: boolean;
  checkInTime: string;
  selectedServices: string[];
}

/**
 * Статус бронирования комнаты
 */
export interface RoomBooking {"""

content = content.replace(old_interface, new_interface)

# Add tempBookingFormData to PlayerStatus
old_status = """/**
 * Полный статус игрока
 */
export interface PlayerStatus {
  id: string;
  visitedHotels: VisitedHotel[];
  currentBooking: RoomBooking | null;
  collectedArtefacts: CollectedArtefact[];
  inventory: string[];
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
}"""

new_status = """/**
 * Полный статус игрока
 */
export interface PlayerStatus {
  id: string;
  visitedHotels: VisitedHotel[];
  currentBooking: RoomBooking | null;
  tempBookingForm: TempBookingFormData | null;
  collectedArtefacts: CollectedArtefact[];
  inventory: string[];
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
}"""

content = content.replace(old_status, new_status)

# Add methods for temp booking form
old_methods = """  // Методы для работы с бронированиями
  setCurrentBooking: (booking: RoomBooking | null) => void;
  clearCurrentBooking: () => void;"""

new_methods = """  // Методы для работы с бронированиями
  setCurrentBooking: (booking: RoomBooking | null) => void;
  clearCurrentBooking: () => void;
  // Методы для временных данных формы бронирования
  saveTempBookingForm: (data: TempBookingFormData) => void;
  clearTempBookingForm: () => void;
  getTempBookingForm: () => TempBookingFormData | null;"""

content = content.replace(old_methods, new_methods)

# Add initial value for tempBookingForm in initialPlayerStatus
old_initial = """const initialPlayerStatus: PlayerStatus = {
  id: 'local-player',
  visitedHotels: [],
  currentBooking: null,
  collectedArtefacts: [],
  inventory: [],
  stats: {"""

new_initial = """const initialPlayerStatus: PlayerStatus = {
  id: 'local-player',
  visitedHotels: [],
  currentBooking: null,
  tempBookingForm: null,
  collectedArtefacts: [],
  inventory: [],
  stats: {"""

content = content.replace(old_initial, new_initial)

# Add methods implementation after clearCurrentBooking
old_clear = """  /**
   * Очистить текущее бронирование
   */
  const clearCurrentBooking = () => {
    setPlayerStatus((prev) => ({
      ...prev,
      currentBooking: null,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Добавить посещённый отель
   */"""

new_clear = """  /**
   * Очистить текущее бронирование
   */
  const clearCurrentBooking = () => {
    setPlayerStatus((prev) => ({
      ...prev,
      currentBooking: null,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Сохранить временные данные формы бронирования
   */
  const saveTempBookingForm = (data: TempBookingFormData) => {
    setPlayerStatus((prev) => ({
      ...prev,
      tempBookingForm: data,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Очистить временные данные формы бронирования
   */
  const clearTempBookingForm = () => {
    setPlayerStatus((prev) => ({
      ...prev,
      tempBookingForm: null,
      updatedAt: new Date().toISOString(),
    }));
  };

  /**
   * Получить временные данные формы бронирования
   */
  const getTempBookingForm = () => {
    return playerStatus.tempBookingForm;
  };

  /**
   * Добавить посещённый отель
   */"""

content = content.replace(old_clear, new_clear)

# Add methods to provider value
old_provider = """        setCurrentBooking,
        clearCurrentBooking,
        addVisitedHotel,"""

new_provider = """        setCurrentBooking,
        clearCurrentBooking,
        saveTempBookingForm,
        clearTempBookingForm,
        getTempBookingForm,
        addVisitedHotel,"""

content = content.replace(old_provider, new_provider)

with open('src/app/contexts/GameContext.tsx', 'w') as f:
    f.write(content)

print("Updated GameContext.tsx")

# 2. Update BookingFormPage.tsx to use temp booking form
with open('src/app/pages/BookingFormPage.tsx', 'r') as f:
    content = f.read()

# Update useGame to include temp booking methods
old_use = "const { setCurrentBooking, addVisitedHotel, playerStatus } = useGame();"
new_use = "const { setCurrentBooking, addVisitedHotel, playerStatus, saveTempBookingForm, tempBookingForm } = useGame();\n\n  // Get temp booking form data if exists\n  const tempForm = playerStatus.tempBookingForm;"

content = content.replace(old_use, new_use)

# Update guests state
old_guests = "const [guests, setGuests] = useState(2);"
new_guests = "const [guests, setGuests] = useState(tempForm?.guests || 2);"
content = content.replace(old_guests, new_guests)

# Update rooms state
old_rooms = "const [rooms, setRooms] = useState(1);"
new_rooms = "const [rooms, setRooms] = useState(tempForm?.rooms || 1);"
content = content.replace(old_rooms, new_rooms)

# Update checkInDate state
old_checkin = "const [checkInDate, setCheckInDate] = useState<Date>();"
new_checkin = "const [checkInDate, setCheckInDate] = useState<Date | undefined>(tempForm?.checkInDate ? new Date(tempForm.checkInDate) : undefined);"
content = content.replace(old_checkin, new_checkin)

# Update checkOutDate state  
old_checkout = "const [checkOutDate, setCheckOutDate] = useState<Date>();"
new_checkout = "const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(tempForm?.checkOutDate ? new Date(tempForm.checkOutDate) : undefined);"
content = content.replace(old_checkout, new_checkout)

# Update checkInTime state
old_time = "const [checkInTime, setCheckInTime] = useState('14:00');"
new_time = "const [checkInTime, setCheckInTime] = useState(tempForm?.checkInTime || '14:00');"
content = content.replace(old_time, new_time)

# Add useEffect to save form data when it changes
# Find where handleContinue is defined and add useEffect before it
old_continue = """  const handleContinue = () => {
    if (!checkInDate || !checkOutDate) {"""

new_continue = """  // Save form data when it changes
  useEffect(() => {
    saveTempBookingForm({
      guests,
      rooms,
      roomType,
      checkInDate: checkInDate?.toISOString() || null,
      checkOutDate: checkOutDate?.toISOString() || null,
      mealType,
      needTransfer,
      checkInTime,
      selectedServices,
    });
  }, [guests, rooms, roomType, checkInDate, checkOutDate, mealType, needTransfer, checkInTime, selectedServices]);

  const handleContinue = () => {
    if (!checkInDate || !checkOutDate) {"""

content = content.replace(old_continue, new_continue)

# Add useState import if not present
if "import { useState, useEffect }" not in content:
    content = content.replace("import { useState }", "import { useState, useEffect }")

with open('src/app/pages/BookingFormPage.tsx', 'w') as f:
    f.write(content)

print("Updated BookingFormPage.tsx")
print("Done!")
