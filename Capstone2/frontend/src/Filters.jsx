import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

function Filters({
  filtersStates,
  filtersType,
  filtersActivity,
  handleFilterStates,
  handleFilterType,
  handleFilterActivity,
}) {
  const handleFilterStateChange = (e) => handleFilterStates(e);
  const handleFilterTypeChange = (e) => handleFilterType(e);
  const handleFilterActivityChange = (e) => handleFilterActivity(e);

  return (
    <div>
      <Stack direction="row" spacing={3} sx={{ width: "100%" }}>
        <Autocomplete
          sx={{ display: "inline-flex", width: "70%" }}
          multiple
          size="small"
          id="tags-standard"
          options={filtersStates}
          onChange={handleFilterStateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Filter By State(s)"
              placeholder="State"
            />
          )}
        />

        <Autocomplete
          sx={{ display: "inline-flex", width: "70%" }}
          multiple
          size="small"
          id="tags-standard"
          options={filtersType}
          onChange={handleFilterTypeChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Filter By Park Type(s)"
              placeholder="Type"
            />
          )}
        />
        <Autocomplete
          sx={{ display: "inline-flex", width: "70%" }}
          multiple
          size="small"
          id="tags-standard"
          options={filtersActivity}
          onChange={handleFilterActivityChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Filter By Activity"
              placeholder="Activity"
            />
          )}
        />
      </Stack>
    </div>
  );
}

export default Filters;
