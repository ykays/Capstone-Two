import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Alert from "@mui/material/Alert";
import ParkNotes from "./ParkNotes";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import ParksApi from "./api";

/*
  The Component to display the details about a single park.
  Once user clicks on Park Marker on the map and then Details, 
  the external API is called to get more details about the park. 
  The details will be displayed in a drawer, where user can also click on the external link to get more details.
  
*/
function ParkDetails({ parkCode, handleParkDetailsClose }) {
  const user = useSelector((store) => store.user, shallowEqual);

  const [isLoading, setIsLoading] = useState(true);
  const [park, setPark] = useState(null);

  useEffect(() => {
    async function getParkDetails(parkCode) {
      try {
        const results = await ParksApi.getParkDetails(parkCode);
        setPark(results.data[0]);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
    getParkDetails(parkCode);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Drawer open={open} onClose={handleParkDetailsClose}>
        <Box sx={{ width: 450 }} role="presentation">
          <Button variant="outlined" onClick={handleParkDetailsClose}>
            Close
          </Button>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 30, textAlign: "center" }}>
                {park.fullName}
              </Typography>
              <img
                src={park.images[0].url}
                style={{ heigt: "100px", width: "350px" }}
              />
              <Typography>{park.description}</Typography>
              <CardActions>
                <Button href={park.url} size="small" target="_blank">
                  Learn More on NPS
                </Button>
              </CardActions>

              <Divider />
              {user.length !== 0 ? (
                <ParkNotes user={user} parkCode={parkCode} />
              ) : (
                <Alert severity="info">
                  Please log in or register to save a note about this park
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Drawer>
    </div>
  );
}

export default ParkDetails;
