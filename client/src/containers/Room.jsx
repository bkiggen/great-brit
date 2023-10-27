import React, { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import ChatWindow from "@/components/ChatWidget/ChatWindow";

const Room = () => {
  const params = useParams();
  const { socket } = useOutletContext();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", { roomId: params.roomId });
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ChatWindow />
    </>
  );
};

export default Room;
