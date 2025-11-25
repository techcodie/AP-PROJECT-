const express = require("express");
const router = express.Router();
const auth = require("../middleware");
const {
createRoom,
updateRoom,
deleteRoom,
getAllRooms,
getRoomById
} = require("./roomController");

router.post("/create", auth, createRoom);
router.put("/update/:id", auth, updateRoom);
router.delete("/delete/:id", auth, deleteRoom);
router.get("/all", auth, getAllRooms);
router.get("/:id", auth, getRoomById);

module.exports = router;