import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  Button,
  Collapse,
} from "@mui/material";
import {
  LocalOffer,
  Add,
  List,
  CheckCircle,
  ViewList,
} from "@mui/icons-material";
import NewBet from "./NewBet";
import BetTable from "./BetTable";

const Bets = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showNewBet, setShowNewBet] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
          <LocalOffer sx={{ fontSize: 48, color: "#614051", mr: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "32px", md: "48px" },
            }}
          >
            Bets
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create, accept, and track your bets for the current episode
        </Typography>

        {/* Create New Bet Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowNewBet(!showNewBet)}
          sx={{
            background: "linear-gradient(135deg, #614051 0%, #452d39 100%)",
            color: "white",
            px: 4,
            py: 1.5,
            fontSize: "16px",
            "&:hover": {
              background: "linear-gradient(135deg, #452d39 0%, #614051 100%)",
            },
          }}
        >
          {showNewBet ? "Cancel" : "Create New Bet"}
        </Button>
      </Box>

      {/* New Bet Form (Collapsible) */}
      <Collapse in={showNewBet}>
        <Box sx={{ mb: 4 }}>
          <NewBet />
        </Box>
      </Collapse>

      {/* Tabs Section */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              py: 2,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2c5f4f",
              height: 3,
            },
          }}
        >
          <Tab
            icon={<ViewList />}
            iconPosition="start"
            label="All Bets"
            sx={{
              color: activeTab === 0 ? "#2c5f4f" : "text.secondary",
            }}
          />
          <Tab
            icon={<List />}
            iconPosition="start"
            label="My Bets"
            sx={{
              color: activeTab === 1 ? "#2c5f4f" : "text.secondary",
            }}
          />
          <Tab
            icon={<CheckCircle />}
            iconPosition="start"
            label="Available to Accept"
            sx={{
              color: activeTab === 2 ? "#2c5f4f" : "text.secondary",
            }}
          />
        </Tabs>
      </Card>

      {/* Tab Panels */}
      <Box>
        {activeTab === 0 && (
          <Box>
            <BetTable />
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            <BetTable filterType="myBets" />
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            <BetTable filterType="availableToAccept" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Bets;
