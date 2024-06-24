import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

/* 
Component to display the Parks Filters (Filter By State, Park Type, Activity)
The options are retrieved from redux in the main Map component 
The function are defined in the main Map component so that the Map can be adjusted based on the user selections

*/
function Filters({
  filtersStates,
  filtersType,
  filtersActivity,
  handleFilterStates,
  handleFilterType,
  handleFilterActivity,
}) {
  const handleFilterStateChange = (e, val) => {
    handleFilterStates(val);
  };
  const handleFilterTypeChange = (e, val) => handleFilterType(val);
  const handleFilterActivityChange = (e, val) => handleFilterActivity(val);

  return (
    <Stack direction="row" spacing={3} sx={{ width: "90%" }}>
      <Autocomplete
        sx={{ display: "inline-flex", width: "100%" }}
        multiple
        size="small"
        id="filterState"
        options={filtersStates}
        onChange={(e, value) => handleFilterStateChange(e, value)}
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
        sx={{ display: "inline-flex", width: "100%" }}
        multiple
        size="small"
        id="tags-standard"
        options={filtersType}
        onChange={(e, value) => handleFilterTypeChange(e, value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Filter By Park Type(s)"
            placeholder="Type"
            id="filterType"
          />
        )}
      />
      <Autocomplete
        sx={{ display: "inline-flex", width: "100%" }}
        multiple
        size="small"
        id="tags-standard"
        options={filtersActivity}
        onChange={(e, value) => handleFilterActivityChange(e, value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Filter By Activity"
            placeholder="Activity"
            id="filterActivity"
          />
        )}
      />
    </Stack>
  );
}

export default Filters;
