import * as React from 'react';
import {useState, useEffect} from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import {fetchParksFromAPI} from "./actions/parks"
import {fetchFilterDataFromAPI} from "./actions/filters"
import { useDispatch } from "react-redux";
import {handleFilters} from "./helpers/filtersHelper.jsx"

function Filters({filtersStates, filtersType, filtersActivity}) {
    const dispatch = useDispatch()

    const initialState = {
        states: [],
        parkType: [],
        activity: []
    }
    const [filters, setFilters] = useState(initialState)
   
    const handleFilterStates = (e)=> {
        const filterValues = handleFilters(filters.states, e)
        return setFilters((filters) => ({...filters, states: filterValues}))
       
    }

    const handleFilterType = (e)=> {
        const filterValues = handleFilters(filters.parkType, e)
        return setFilters((filters) => ({...filters, parkType: filterValues}))
    }

    const handleFilterActivity = (e)=> {
        const filterValues = handleFilters(filters.activity, e)
        return setFilters((filters) => ({...filters, activity: filterValues}))
    }
    
    useEffect(()=>{  
        dispatch(fetchParksFromAPI(filters))
        dispatch(fetchFilterDataFromAPI())   
      }, [dispatch, filters])

  return (
    <div>
    <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
      sx={{display : 'inline-flex', width : '70%' }}
        multiple
        size="small"
        id="tags-standard"
        options={filtersStates}
        onChange={handleFilterStates}
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
    sx={{display : 'inline-flex', width : '70%' }}
        multiple
        size="small"
        id="tags-standard"
        options={filtersType}
        onChange={handleFilterType}
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
      sx={{display : 'inline-flex', width : '70%' }}
        multiple
        size="small"
        id="tags-standard"
        options={filtersActivity}
        onChange={handleFilterActivity}
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