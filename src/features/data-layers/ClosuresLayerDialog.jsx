import React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { Link } from "@mui/material";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const DialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle sx={{ m: 0, p: 2 }} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: (theme) => theme.spacing(1),
            top: (theme) => theme.spacing(1),
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default function ClosuresLayerDialog() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="closures-warning"
        open={open}
      >
        <DialogTitle id="closures-warning" onClose={handleClose}>
          Shellfish Closure Data Notice
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            This instance of HABhub provides visualizations and links of past
            biotoxin-based closures only from waters of Maine, New Hampshire,
            and Massachusetts.{" "}
            <strong>
              It should not be used as a source of information about current
              closure status of harvest areas.
            </strong>
          </Typography>
          <Typography gutterBottom>
            For the most up-to-date information, see sites maintained by{" "}
            <Link
              href="https://www.maine.gov/dmr/fisheries/shellfish/closures"
              target="_blank"
              rel="noreferrer"
            >
              Maine Department of Marine Resources
            </Link>
            ,{" "}
            <Link
              href="https://www4.des.state.nh.us/CoastalAtlas/Atlas.html"
              target="_blank"
              rel="noreferrer"
            >
              New Hampshire Department of Environmental Services
            </Link>
            , and{" "}
            <Link
              href="https://www.mass.gov/lists/biotoxin-notices"
              target="_blank"
              rel="noreferrer"
            >
              Massachusetts Division of Marine Fisheries
            </Link>{" "}
            and seek guidance from local town managers before harvesting.
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
