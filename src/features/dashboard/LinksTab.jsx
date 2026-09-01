import React from "react";
import {
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Box,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FeedbackText from "./FeedbackText";

export default function LinksTab() {
  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" display="block" gutterBottom>
          More information about HABs impacting New England can be found at
          these links
        </Typography>

        <List>
          <ListItem sx={{ pl: 0 }}>
            <Typography variant="body2" display="block" gutterBottom>
              <Link
                href="https://northeasthab.whoi.edu/habs/alexandrium/"
                target="_blank"
                rel="noopener"
              >
                <em>Alexandrium catenella</em> / Paralytic Shellfish Poisoning
                (PSP)
              </Link>
            </Typography>
            <ListItemIcon sx={{ minWidth: "auto", ml: "5px" }}>
              <Link
                href="https://northeasthab.whoi.edu/habs/alexandrium/"
                target="_blank"
                rel="noopener"
              >
                <OpenInNewIcon />
              </Link>
            </ListItemIcon>
          </ListItem>

          <ListItem sx={{ pl: 0 }}>
            <Typography variant="body2" display="block" gutterBottom>
              <Link
                href="https://northeasthab.whoi.edu/habs/dinophysis/"
                target="_blank"
                rel="noopener"
              >
                <em>Dinophysis acuminata and Dinophysis norvegica</em> /
                Diarrhetic Shellfish Poisoning (DSP)
              </Link>
            </Typography>
            <ListItemIcon sx={{ minWidth: "auto", ml: "5px" }}>
              <Link
                href="https://northeasthab.whoi.edu/habs/dinophysis/"
                target="_blank"
                rel="noopener"
              >
                <OpenInNewIcon />
              </Link>
            </ListItemIcon>
          </ListItem>

          <ListItem sx={{ pl: 0 }}>
            <Typography variant="body2" display="block">
              <Link
                href="https://northeasthab.whoi.edu/habs/karenia-mikimotoi/"
                target="_blank"
                rel="noopener"
              >
                <em>Karenia mikimotoi</em>
              </Link>
            </Typography>
            <ListItemIcon sx={{ minWidth: "auto", ml: "5px" }}>
              <Link
                href="https://northeasthab.whoi.edu/habs/karenia-mikimotoi/"
                target="_blank"
                rel="noopener"
              >
                <OpenInNewIcon />
              </Link>
            </ListItemIcon>
          </ListItem>

          <ListItem sx={{ pl: 0 }}>
            <Typography variant="body2" display="block" gutterBottom>
              <Link
                href="https://northeasthab.whoi.edu/habs/by-species/margalefidinium-polykrikoides/"
                target="_blank"
                rel="noopener"
              >
                <em>Margalefidinium polykrikoides</em>
                <br /> (Cochlodinium polykrikoides)
              </Link>
            </Typography>
            <ListItemIcon sx={{ minWidth: "auto", ml: "5px" }}>
              <Link
                href="https://northeasthab.whoi.edu/habs/by-species/margalefidinium-polykrikoides/"
                target="_blank"
                rel="noopener"
              >
                <OpenInNewIcon />
              </Link>
            </ListItemIcon>
          </ListItem>

          <ListItem sx={{ pl: 0 }}>
            <Typography variant="body2" display="block" gutterBottom>
              <Link
                href="https://northeasthab.whoi.edu/habs/pseudo-nitzschia/"
                target="_blank"
                rel="noopener"
              >
                <em>Pseudo-nitzschia</em> / Amnesic Shellfish Poisoning
              </Link>
            </Typography>
            <ListItemIcon sx={{ minWidth: "auto", ml: "5px" }}>
              <Link
                href="https://northeasthab.whoi.edu/habs/pseudo-nitzschia/"
                target="_blank"
                rel="noopener"
              >
                <OpenInNewIcon />
              </Link>
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>

      <FeedbackText />
    </>
  );
}
