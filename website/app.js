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
/**
 * 
 * @param {number} K 
 * convert Kelvin to F° and C°
 */
function convert(K) {
  return {
		C: Math.round(K - 273.15),
		F: Math.round(((K - 273.15) * 9) / 5 + 32)
	};
}


// Update UI with 3 most recent entries
const updateUI = (data) => {
  const recent = data.map(entrie => {

    let element = document.createDocumentFragment();
    if (entrie.wheather.cod === 200) {
      const {
        feelings: feel,
        time: date,
        wheather: {
          main: { temp: temp },
          name: name,
          sys: {
            country: country
          }
        }
      } = entrie;
      
      element = `
      <div class="subentry">
      <div id = "date">
      <span class="field">Date: </span>
      <span>${date}</span>
      </div> 
      <div id = "temp">
      <span class="field">Temperature: </span>
      <span>${convert(temp).F}F°/ ${convert(temp).C}C°</span>
      </div>
      <div id ="content">
      <span class="field">Feelings: </span>
      <span>"${feel} in ${name}, ${country}."</span>
      </div>
      </div>
      `;
    } else {
      const {
        feelings: feel,
        time: date,
        wheather: {
          message: msg
        }
      } = entrie;
       element = `
      <div class="subentry">
      <div id = "date">
      <span class="field">Date: </span>
      <span>${date}</span>
      </div> 
      <div>
      <span class="field__error">Aghh... ${msg}! Try another zipcode.</span>
      </div>
      </div>
      `;
    }
    return element;
  });

  entryHolder.innerHTML = recent.join('');

};
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
    return newData;
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to GET Project Data */
const getRecentData = async () => {
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
    feelings: feelings.value,
    time: newDate
  };

  if (data.zip.length !== 0 && data.feelings.length !== 0 ) {
	  getWheatherData(data.zip)
	  .then(result => {
		  postData('/', {
      wheather: result,
      time: data.time,
			feelings: data.feelings
		});
	  }).then(_ => {
      let recent = getRecentData().then(rr => {
        const recentEntries = rr.data.slice(-3);
        updateUI(recentEntries);
      }); 
    return recent;
	  }).catch(err => {
		  console.log(err);
	  });
  }
});
