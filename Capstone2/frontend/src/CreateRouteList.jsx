import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { TextField } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

/*
 Waypoint List Component that is used when the user creates a new route 
 and/or the user wants to view/edit their existing route.

 The waypoints can be dragged and dropped which changes their order,
 and also the route on the map changes. 

 If the waypoint is the park 
 - the waypoint name is populated with the name of the park and cannot be changed by the user.
 If the waypoint is any point on the map
 - the user will need to provide the waypoint name (if it doesn't exist already)
*/

function CreateRouteList({ onDragEnd, newRoutePoints }) {
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {newRoutePoints.map((route, indx) => {
                if (route[3] !== "park") {
                  return (
                    <Draggable
                      key={indx}
                      draggableId={String(indx)}
                      index={indx}
                    >
                      {(provided) => (
                        <ListItem>
                          <Tooltip
                            title="Drag and drop to change the order"
                            placement="top-start"
                          >
                            <span>
                              <TextField
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                key={indx}
                                required
                                id="outlined-required"
                                label="Provide Waypoint Name"
                                size="small"
                                value={route[2] || null}
                                onChange={(e) => {
                                  route[2] = e.target.value;
                                }}
                              />
                            </span>
                          </Tooltip>
                        </ListItem>
                      )}
                    </Draggable>
                  );
                }
                return (
                  <Draggable key={indx} draggableId={String(indx)} index={indx}>
                    {(provided) => (
                      <ListItem>
                        <Tooltip
                          title="Drag and drop to change the order"
                          placement="top-start"
                        >
                          <span>
                            <TextField
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              key={indx}
                              disabled
                              id="outlined-disabled"
                              label="Waypoint"
                              value={route[2]}
                              size="small"
                            />
                          </span>
                        </Tooltip>
                      </ListItem>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default CreateRouteList;
