// 📄 validation.js
module.exports = {
    ensureStudentHasNoAllotment(student) {
    if (student.allotment) {
        return "Student already has a room allotted!";
    }
    return null;
    },

    ensureRoomAvailable(room) {
    if (!room) return "Room does not exist!";
    if (room.status === "Occupied") return "Room is already full!";
    return null;
    },
};
