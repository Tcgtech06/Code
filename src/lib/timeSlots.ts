
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let i = 9; i <= 18; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    slots.push(`${hour}:00 ${ampm} - ${hour + 1 === 12 ? 12 : (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12}:00 ${i + 1 < 12 ? 'AM' : 'PM'}`);
  }
  return slots;
};
