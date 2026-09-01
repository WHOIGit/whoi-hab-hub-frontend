import React from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Grid
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function ClosuresList({ results }) {
  function renderClosureItem(closure) {
    return (
      <Box mb={4} key={closure.id}>
        <Grid
          container
          spacing={1}
          alignItems="center"
        >
          <Grid item xs={9}>
            <Typography variant="subtitle1" display="block" gutterBottom>
              Closure Date: {closure.effectiveDate}
            </Typography>
            <Typography
              variant="body2"
              display="block"
              color="textSecondary"
              gutterBottom
            >
              Causative Species: <em>{closure.causativeOrganism}</em>
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {closure.documentLink && (
              <Box align="center">
                <a href={closure.documentLink} target="_blank" rel="noreferrer">
                  <DescriptionIcon fontSize="large" />
                </a>
                <Typography
                  variant="caption"
                  display="block"
                  color="textSecondary"
                  gutterBottom
                >
                  Download notice
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <TableContainer>
          <Table
            size="small"
            aria-label="Species and Duration Table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Species</TableCell>
                <TableCell align="right">Closure Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {closure.species.map(row => (
                <TableRow key={row.species}>
                  <TableCell component="th" scope="row">
                    {row.species}
                  </TableCell>
                  <TableCell align="right">{row.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <div>
      {results.properties.closures.map(closure => renderClosureItem(closure))}
    </div>
  );
}
