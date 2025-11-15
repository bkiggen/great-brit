import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { sessionSelector } from "store";
import { useSelector } from "react-redux";

import Home from "containers/Home";
import Rankings from "containers/Rankings";
import Bets from "containers/Bets";
import Episodes from "containers/Episodes";
import Admin from "containers/Admin";
import Login from "containers/Login";
import Profile from "containers/Profile";

const ProtectedRoute = ({ element }) => {
  const session = useSelector(sessionSelector);

  if (!session.sessionToken) {
    return <Navigate to="/login" />;
  }

  return element;
};

const FallbackRoute = () => {
  return <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute element={<Home />} />,
      },
      {
        path: "/rankings",
        element: <ProtectedRoute element={<Rankings />} />,
      },
      {
        path: "/bets",
        element: <ProtectedRoute element={<Bets />} />,
      },
      {
        path: "/episodes",
        element: <ProtectedRoute element={<Episodes />} />,
      },
      {
        path: "/admin/*",
        element: <ProtectedRoute element={<Admin />} />,
      },
      {
        path: "/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "*",
        element: <FallbackRoute />,
      },
    ],
  },
]);

export default router;

// {
//   path: "/room/:roomId",
//   element: <Room />,
// },
