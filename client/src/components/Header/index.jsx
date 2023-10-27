import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { sessionSelector } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { getInitials } from "@/helpers/getInitials";
import { Button, Card, Typography, Box } from "@mui/material";
import { logoutUser } from "@/store/sessionSlice";
import LinkItem from "./LinkItem";
import ChatWidget from "@/components/ChatWidget";
import Tent from "@/components/icons/Tent";
import { styles } from "./styles";

const Header = ({ socket }) => {
  const navigate = useNavigate();
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();

  // const createNewRoom = () => {
  //   const roomId = uuidv4();
  //   navigate(`/room/${roomId}`);
  //   socket.emit("new-room-created", { roomId });
  //   setRooms([...rooms, roomId]);
  // };

  // const fetchRooms = async () => {
  //   const res = await fetch("http://localhost:4000/rooms");
  //   const data = await res.json();
  //   setRooms(data.rooms);
  // };

  // useEffect(() => {
  //   fetchRooms();
  // }, [socket]);

  // const login = () => {
  //   const userId = uuidv4();

  //   Cookies.setItem("userId", userId);
  //   navigate("/");
  // };

  const logout = () => {
    navigate("/login");
    dispatch(logoutUser());
  };

  return (
    <div className={styles}>
      <Card
        sx={{
          position: "fixed",
          top: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#1B7B9F",
          borderRadius: "0px",
          height: "60px",
          zIndex: 1000,
        }}
      >
        <Box>
          <LinkItem to="/" label={<Tent />} />
        </Box>
        {session.sessionToken && (
          <Box sx={{ display: "flex" }}>
            <LinkItem to="/rankings" label="Rankings" />
            <LinkItem to="/bets" label="Bets" />
            <LinkItem to="/episodes" label="Episodes" />
            <LinkItem to="/admin" label="Admin" />
          </Box>
        )}
        <Box>
          {session.sessionToken ? (
            <Button variant="text" onClick={logout}>
              <div className="logout">
                {getInitials(session.user.firstName, session.user.lastName)}
              </div>
            </Button>
          ) : (
            <Link to={"/login"}>
              <Button variant="text">
                <Typography sx={{ color: "white" }}>Login</Typography>
              </Button>
            </Link>
          )}
        </Box>
      </Card>
      <ChatWidget socket={socket} />
    </div>
  );
};

export default Header;
