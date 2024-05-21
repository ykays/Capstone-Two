export function removeFromFilter(items, e){
    const newArr = [...items]
    let deleteItem;
    let indx;
    if(e.target.parentElement.dataset.testid == "CancelIcon"){
        deleteItem = e.target.parentElement.parentElement.innerText
    }
    else if(e.target.dataset.testid == "CancelIcon"){
        deleteItem = e.target.parentElement.innerText
    }
    indx = newArr.indexOf(deleteItem)
    newArr.splice(indx,1)
    return newArr;
}

export function handleFilters(items, e){
    if(e.target.parentElement.dataset.testid == "CancelIcon" || e.target.dataset.testid == "CancelIcon"){
        const newValues = removeFromFilter(items, e)
        return newValues;
    }
    else if(e.target.parentElement.title === 'Clear'){
        return []
    }
    else {
       
        const newArray = [...items]
        newArray.push(e.target.innerText)
        return newArray
       
}}