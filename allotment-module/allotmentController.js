const { PrismaClient } = require("../prisma/generated/prisma");
const prisma = new PrismaClient();

const autoAllocate = require("./autoAllocate");
const {
ensureStudentHasNoAllotment,
ensureRoomAvailable
} = require("./validation");

// APPLY FOR ROOM (student)
exports.applyForRoom = async (req, res) => {
try {
    const studentId = req.user.id;
    const roomId = parseInt(req.params.roomId);

    const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: { allotment: true }
    });

    const studentCheck = ensureStudentHasNoAllotment(student);
    if (studentCheck)
    return res.status(400).json({ message: studentCheck });

    const room = await prisma.room.findUnique({
    where: { id: roomId }
    });

    const roomCheck = ensureRoomAvailable(room);
    if (roomCheck)
      return res.status(400).json({ message: roomCheck });

    // Create allotment
    const allotment = await prisma.allotment.create({
      data: {
        studentId,
        roomId
      }
    });

    // Update room capacity
    const allotmentsCount = await prisma.allotment.count({
      where: { roomId }
    });

    if (allotmentsCount >= room.capacity) {
      await prisma.room.update({
        where: { id: roomId },
        data: { status: "Occupied" }
      });
    }

    res.status(200).json({
      message: "Room allotted successfully",
      allotment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET MY ALLOTMENT
exports.myAllotment = async (req, res) => {
  try {
    const allotment = await prisma.allotment.findUnique({
      where: { studentId: req.user.id },
      include: { room: true }
    });

    if (!allotment)
      return res.status(404).json({ message: "No allotment found" });

    res.json(allotment);

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// ADMIN — APPROVE ALLOTMENT
exports.adminApprove = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    let allotment = await prisma.allotment.findUnique({
      where: { studentId }
    });

    if (!allotment)
      return res.status(400).json({ message: "No allotment found" });

    res.json({
      message: "Allotment Approved",
      allotment
    });

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// GET ALL ALLOTMENTS (ADMIN)
exports.getAllAllotments = async (req, res) => {
  try {
    const data = await prisma.allotment.findMany({
      include: { room: true, student: true }
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err });
  }
};
