import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAdmin } from "store/sessionSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab, Box, Typography, Card } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";

import Stars from "containers/Stars";
import Episodes from "containers/Episodes";
import Seasons from "containers/Seasons";

const AdminPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);

  const tabPaths = [
    {
      path: "/admin/episodes",
      component: <Episodes admin />,
      label: "Episodes",
    },
    { path: "/admin/stars", component: <Stars />, label: "Bakers" },
    { path: "/admin/seasons", component: <Seasons />, label: "Seasons" },
  ];

  const selectedTab =
    tabPaths.find((tab) => location.pathname.includes(tab.path)) || tabPaths[0];

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <Box
      sx={{
        paddingTop: { xs: "100px", md: "120px" },
        paddingBottom: "80px",
        paddingX: { xs: 2, md: 4 },
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <AdminPanelSettings sx={{ fontSize: 48, color: "#c73d67", mr: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "32px", md: "48px" },
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage seasons, episodes, bakers, and oversee the competition
        </Typography>
      </Box>

      {/* Tabs Card */}
      <Card sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab.path}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 500,
              py: 2,
              "&.Mui-selected": {
                color: "#197b9f",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#197b9f",
              height: 3,
            },
          }}
        >
          {tabPaths.map((tab) => (
            <Tab key={tab.path} label={tab.label} value={tab.path} />
          ))}
        </Tabs>
      </Card>

      {/* Content */}
      <Box>{selectedTab.component}</Box>
    </Box>
  );
};

export default AdminPage;
