import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";

import Stars from "containers/Admin/Stars";
import Episodes from "containers/Episodes";

const AdminPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabPaths = [
    {
      path: "/admin/episodes",
      component: <Episodes admin />,
      label: "Episodes",
    },
    { path: "/admin/stars", component: <Stars />, label: "Stars" },
  ];

  const selectedTab =
    tabPaths.find((tab) => location.pathname.includes(tab.path)) || tabPaths[0];

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <>
      <Tabs
        value={selectedTab.path}
        onChange={handleTabChange}
        sx={{
          marginBottom: "40px",
          borderBottom: "1px solid lightgrey",
          backgroundColor: "white",
          position: "fixed",
          width: "100vw",
          zIndex: "999",
          marginTop: "64px",
        }}
      >
        {tabPaths.map((tab) => (
          <Tab
            key={tab.path}
            label={tab.label}
            value={tab.path}
            wrapped
            sx={{
              fontWeight: "600",
              width: "120px",
            }}
          />
        ))}
      </Tabs>
      <div className="container">{selectedTab.component}</div>
    </>
  );
};

export default AdminPage;
