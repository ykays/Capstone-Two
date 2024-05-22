import * as React from 'react';
import {useState, useEffect} from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {fetchParksFromAPI, fetchParksFromAPIForUser} from "./actions/parks"
import {fetchFilterDataFromAPI} from "./actions/filters"
import {handleFilters} from "./helpers/filtersHelper.jsx"
import { useSelector, useDispatch, shallowEqual } from "react-redux";

function Filters({filtersStates, filtersType, filtersActivity}) {
    const dispatch = useDispatch()
    const user = useSelector((store)=> store.user, shallowEqual)
    
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
    
    // useEffect(()=>{  
    //     dispatch(fetchParksFromAPI(filters))
    //     dispatch(fetchFilterDataFromAPI())   
    //   }, [dispatch, filters])


      useEffect(()=>{
        if(user.length !== 0) { 
        dispatch(fetchParksFromAPIForUser(user.username, filters)) }
        else {
        dispatch(fetchParksFromAPI(filters))}
        dispatch(fetchFilterDataFromAPI())
            
      }, [dispatch, filters, user, ]) 

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