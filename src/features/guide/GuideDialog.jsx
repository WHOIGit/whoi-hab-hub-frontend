import React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
// local imports
import { changeActiveGuideStep } from "./guideSlice";

export default function GuideDialog() {
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const guideSteps = useSelector((state) => state.guide.guideSteps);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

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

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          guideSteps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (stepId) => () => {
    setActiveStep(stepId);
    // dispatch active step to Redux state
    dispatch(
      changeActiveGuideStep({
        stepId: stepId,
      })
    );
  };

  // eslint-disable-next-line no-unused-vars
  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  return (
    <div>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
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
                  <div dangerouslySetInnerHTML={getStepContent(activeStep)} />;
                </Typography>
                <div>
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
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
        </DialogContentText>
      </DialogContent>
    </div>
  );
}
