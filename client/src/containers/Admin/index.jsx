import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEpisodes } from "@/store/episodesSlice";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Stars from "./Stars";
import CreateEpisode from "./CreateEpisode";
import EpisodeList from "./EpisodeList";

import { styles } from "./styles";

const Admin = () => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episodes.list);

  const [active, setActive] = useState(null);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (episodes.length > 0) {
      setActive(episodes[episodes.length - 1]);
    }
  }, [episodes]);

  useEffect(() => {
    dispatch(fetchEpisodes());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    <div className={`episodes ${styles}`}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Episodes" {...a11yProps(0)} />
          <Tab label="Stars" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {value === 0 && (
        <div className="tabBox">
          <CreateEpisode />
          <EpisodeList active={active} setActive={setActive} />
        </div>
      )}
      {value === 1 && <Stars />}
    </div>
  );
};

export default Admin;
