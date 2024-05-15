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

    return newRoute;
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

  static async getUserRoutes(username) {
    const results = await db.query(
      `SELECT id, username, route_name as "routeName", route_notes as "routeNotes"
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

  static async getRouteDetails(routeId) {
    const results = await db.query(
      `SELECT id, username, route_name as "routeName", route_notes as "routeNotes"
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
}

module.exports = Route;
