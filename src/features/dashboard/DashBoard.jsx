import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Stars,
  Layers,
  List,
  Explore,
  Ballot,
  Bookmark,
  Help,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
// local imports
import DataLayersTab from "./DataLayersTab";
import HabSpeciesTab from "./HabSpeciesTab";
import LegendTab from "./LegendTab";
import LinksTab from "./LinksTab";
import PartnersTab from "./PartnersTab";
import BookmarkTab from "./BookmarkTab";
import { selectActiveGuideStep } from "../guide/guideSlice";
import styles from "../guide/styles.module.css";

const rootStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  width: "448px",
  background: "none",
  zIndex: 1200,
  height: "100vh",
  overflowY: "scroll",
  transition: "all 0.3s",
};

const dashboardContainerStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  width: "400px",
  background: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  color: "#6b6b76",
  outline: "none",
  height: "100vh",
  overflowY: "scroll",
  overflowX: "visible",
};

const iconsContainerSx = {
  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
  backgroundColor: (theme) => theme.palette.primary.main,
  position: "fixed",
  top: 0,
  right: 0,
  zIndex: 4000,
  height: "100vh",
};

const tabSx = {
  minWidth: "110px",
  color: "white",
};

const tabPanelStyle = { maxWidth: "284px" };

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function Dashboard({
  showControls,
  setShowControls,
  setOpenGuide,
}) {
  // Set const variables
  console.log("DASHBOARD");
  // Set local state
  const [tabValue, setTabValue] = useState(0);
  const activeGuideStep = useSelector(selectActiveGuideStep);

  const handleTabChange = (event, newTabValue) => {
    // handle the Help button with Dialog modal instead of tabs
    if (newTabValue === 6) {
      setOpenGuide(true);
      return null;
    }

    if (tabValue === newTabValue && showControls) {
      setShowControls(false);
    } else {
      setShowControls(true);
    }
    setTabValue(newTabValue);
  };

  useEffect(() => {
    if (activeGuideStep && activeGuideStep?.tabIndex !== null) {
      setTabValue(activeGuideStep?.tabIndex);
    }
  }, [activeGuideStep]);

  return (
    <>
      <div
        className="control-panel"
        style={{
          ...rootStyle,
          right: showControls ? rootStyle.right : "-284px",
        }}
      >
        <div style={dashboardContainerStyle}>
          <>
            <Box sx={iconsContainerSx}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                orientation="vertical"
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ "& .MuiTabs-indicator": { left: "0px" } }}
              >
                <Tab
                  icon={<Ballot />}
                  label="Algal Species"
                  className={
                    activeGuideStep?.tabIndex === 0 ? styles.pulse : undefined
                  }
                  sx={tabSx}
                />
                <Tab
                  icon={<Layers />}
                  label="Data Layers"
                  className={
                    activeGuideStep?.tabIndex === 1 ? styles.pulse : undefined
                  }
                  sx={tabSx}
                />
                <Tab icon={<List />} label="Legend" sx={tabSx} />
                <Tab icon={<Bookmark />} label="Save Map" sx={tabSx} />
                <Tab icon={<Explore />} label="Links" sx={tabSx} />
                <Tab icon={<Stars />} label="Partners" sx={tabSx} />
                <Tab icon={<Help />} label="Guide" sx={tabSx} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0} style={tabPanelStyle}>
              <HabSpeciesTab />
            </TabPanel>
            <TabPanel value={tabValue} index={1} style={tabPanelStyle}>
              <DataLayersTab />
            </TabPanel>
            <TabPanel value={tabValue} index={2} style={tabPanelStyle}>
              <LegendTab />
            </TabPanel>
            <TabPanel value={tabValue} index={3} style={tabPanelStyle}>
              <BookmarkTab />
            </TabPanel>
            <TabPanel value={tabValue} index={4} style={tabPanelStyle}>
              <LinksTab />
            </TabPanel>
            <TabPanel value={tabValue} index={5} style={tabPanelStyle}>
              <PartnersTab />
            </TabPanel>
          </>
        </div>
      </div>
    </>
  );
}
