"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ExpressError,
} = require("../expressError");

/*
Route Model that includes:
- creating a new route
- editing a route
- deleting a route

*/

class Route {
  /*
Create a new Route - will be done by a user who is logged in
Data to be sent: username, route_name, route_notes(optional), 
route details as an array of objects {waypointName, waypointLongitude, waypointLatitude, waypointNotes}
the index of an object in array will dictate the seq_number
*/
  static async addNewRoute(username, routeName, routeNotes = "", routeDetails) {
    const results = await db.query(
      `INSERT INTO users_routes (username, route_name, route_notes)
        VALUES ($1, $2, $3)
        RETURNING id, username, route_name as "routeName", 
        route_notes as "routeNotes", created_timestamp as "createdTimestamp"`,
      [username, routeName, routeNotes]
    );
    const newRoute = results.rows[0];

    routeDetails.forEach(async (waypoint, indx) => {
      await this.addRouteDetails(
        newRoute.id,
        indx,
        waypoint.waypointName,
        waypoint.waypointLongitude,
        waypoint.waypointLatitude,
        waypoint.waypointNotes
      );
    });

    const route = this.getRouteDetails(newRoute.id);

    return route;
  }

  static async addRouteDetails(
    routeId,
    seqNum,
    name,
    longitude,
    latitude,
    notes = ""
  ) {
    const results = await db.query(
      `INSERT INTO routes_details
        (route_id, seq_number, waypoint_name, waypoint_longitude, waypoint_latitude, waypoint_notes)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id, route_id as "routeId", seq_number as "seqNumber", 
        waypoint_name as "waypointName", 
        waypoint_longitude as "waypointLongitude", 
        waypoint_latitude as "waypointLatitude", 
        waypoint_notes as "waypointNotes"
        `,
      [routeId, seqNum, name, longitude, latitude, notes]
    );
    const routeDetails = results.rows[0];

    return routeDetails;
  }

  /*
  Function to get all routes for a user
  Expects username 
  and returns routeId, routeName, routeNotes and routeDetails which are all points along the route

  If no routes for user, returns NotFoundError
  */
  static async getUserRoutes(username) {
    const results = await db.query(
      `SELECT id, username, route_name as "routeName", route_notes as "routeNotes", created_timestamp as "createTimestamp"
      FROM users_routes 
      WHERE username=$1`,
      [username]
    );
    const routes = results.rows;

    if (routes.length === 0)
      throw new NotFoundError(`No routes for: ${username}`);

    for (let route of routes) {
      const routeDetails = await db.query(
        `SELECT
        seq_number as "seqNumber",
        waypoint_name as "waypointName",
        waypoint_longitude as "waypointLongitude",
        waypoint_latitude as "waypointLatitude",
        waypoint_notes as "waypointNotes"
        FROM routes_details
        WHERE route_id = $1`,
        [route.id]
      );
      route.details = routeDetails.rows;
    }
    return routes;
  }

  /*
  Getting the details for one route 
  Expects routeId 
  and returns routeId, routeName, routeNotes and routeDetails which are all points along the route

  If the route is not found, returns NotFoundError
  */

  static async getRouteDetails(routeId) {
    const results = await db.query(
      `SELECT id, username, route_name as "routeName", route_notes as "routeNotes", created_timestamp as "createTimestamp"
      FROM users_routes 
      WHERE id = $1`,
      [routeId]
    );
    const route = results.rows[0];
    if (!route) throw new NotFoundError(`No route: ${routeId}`);

    const routeDetails = await db.query(
      `SELECT 
      seq_number as "seqNumber", 
      waypoint_name as "waypointName", 
      waypoint_longitude as "waypointLongitude", 
      waypoint_latitude as "waypointLatitude", 
      waypoint_notes as "waypointNotes"
      FROM routes_details 
      WHERE route_id = $1`,
      [routeId]
    );

    route.details = routeDetails.rows;

    return route;
  }

  /*
  Function to delete a single route
  Expects routeId
  Returns NotFoundError if the route is not found, otherwise returns route id that was deleted
  */

  static async deleteRoute(routeId) {
    const results = await db.query(
      `DELETE FROM users_routes WHERE id=$1
      RETURNING id`,
      [routeId]
    );
    const route = results.rows[0];
    if (!route) throw new NotFoundError(`No route: ${routeId}`);
    return route;
  }

  /*
  Edit route function
  Expects routeId of the route that should be edited and fields that should be changed

  Fields that may be changed: 
  - routeNotes in the main USERS_ROUTES table;
  This will be processed as an update to the users_routes table based on routeId.

  In terms of ROUTES_DETAILS table, it will be processed as: delete & insert.
  Since, the user can not only change the details of an existing waypoint but also add a new one 
  which could change the seqNumber of each waypoint. 

  If the route cannot be found, return NotFoundError

  */

  static async editRoute(routeId, data) {
    //first check if the route exists, throw an error if doesn't
    const check = await db.query(`SELECT id FROM users_routes WHERE id=$1`, [
      routeId,
    ]);

    if (!check.rows[0]) throw new NotFoundError(`No route: ${routeId}`);

    //then update to USERS_ROUTES table (if needed)
    if (data.routeNotes) {
      await db.query(
        `UPDATE users_routes 
        SET route_notes = $1 WHERE id=$2 
        RETURNING id, username, route_name as "routeName", 
        route_notes as "routeNotes", created_timestamp as "createdTimestamp"
        `,
        [data.routeNotes, routeId]
      );
    }
    //now, processing delete and insert of the route details
    const del = await db.query(
      `DELETE FROM routes_details WHERE route_id=$1 RETURNING route_id`,
      [routeId]
    );
    if (!del.rows[0])
      throw new NotFoundError(`No route details for route: ${routeId}`);

    data.routeDetails.forEach(async (waypoint, indx) => {
      await this.addRouteDetails(
        routeId,
        indx,
        waypoint.waypointName,
        waypoint.waypointLongitude,
        waypoint.waypointLatitude,
        waypoint.waypointNotes
      );
    });
    //getting the details of the changed route to return at the end as part of route
    const route = this.getRouteDetails(routeId);

    return route;
  }
}

module.exports = Route;
