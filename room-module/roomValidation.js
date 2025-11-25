module.exports = {
  validateRoomInput(roomNumber, capacity, yearGroup) {
    if (!roomNumber || !capacity || !yearGroup) {
      return "All fields (roomNumber, capacity, yearGroup) are required.";
    }
    if (capacity < 1) return "Capacity must be at least 1.";
    if (yearGroup < 1 || yearGroup > 4) return "YearGroup must be 1–4.";
    return null;
  },
  ensureCapacityNotLowerThanCurrent(currentCount, newCapacity) {
    if (newCapacity < currentCount) {
      return `Room has ${currentCount} students. Cannot reduce capacity below that.`;
    }
    return null;
  }
};