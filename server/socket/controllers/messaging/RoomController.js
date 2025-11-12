import { prisma } from "../../../index.js";
import BaseController from "../BaseController.js";

export default class RoomController extends BaseController {
  joinRoom = ({ roomId }) => {
    this.socket.join(roomId);
  };

  newRoomCreated = async ({ roomId, userId }) => {
    await prisma.room.create({
      data: {
        roomId: roomId,
        name: "harbor",
        userId,
      },
    });

    this.socket.broadcast.emit("new-room-created-from-server", { roomId });
  };

  leaveRoom = () => {
    console.log("user disconnected");
  };
}
