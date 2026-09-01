import React from "react";
import { useDrag } from "react-dnd";
import { Box, Card, CardHeader, CardContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
// local imports
import { changeActiveGuideStep } from "./guideSlice";
import { changeLayerVisibility } from "../data-layers/dataLayersSlice";
import { ITEM_TYPES, DATA_LAYERS } from "../../Constants";

export default function GuidePane({
  openGuide,
  handleGuideClose,
  left,
  bottom,
  transform,
  id,
}) {
  const dispatch = useDispatch();
  const guideSteps = useSelector((state) => state.guide.guideSteps);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const [, drag] = useDrag(
    () => ({
      type: ITEM_TYPES.PANE,
      item: { id, left, bottom },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, bottom]
  );

  const getStepContent = (stepId) => {
    const step = guideSteps.find((item) => item.stepId === stepId);
    return { __html: step.text };
  };

  const totalSteps = () => {
    return guideSteps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const dispatchHandler = (newActiveStep) => {
    // dispatch active step to Redux state
    // activate Cell Concentration layer for Graph display if necessary
    console.log(newActiveStep);
    dispatch(
      changeActiveGuideStep({
        stepId: newActiveStep,
      })
    );

    if (newActiveStep === 4) {
      dispatch(
        changeLayerVisibility({
          layerID: DATA_LAYERS.cellConcentrationLayer,
          checked: true,
        })
      );
    }
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          guideSteps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    // dispatch active step to Redux state
    dispatchHandler(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (stepId) => () => {
    setActiveStep(stepId);
    // dispatch active step to Redux state
    dispatchHandler(stepId);
  };

  // eslint-disable-next-line no-unused-vars
  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  return (
    <Box
      ref={drag}
      id={id}
      sx={[
        {
          margin: 1,
          width: 640,
          transition: "all 0.3s",
          zIndex: 2000,
          display: "none",
          cursor: "move",
        },
        openGuide && {
          display: "block",
          position: "absolute",
          left: left,
          bottom: bottom,
          //left: "50%",
          //top: "50%",
          transform: transform,
        },
      ]}
    >
      <Card>
        <CardHeader
          slotProps={{
            root: { sx: { pb: 0 } },
            title: {
              sx: {
                color: (theme) => theme.palette.primary.main,
                fontSize: "1.1rem",
              },
            },
          }}
          action={
            <React.Fragment>
              <IconButton onClick={handleGuideClose} aria-label="close">
                <Close />
              </IconButton>
            </React.Fragment>
          }
          title={"HABHub Guide"}
        />

        <CardContent>
          <div style={{ width: "100%" }}>
            <Stepper nonLinear activeStep={activeStep} alternativeLabel>
              {guideSteps.map((step) => (
                <Step key={step.stepId}>
                  <StepButton
                    onClick={handleStep(step.stepId)}
                    completed={completed[step.stepId]}
                  >
                    {step.label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div>
              <div>
                <Typography sx={{ mt: 1, mb: 1 }}>
                  <div dangerouslySetInnerHTML={getStepContent(activeStep)} />
                </Typography>
                <div>
                  <Button
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    disabled={activeStep === 0}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === guideSteps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
