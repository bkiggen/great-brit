import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab, Box, Typography, Card } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";

import Stars from "containers/Stars";
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
    { path: "/admin/stars", component: <Stars />, label: "Bakers" },
  ];

  const selectedTab =
    tabPaths.find((tab) => location.pathname.includes(tab.path)) || tabPaths[0];

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

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
          <AdminPanelSettings sx={{ fontSize: 48, color: "#614051", mr: 2 }} />
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
          Manage episodes, bakers, and oversee the competition
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
              fontWeight: 600,
              py: 2,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#2c5f4f",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2c5f4f",
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
