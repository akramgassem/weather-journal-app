// Personal API Key for OpenWeatherMap API
const APIKEY = '&appid=5634753f647f1c17fecc7887a9adefe5';
const BASEURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
/* Global Variables */
const app = getElementById('app');
const zip = getElementById('zip');
const feelings = getElementById('feelings');
const generate = getElementById('generate');
const entryHolder = getElementById('entryHolder');

/**
 * Helper functions
 */
function getElementById(id) {
  return document.getElementById(id);
}

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

/* Function to GET Web API Data*/
const getWheatherData = async (zipcode) => {
  const response = await fetch(BASEURL + zipcode + APIKEY);
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
  console.log(data);
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  try {
    const newData = await response.json();
    console.log(newData);
    return newData;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to GET Project Data */
const getData = async () => {
  const response = await fetch('/all', {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    }
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log('error', error);
  }
};

// Event listener to add function to existing HTML DOM element
generate.addEventListener('click', () => {
  /* Function called by event listener */
  const data = {
    zip: zip.value,
    feelings: feelings.value
  };
  console.log(data);

  if (data.zip.length !== 0 ) {
	  getWheatherData(data.zip)
	  .then(result => {
		  console.log(result);
		  postData('/', {
			wheather: result,
			feelings: data.feelings
		});
	  }).then(result => {
		getData().then(data => data);  
	  }).catch(err => {
		  console.log(err);
	  })
  }
});
