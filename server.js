// Setup empty JS object to act as endpoint for all routes
let projectData = [];
// Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();
const router = express.Router();
/* Dependencies */
const cors = require("cors");
const bodyParser = require("body-parser");
/* Middleware*/

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Spin up the server
const port = 3000;
app.listen(port, () => {
  // Callback to debug
  console.log(`server running: http://localhost:${port}`);
});

// Initialize all route with a callback function
router.get('/:number', (req, res) => {
  console.log(req.params.number);
  let result;
  if (req.params.number.toLowerCase() === "all") {
    result = {
      data: projectData,
      message: "All Data sent!"
    };
  }
  result = projectData.length > 0 ? {
        data: projectData.slice(-req.params.number),
        message: "Data sent!"
      } : {
        data: "",
        message: "Project data is empty!"
      };

res.send(result);
});

app.use("/all/", router);

// Post Route
app.post("/", (req, res) => {
    projectData.push(req.body);
    res.send({ info: "data added with success" });
});


app.delete('/', (req, res) => {
  projectData = [];
  res.send( {message: 'All data deleted! generate new one.'});
});