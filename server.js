// Setup empty JS object to act as endpoint for all routes
const projectData = [];
// Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();

/* Dependencies */
const cors = require('cors');
const bodyParser = require('body-parser');
/* Middleware*/

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Spin up the server
const port = 3000;
app.listen(port, () => {
  // Callback to debug
	console.log(`server running: http://localhost:${port}`);
});

// Initialize all route with a callback function
app.use('/all', (req, res) => {
  // Callback function to complete GET '/all'
  let result;
  if (projectData.length > 0 ) {
    result = {
      data: projectData,
      message: 'Data sent!'
    }
    console.log('Data sent!');
  } else {
    result = {
      data: '',
      message: 'Project data is empty!'
    }
    console.log('Project data is empty!')
  }
  res.send(result);
});

// Post Route
app.post('/', (req, res) => {
  console.log('Post received');
  projectData.push(req.body);
  res.send({info: 'data added with success'});
});