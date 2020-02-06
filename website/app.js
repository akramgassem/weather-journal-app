/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Personal API Key for OpenWeatherMap API
const API_KEY = '&appid=5634753f647f1c17fecc7887a9adefe5';
const BASEURL ='api.openweathermap.org/data/2.5/weather?q=';
// Event listener to add function to existing HTML DOM element
document.addEventListener('click', () => {

  /* Function called by event listener */

});


/* Function to GET Web API Data*/

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