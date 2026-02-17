#!/usr/bin/env python3
import re

# Read file
with open('src/app/pages/HotelDetailPage.tsx', 'r') as f:
    content = f.read()

# 1. Add isSafeToBook logic after hotel definition
old_line = "const hotel = hotelData[id as keyof typeof hotelData];"
new_code = """const hotel = hotelData[id as keyof typeof hotelData];
  const { playerStatus } = useGame();
  const conditions = hotel.passingConditions;
  const hasRoom = playerStatus.currentBooking?.roomId === conditions?.roomId;
  const hasMeal = conditions?.mealTypes?.includes(playerStatus.currentBooking?.mealType || '');
  const hasService = conditions?.additionalServices?.some(s => playerStatus.currentBooking?.additionalServices.includes(s as any));
  const hasInventory = conditions?.inventory?.every(i => playerStatus.inventory.includes(i));
  const isSafeToBook = !conditions || (hasRoom && hasMeal && hasService && hasInventory);"""

if old_line in content:
    content = content.replace(old_line, new_code)
    print("Added isSafeToBook logic")
else:
    print("ERROR: Could not find hotel definition line")

# 2. Replace heart button logic - remove onClick and use isSafeToBook
# First heart button
old_heart1 = """<Heart
                          onClick={() => setIsFavorite(!isFavorite)}
                          className={`w-6 h-6 transition-all cursor-pointer ${
                            isFavorite
                              ? 'fill-red-500 text-red-500'
                              : 'text-primary-foreground hover:text-red-500'
                          }`}
                        />"""

new_heart1 = """<Heart
                          className={`w-6 h-6 transition-all cursor-pointer ${
                            !isSafeToBook
                              ? 'fill-red-500 text-red-500'
                              : 'text-primary-foreground'
                          }`}
                        />"""

if old_heart1 in content:
    content = content.replace(old_heart1, new_heart1)
    print("Replaced first heart button")
else:
    print("ERROR: Could not find first heart button")

# Second heart button  
old_heart2 = """<Heart
                      className={`w-6 h-6 transition-all ${
                        isFavorite
                          ? 'fill-red-500 text-red-500'
                          : 'text-primary-foreground hover:text-red-500'
                      }`}
                    />"""

new_heart2 = """<Heart
                      className={`w-6 h-6 transition-all ${
                        !isSafeToBook
                          ? 'fill-red-500 text-red-500'
                          : 'text-primary-foreground'
                      }`}
                    />"""

if old_heart2 in content:
    content = content.replace(old_heart2, new_heart2)
    print("Replaced second heart button")
else:
    print("ERROR: Could not find second heart button")

# Write file
with open('src/app/pages/HotelDetailPage.tsx', 'w') as f:
    f.write(content)

print("Done!")
