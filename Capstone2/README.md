# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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

# Installation (TODO!!)

1. Clone locally the repository: git clone git@github.com:ykays/Capstone_Project_One.git
2. Install requirements:
   - backend: TODO!
   - frontend:
3. Create new DB locally: createdb parks
4. Replace the DB URI with parks in .env: DATABASE = ‘postgresql://grocery_db' TODO!
5. Run files to create and populate tables in this order:
   1. psql < parks.sql
      ( - parks.sql will create a new parks and parks_test db;
   - will create new set of tables
   - will run a seed file)
   2. node parksSeedApi.js
      (this file will call National Park (NPS) API to get the parks and parks activities and then populate the tables)
6. To start server: nodemon server.js
7. To start frontend:
8. To run tests:
   - backend: jest
   - frontend: npm run test
9. To get your own NPS API Key (free of charge):

Projects Docs: contains DB schema, React Front End Components schema, initial project idea and project proposal.
