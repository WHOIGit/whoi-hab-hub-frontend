import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

import logoNehab from "../images/logo-nehab.png";
import logoNehabon from "../images/logo-nehabon.png";
import logoPhytoArm from "../images/logo-phytoarm.png";

const StyledMenu = (props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    slotProps={{
      paper: {
        sx: { border: "1px solid #d3d4d5" },
      },
    }}
    {...props}
  />
);

export default function HeaderDropdownMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <React.Fragment>
      <IconButton
        edge="start"
        sx={{ color: (theme) => theme.palette.secondary.dark, mr: 2 }}
        onClick={handleClick}
        aria-controls="dropdown-menu"
        aria-haspopup="true"
      >
        <MenuIcon />
      </IconButton>

      <StyledMenu
        id="dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>Network Sites</MenuItem>
        <MenuItem onClick={handleClose}>
          <a
            href="https://northeasthab.whoi.edu/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={logoNehab}
              alt="NeHAB Logo"
              style={{ width: "170px" }}
            />
          </a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a
            href="https://northeasthab.whoi.edu/bloom-monitoring/habon-ne/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={logoNehabon}
              alt="NeHABON Logo"
              style={{ width: "200px" }}
            />
          </a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href="#">
            <img
              src={logoPhytoArm}
              alt="PhytoArm Logo"
              style={{ width: "200px" }}
            />
          </a>
        </MenuItem>
      </StyledMenu>
    </React.Fragment>
  );
}
