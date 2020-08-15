let numPeople;
let numPlanets;
let peopleData = [];
let planetsData = [];

const peopleBtn = document.querySelector('#btn-people');
const planetsBtn = document.querySelector('#btn-planets');
const buttonsContainer = document.querySelector('#buttons-container');

// Get number of people and planets that API can serve up.
// This is used in generating a random page (of 10 records)
async function init() {
  numPeople = await fetchCount('people');
  numPlanets = await fetchCount('planets');
  // Has there been any errors fetching the counts?
  if (numPeople === null || numPlanets === null) {
    document.querySelector('#container').innerHTML = "<h1>Error fetching data!</h1>";
    return false;
  } 
  // Show button container/was initially hidden
  buttonsContainer.style.display = 'block';
}
// Call function straightaway
init();


async function fetchCount(type) {
  if (type !== 'people' && type !== 'planets') return;  
  try {
    const resp = await fetch(`//swapi.dev/api/${type}/`);
    const json = await resp.json();
    // Return the number of records that the API can serve
    return json.count;
  } catch(err){
    console.log('Error fetching data: ' + err.message);
    return null;
  } 
}

// Preload and cache data on mouseover to speed up its display when a button is eventually clicked
peopleBtn.addEventListener('click', loadData);
peopleBtn.addEventListener('mouseover', loadData);

planetsBtn.addEventListener('click', loadData);
planetsBtn.addEventListener('mouseover', loadData);

// This function is an event listener that is called when a button is mouse over or clicked.
// The event object (that all event listeners have as a default parameter) is examined to see 
// what type of event it is. In both cases the function that fetches data that is associated with the button 
// is called with a true or false value passed in.
function loadData(evt) {
  if (evt.type === 'mouseover') {
    if (evt.target.id === 'btn-people') {
      fetchPeople(false);
    } else if (evt.target.id === 'btn-planets') {
      fetchPlanets(false);
    }
  } else if (evt.type === 'click') {
      if (evt.target.id === 'btn-people') {
        fetchPeople(true);
      } else if (evt.target.id === 'btn-planets') {
        fetchPlanets(true);
      }    
  }
}

// This function calls the fetchData function passing to populate the peopleData array 
// if it is empty. The 'people' string is passed in as an argument. 
// If the display variable is true then the displayPeople function is called 
// to display the data in the array which is passed in.
async function fetchPeople(display) {
  // Load data if it has not been loaded already
  if (peopleData.length === 0) {
    peopleData = await fetchData('people');
  }  
  if (display) {
    displayPeople(peopleData); 
  }
}

// See comments for the fetchPeople function
async function fetchPlanets(display) {
  if (planetsData.length === 0) {
    planetsData = await fetchData('planets');
  }  
  if (display) {
    displayPlanets(planetsData);
  }
}

// This function fetches data from the relevant swapi api based on the value of type. 
// This data is then converted to an array which is passed to the caller.
async function fetchData(type) {
  if (type !== 'people' && type !== 'planets') return;  
  // The API delivers records in batches of 10, this is a page
  let pageNumber, numPages;
  if (type === 'people') {
    // Account for partial pages by rounding number up
    numPages = Math.ceil(numPeople / 10);    
  }
  numPages = Math.ceil(numPlanets / 10);
  pageNumber = Math.floor(Math.random() * numPages) + 1;

  try {
    const resp = await fetch(`//swapi.dev/api/${type}/?page=${pageNumber}`);
    const json = await resp.json();    
    const data = await json.results;   
    return data;
  } catch(err){
    console.log('Error fetching data: ' + err.message);
  } 
}

function displayPeople(data) {
  let html = '';
  data.forEach(person => {
    let str = '<div class="card">';
    str += `<h2>${person.name}</h2>`;
    str += `<p><strong>Birth Year</strong>: ${person.birth_year}</p>`;
    str += `<p><strong>Homeworld</strong>: <a href="${person.homeworld}" class="link">${person.homeworld}</a></p>`;
    str += `<h3>Films</h3>`;   
    str += `<ul>`; 
    // Planets have usually been in more than one film so list them  
    person.films.forEach(film => {
      str += `<li><a class="link" href="${film}">${film}</a></li>`;
    });
    str += `</ul>`;    
    str += '</div>';
    html += str;
  });
  document.querySelector('#container').innerHTML = html;
}

function displayPlanets(data) {
  let html = ``;
  data.forEach(planet => {
    let str = `<div class="card">`;
    str += `<h2>${planet.name}</h2>`;
    str += `<p><strong>Diameter</strong>: ${Number(planet.diameter).toLocaleString('en-NZ')}Km</p>`;
    str += `<p><strong>Climate</strong>: <a href="${planet.climate}" class="link">${planet.climate}</a></p>`;
    str += `<p><strong>Population</strong>: ${Number(planet.population).toLocaleString("en-NZ")}</p>`;
    str += `<h3>Films</h3>`;   
    str += `<ul>`; 
    // Planets have usually been in more than one film so list them  
    planet.films.forEach(film => {
      str += `<li><a class="link" href="${film}">${film}</a></li>`;
    });
    str += `</ul>`;    
    str += `</div>`;
    html += str;
  });
  // Display formatted html on web page
  document.querySelector('#container').innerHTML = html;
}

