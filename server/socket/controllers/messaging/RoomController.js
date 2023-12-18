import Room from "../../../models/Room.js";
import BaseController from "../BaseController.js";

export default class RoomController extends BaseController {
  joinRoom = ({ roomId }) => {
    this.socket.join(roomId);
  };

  newRoomCreated = ({ roomId, userId }) => {
    const room = new Room({ roomId: roomId, name: "harbor", userId });
    room.save();

    this.socket.broadcast.emit("new-room-created-from-server", { roomId });
  };

  leaveRoom = () => {
    console.log("user disconnected");
  };
}
