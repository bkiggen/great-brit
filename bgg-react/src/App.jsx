import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// import { initializeSocket } from "./store/socketSlice";

import Header from "./components/Header";
import "./App.css";

function App() {
  const socket = useSelector((state) => state.socket.socket);

  // useEffect(() => {
  //   dispatch(initializeSocket());
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header socket={socket} />
      <Outlet context={{ socket }} />
    </>
  );
}

export default App;
