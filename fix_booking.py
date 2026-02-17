#!/usr/bin/env python3
# Fix BookingFormPage to load saved booking parameters

with open('src/app/pages/BookingFormPage.tsx', 'r') as f:
    content = f.read()

# 1. Add playerStatus to useGame destructuring
old_use = "const { setCurrentBooking, addVisitedHotel } = useGame();"
new_use = "const { setCurrentBooking, addVisitedHotel, playerStatus } = useGame();\n\n  // Get saved booking if exists\n  const savedBooking = playerStatus.currentBooking;"

if old_use in content:
    content = content.replace(old_use, new_use)
    print("Added playerStatus to useGame")
else:
    print("ERROR: Could not find useGame line")

# 2. Change roomType useState to load from savedBooking
old_room = "const [roomType, setRoomType] = useState(roomTypes[0]?.value || 'standard');"
new_room = "const [roomType, setRoomType] = useState(savedBooking ? String(savedBooking.roomId) : (roomTypes[0]?.value || 'standard'));"

if old_room in content:
    content = content.replace(old_room, new_room)
    print("Updated roomType state")
else:
    print("ERROR: Could not find roomType line")

# 3. Change mealType useState to load from savedBooking  
old_meal = "const [mealType, setMealType] = useState(mealTypes[0]?.value || 'no-meal');"
new_meal = "const [mealType, setMealType] = useState(savedBooking?.mealType || (mealTypes[0]?.value || 'no-meal'));"

if old_meal in content:
    content = content.replace(old_meal, new_meal)
    print("Updated mealType state")
else:
    print("ERROR: Could not find mealType line")

# 4. Change needTransfer useState to load from savedBooking
old_transfer = "const [needTransfer, setNeedTransfer] = useState(false);"
new_transfer = "const [needTransfer, setNeedTransfer] = useState(savedBooking?.additionalServices?.includes('Cater-transfer') || false);"

if old_transfer in content:
    content = content.replace(old_transfer, new_transfer)
    print("Updated needTransfer state")
else:
    print("ERROR: Could not find needTransfer line")

# 5. Change selectedServices useState to load from savedBooking
old_services = "const [selectedServices, setSelectedServices] = useState<string[]>([]);"
new_services = "const [selectedServices, setSelectedServices] = useState<string[]>(savedBooking?.additionalServices || []);"

if old_services in content:
    content = content.replace(old_services, new_services)
    print("Updated selectedServices state")
else:
    print("ERROR: Could not find selectedServices line")

with open('src/app/pages/BookingFormPage.tsx', 'w') as f:
    f.write(content)

print("Done!")
