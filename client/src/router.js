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

const ProtectedRoute = ({ element, ...rest }) => {
  const session = useSelector(sessionSelector);

  if (!session.sessionToken) {
    return <Navigate to="/login" />;
  }

  return element;
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
        path: "/admin",
        element: <ProtectedRoute element={<Admin />} />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;

// {
//   path: "/room/:roomId",
//   element: <Room />,
// },
