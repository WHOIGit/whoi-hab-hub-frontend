import React from "react";
import Box from "@mui/material/Box";
import { Typography, Link } from "@mui/material";

export default function FeedbackText() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body2" display="block" gutterBottom>
        The HAB hub data is being developed as a data access and visualization
        portal for the New England Harmful Algal Bloom Observing Network (
        <Link
          href="https://northeasthab.whoi.edu/bloom-monitoring/habon-ne/"
          target="_blank"
          rel="noopener"
        >
          neHABON
        </Link>
        ). It is a work in progress and we welcome your feedback. Please send
        comments to <Link href="mailto:mrichlen@whoi.edu">Mindy Richlen</Link>{" "}
        and <Link href="mailto:mbrosnahan@whoi.edu">Mike Brosnahan</Link>
      </Typography>
    </Box>
  );
}
