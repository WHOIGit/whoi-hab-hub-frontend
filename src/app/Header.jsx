import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import HeaderDropdownMenu from "./HeaderDropdownMenu";
import logo from "../images/logo-habhub.png";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ boxShadow: "none" }} position="fixed" color="transparent">
        <Toolbar>
          <HeaderDropdownMenu />
          <div>
            <img src={logo} alt="HABHub Logo" />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
