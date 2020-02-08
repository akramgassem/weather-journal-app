// Personal API Key for OpenWeatherMap API
const APIKEY = "&appid=5634753f647f1c17fecc7887a9adefe5";
const BASEURL = "https://api.openweathermap.org/data/2.5/weather?";
/* Global Variables */
const app = getElementById("app");
const zip = getElementById("zip");
const feelings = getElementById("feelings");
const generate = getElementById("generate");
const locationElement = getElementById("location");
const entryHolder = getElementById("entryHolder");
const positionHolder = getElementById("position");
const info = getElementById("info");
const entriesCount = getElementById("entriesCount");
let lastEntriesCount = 3;
const switchButton = getElementById("switch");
const deleteEntries = getElementById("delete");

// init state for input - label and switch button
let switchState = {
  placeholder: "enter a city name here",
  label: "Enter a City name here",
  buttonText: "By Zipcode",
  toCityquery: false
};

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

// add zero to number between 0-9
function addZero(num) {
  if (num >= 0 && num <= 9 ) {
    return `0${num}`;
  } else {
    return num;
  }
}

// intialize all UI values
const initValues = () => {
  zip.value = "";
  feelings.value = "";
  // positionHolder.textContent = '';
  // positionHolder.removeAttribute('data-lat');
  // positionHolder.removeAttribute('data-long');
  info.innerText = "";
  info.classList.remove("info__bg");
};
/**
 * End Helper functions
 */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = addZero(d.getMonth() + 1) + "." + addZero(d.getDate()) + "." + d.getFullYear();

// Update UI with 3 most recent entries
const updateUI = data => {
  const recent = data.map(entrie => {
    let element = document.createDocumentFragment();
    if (entrie.wheather.cod === 200) {
      const {
        feelings: feel,
        time: date,
        wheather: {
          main: { temp: temp },
          name: name,
          sys: { country: country }
        }
      } = entrie;

      element = `
      <div class="subentry">
      <div id = "date">
      <span class="field">📅 Date: </span>
      <span>${date}</span>
      </div> 
      <div id = "temp">
      <span class="field">🌡 Temperature: </span>
      <span>${convert(temp).F}F°/ ${convert(temp).C}C°</span>
      </div>
      <div id ="content">
      <span class="field">✏ Feelings: </span>
      <span>"${feel} in ${name}, ${country}."</span>
      </div>
      </div>
      `;
    } else {
      const {
        feelings: feel,
        time: date,
        wheather: { message: msg }
      } = entrie;
      element = `
      <div class="subentry">
      <div id = "date">
      <span class="field">📅 Date: </span>
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

  entryHolder.innerHTML = recent.reverse().join("");
  initValues();
};

// info-dialog appear in top viewport
const infoDialog = (options = {}, cb = () => {}) => {
  const clearTimer = () => {
    clearTimeout(timer);
    info.innerHTML = "";
    info.classList.remove("info__bg");
  };
  const { msg, close, secs } = options;

  let closeElement = close ? `<span class="close">close</span>` : ``;
  info.innerHTML = `
  <div class="wrapper">
    <span>${msg}</span>
    ${closeElement}
  </div>
  `;
  info.classList.add("info__bg");
  const timer = setTimeout(() => {
    info.innerHTML = "";
    info.classList.remove("info__bg");
  }, secs);

  let event = close ? document.querySelector(".close").addEventListener("click", clearTimer) : "";
  cb();
};

/**
 * Create button proceed in info-dialog if user wish to
 * generate without writing his feelings.
 */
const proceed = () => {
  proceedElement = document.createElement("button");
  proceedElement.setAttribute("id", "proceed");
  proceedElement.innerText = "😬 Proceed without feelings!";
  info.append(proceedElement);
  // Event listener to add proceed without feelings.
  proceedElement.addEventListener("click", () => {
    const data = {
      zip: zip.value === "" ? null : zip.value,
      pos: positionUI(),
      feelings: "...",
      time: newDate
    };
    performGenerate(data);
  });
};
// get lon lat from ui
const positionUI = () => {
  return {
    lat: positionHolder.getAttribute("data-lat"),
    lon: positionHolder.getAttribute("data-long")
  };
};

/**
 *
 * @param {{lat: String; lon: String}} pos
 * position longitude and latitude from UI
 */
const passQuery = pos => {
  if (zip.value.length !== 0 && feelings.value.length !== 0) {
    return {
      zip: zip.value,
      pos: pos,
      feelings: feelings.value,
      time: newDate
    };
  } else if (pos.lat !== null && feelings.value.length !== 0) {
    return {
      zip: null,
      pos: pos,
      feelings: feelings.value,
      time: newDate
    };
  } else if (
    feelings.value.length === 0 &&
    (zip.value.length !== 0 || pos.lat !== null)
  ) {
    infoDialog(
      { msg: "🐶 Just add some feelings‼", secs: 6000, close: true },
      proceed
    );
    return null;
  } else {
    infoDialog({
      msg: "🐶 Please enter a zipcode or get your location ‼",
      secs: 6000,
      close: true
    });
    return null;
  }
};

// get user location using geolocation brwoser API
const getLocation = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  const success = pos => {
    const latitude = pos.coords.latitude.toFixed(2);
    const longitude = pos.coords.longitude.toFixed(2);
    positionHolder.setAttribute("data-lat", latitude);
    positionHolder.setAttribute("data-long", longitude);
    positionHolder.textContent = `🦅 Latitude: ${latitude} °, 🦉 Longitude: ${longitude} °`;
  };

  const error = err => {
    console.warn(`ERREUR (${err.code}): ${err.message}`);
  };

  if (!navigator.geolocation) {
    positionHolder.textContent =
      "🦝 Geolocation is not supported by your browser ‼";
  } else {
    positionHolder.textContent = "🦥 Locating…";
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
};

/* Function to GET data from openWeather API*/
const getWheatherData = async (zip = null, pos = { lat: 0, lon: 0 }) => {
  const zipcode = switchState.toCityquery ? `q=${zip}` : `zip=${zip}`; // switch between cityName or zipcode query api
  const position = `lat=${pos.lat}&lon=${pos.lon}`; // default 0,0
  let query =
    (zip !== null && Number(pos.lat) === 0) || zip !== null ? zipcode : position;
  // switch between pos or zip
  const response = await fetch(BASEURL + query + APIKEY);
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

/* Function to POST data  to local server*/
const deleteData = async (url = "") => {
  const response = await fetch(url, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    }
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

/* Function to POST data  to local server*/
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

/* Function to GET Project Data */
const getRecentData = async () => {
  const url = "/all/" + lastEntriesCount;
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    }
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

// perform generate function
const performGenerate = async data => {
  infoDialog({ msg: "Loading...", secs: 20000, close: false });
  getWheatherData(data.zip, data.pos) // get weather data from openWeather api
    .then(result => {
      postData("/", {
        // post object to local server
        wheather: result,
        time: data.time,
        feelings: data.feelings
      });
    })
    .then(_ => {
      let recent = getRecentData().then(rr => {
        // get data saved from local server
        if (rr.data) {
          updateUI(rr.data); // update UI with 3 last entries
        }
      });
      return recent;
    })
    .catch(err => {
      console.log(err);
    });
};

const changeEntriesCount = () => {
  lastEntriesCount = entriesCount.value;
  getRecentData().then(rr => {
    // get data saved from local server
    if (rr.data) {
      updateUI(rr.data); // update UI with 3 last entries
    }
  });
};

// Switch button and UI input zipcode or cityname
const switchQueryInput = () => {
  const currentState = {
    placeholder: zip.placeholder,
    label: document.querySelector('label[for="zip"]').innerText,
    buttonText: switchButton.innerText,
    toCityquery: !switchState.toCityquery
  };
  switchState.toCityquery = !switchState.toCityquery;
  zip.placeholder = switchState.placeholder;
  switchButton.innerText = switchState.buttonText;
  document.querySelector('label[for="zip"]').innerText = switchState.label;

  switchState = {
    placeholder: currentState.placeholder,
    label: currentState.label,
    buttonText: currentState.buttonText,
    toCityquery: currentState.toCityquery
  };
  console.log(switchState);
};

// Event listener to get location position
locationElement.addEventListener("click", getLocation);

// Event listener to add function to existing HTML DOM element
generate.addEventListener("click", () => {
  const data = passQuery(positionUI());
  if (data !== null) {
    /* Function called by event listener */
    performGenerate(data);
  }
});

// change last entries count button
entriesCount.addEventListener("change", changeEntriesCount);

deleteEntries.addEventListener("click", () => {
  deleteData().then(rr => {
    entryHolder.innerText = rr.message;
  });
});

switchButton.addEventListener("click", switchQueryInput);
changeEntriesCount();
