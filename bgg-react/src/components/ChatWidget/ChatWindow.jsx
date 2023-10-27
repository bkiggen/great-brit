import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { InputLabel } from "@mui/material";
import * as S from "./styles";

function ChatWindow({ socket, visible }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  // const { socket } = useOutletContext();
  const { roomId } = useParams();

  useEffect(() => {
    if (!socket) return;

    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { message: data.message, received: true }]);
    });

    socket.on("typing-from-server", (data) => {
      setTyping(data.isTyping);
    });
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!socket) return;

    socket.emit("send-message", { message, roomId });
    setChat((prev) => [...prev, { message: message, received: false }]);
    setMessage("");
    socket.emit("typing", { message: "", roomId });
  };

  const handleInput = (e) => {
    if (!socket) return;

    setMessage(e.target.value);
    socket.emit("typing", { message: e.target.value, roomId });
  };

  return visible ? (
    <S.WindowBody>
      <div>
        {roomId && (
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {roomId}
          </Typography>
        )}
        <Box sx={{ padding: "12px" }}>
          {chat.map((data, index) => (
            <Typography
              sx={{
                textAlign: data.received ? "left" : "right",
              }}
              key={index}
              variant="body1"
            >
              {data.message}
            </Typography>
          ))}
        </Box>
        <Box>
          {typing && (
            <InputLabel sx={{ color: "white" }} shrink htmlFor="message-input">
              typing...
            </InputLabel>
          )}
          <OutlinedInput
            id="message-input"
            sx={{
              backgroundColor: "white",
              width: "100%",
              input: {
                textAlign: "right",
              },
            }}
            value={message}
            size="small"
            variant="outlined"
            placeholder="Send a message"
            onChange={handleInput}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={(e) => handleSend(e)} edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      </div>
    </S.WindowBody>
  ) : null;
}

export default ChatWindow;
