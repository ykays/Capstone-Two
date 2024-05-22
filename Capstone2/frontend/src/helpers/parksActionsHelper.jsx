export function parksActionsFilters (filter){
    let URLFilter ='';
  if(Object.keys(filter).length !== 0){
    if(filter.states.length !== 0){
      for(let state of filter.states){
        if(URLFilter.length === 0){
          URLFilter += `?state=${state}`
        }
        else{
          URLFilter += `&state=${state}`
        }
      }
    }
    if(filter.parkType.length !== 0){
      for(let type of filter.parkType){
        if(URLFilter.length === 0){
          URLFilter += `?park_type=${type}`
        }
        else{
          URLFilter += `&park_type=${type}`
        }
      }
    }
    if(filter.activity.length !== 0){
      for(let activity of filter.activity){
        if(URLFilter.length === 0){
          URLFilter += `?activity=${activity}`
        }
        else{
          URLFilter += `&activity=${activity}`
        }
      }
    }
  }
  return URLFilter;
}