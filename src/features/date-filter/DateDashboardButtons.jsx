import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, styled } from "@mui/material";
import { useSelector } from "react-redux";
//import ScheduleIcon from "@mui/icons-material/Schedule";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import TuneIcon from "@mui/icons-material/Tune";
import { sub } from "date-fns";
import { changeDateRange } from "./dateFilterSlice";
import { selectActiveGuideStep } from "../guide/guideSlice";
import styles from "../guide/styles.module.css";

const DashboardButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "100%",
  marginBottom: theme.spacing(1),
  // Aligns the content of the button vertically.
  flexDirection: "column",
}));

export default function DateDashboardButtons({
  showDateControls,
  setShowDateControls,
  setSelectedStartDate,
  setSelectedEndDate,
  setSliderValuesFromDates,
  setChartZoomReset,
}) {
  const dispatch = useDispatch();
  const activeGuideStep = useSelector(selectActiveGuideStep);

  useEffect(() => {
    if (activeGuideStep && activeGuideStep?.stepId === 3) {
      setShowDateControls(true);
    } else {
      setShowDateControls(false);
    }
  }, [activeGuideStep]);

  const onCurrentDataClick = () => {
    let end = new Date();
    let start = sub(end, { months: 3 });
    // trigger Redux dispatch function to send data
    const payload = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      seasonal: false,
      excludeMonthRange: false,
    };
    dispatch(changeDateRange(payload));

    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setSliderValuesFromDates(start, end);
    setChartZoomReset(true);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        right: 0,
        bottom: (theme) => theme.spacing(1),
        zIndex: 2000,
        width: "130px",
      }}
    >
      <DashboardButton
        className={activeGuideStep?.stepId === 3 && styles.pulse}
        onClick={onCurrentDataClick}
      >
        <MyLocationIcon />
        Current Data
      </DashboardButton>

      <DashboardButton
        className={activeGuideStep?.stepId === 3 && styles.pulse}
        onClick={() => setShowDateControls(!showDateControls)}
      >
        <TuneIcon />
        Date Controls
      </DashboardButton>
    </Box>
  );
}
