**Pin The Park App!**

_The App where a user can view all the US parks on the map and create the routes to visit them_

This application allows a user to view and filter (based on state, park type, activity) all of the parks in the US. The user can click on any park marker on the map to get more details. The registered users can also mark the park as visited and add a note to an individual park.
Any user will be able to create a route which will help them to plan the visit to the parks but only registered users will be able to save/edit them and also view the entire route in google maps.

The technology stack used to create this app:

- JavaScript
- React
- HTML
- CSS (and Material UI)
- Express.js
- Postgresql
- Vite
- Redux
- Render

# Installation

1. Clone locally the repository: git clone git@github.com:ykays/Capstone-Two.git
2. Install requirements:
   - backend: TODO!
   - frontend:
3. Create new DB locally: createdb parks
4. Run files to create and populate tables in this order:
   1. psql < parks.sql
   - parks.sql will create a new parks and parks_test db;
   - will create new set of tables
   - will run a seed file
   2. node parksSeedApi.js
      - this file will call National Park (NPS) API to get the parks and parks activities and then populate the tables
5. To start server (server runs at http://localhost:3001): nodemon server.js
6. To start frontend (server runs at http://localhost:5173/): npm run dev
7. To run tests:
   - backend: jest
   - frontend: npm run test
8. To get your own NPS API Key (free of charge): https://www.nps.gov/subjects/developer/get-started.htm

Projects Docs: contains DB schema, React Front End Components schema, initial project idea and project proposal.
