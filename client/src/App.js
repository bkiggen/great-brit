import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { setSnackbarRef } from "./helpers/notifier";

// import { initializeSocket } from "./store/socketSlice";

import Header from "./components/Header";
import "./App.css";

function App() {
  const socket = useSelector((state) => state.socket.socket);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Initialize the notifier with enqueueSnackbar
    setSnackbarRef(enqueueSnackbar);
  }, [enqueueSnackbar]);

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
