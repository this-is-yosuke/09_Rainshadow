import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
// I NEED TO GENERATE THE DIST FOLDER FIRST. RESOLVE HTMLROUTES ERRORS BEFORE THAT
app.use(express.static(''));
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
