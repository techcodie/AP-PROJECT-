const { PrismaClient } = require("../prisma/generated/prisma");
const prisma = new PrismaClient();

module.exports = async function autoAllocate(studentYear) {

    const room = await prisma.room.findFirst({
    where: {
    yearGroup: studentYear,
    status: "Available",
    },
    orderBy: {
      id: "asc", // smallest ID = least filled room
    },
});

return room;
};
