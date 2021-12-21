/*    
//     This program utilizes the Star Wars API (https://swapi.dev/) to display the names, 
//    birth years, and homeworlds of every Star Wars character represented in the seven
//    Star Wars films up to The Force Awakens.
//
//    Author: William Gibson
*/
let swapiURLs = [
  'https://swapi.dev/api/people/?page=1',
  'https://swapi.dev/api/people/?page=2',
  'https://swapi.dev/api/people/?page=3',
  'https://swapi.dev/api/people/?page=4',
  'https://swapi.dev/api/people/?page=5',
  'https://swapi.dev/api/people/?page=6',
  'https://swapi.dev/api/people/?page=7',
  'https://swapi.dev/api/people/?page=8',
  'https://swapi.dev/api/people/?page=9'
]

// Variables for HTML searchbar, list, and pagination elements
const searchBar          = document.getElementById('searchBar');
const listElement        = document.getElementById('list');
const paginationElement  = document.getElementById('pagination');
let currentPage          = 1;
let pageCount            = swapiURLs.length;

// Searchbar eventlistener filters display list as input is entered in search bar
searchBar.addEventListener('keyup', (e) =>{

  let foundIndices    = [];                                     //holds indices of found names
  let foundCharacters = {                                       //object stores filtered results
    names:  [],
    births: [],
    worlds: []
  };

  const searchString = e.target.value.toLowerCase();  

  for(let i = 0; i < characterData.names.length; i++){             //populates array with indices of found names
    if (characterData.names[i].toLowerCase().includes(searchString))
      foundIndices.push(i);
  }

  for(let i = 0; i < foundIndices.length; i++){                    //populates foundCharacter object arrays
    foundCharacters.names.push  (characterData.names[foundIndices[i]]);
    foundCharacters.births.push (characterData.births[foundIndices[i]]);
    foundCharacters.worlds.push (characterData.worlds[foundIndices[i]]);
  }

  displayList(foundCharacters, listElement, currentPage);   //display list and setup pagination with
  setupPagination(foundCharacters, paginationElement);      //filtered results
});

// Creates buttons for pagination
// Creates buttons for each page with event listeners to fetch page data, update currentPage
// and update css styling for selected button
function setupPagination(){ 

  // Creates button for each page
  for(let i = 1; i < pageCount + 1; i++){
    let button        = document.createElement('button');
    button.innerText  = i;

    // Styles button 1 on page load 
    if(currentPage === i) button.classList.add('active');

    // Event listener for each button
    button.addEventListener('click', function(){         
      document.getElementById('list').innerHTML = '';     
      currentPage = i;
      fetchData();

      let currentBtn = document.querySelector('.pagination button.active');
      currentBtn.classList.remove('active');
      button.classList.add('active');
    })

    // Appends button to html pagination element
    paginationElement.appendChild(button);
  }
}

//  Fetches data
//  Populates characterData object names, births, and worlds arrays with data from api
//  Displays list of current page then sets up pagination (page select buttons)
fetchData = async () => {

  // Object to contain data of each character from current page
  let characterData = {                                           
    names:  [],
    births: [],
    worlds: []
  };

  let receivedData   = [];  // Name and birth year data                                     
  let worldData      = [];  // Homeworld data                                
  
  // Display loading icon
  dataLoading();

  // Fetch name and birth data
  await axios.get(swapiURLs[currentPage-1]).then(response => 
    receivedData = receivedData.concat(response.data.results)); 

  // Fetch homeworld data and update characterData object with 
  // receivedData and worldData
  for (let i = 0; i< receivedData.length; i++){

    await axios.get(receivedData[i].homeworld).then(response => 
      worldData = worldData.concat(response.data.name));

    characterData.names[i]  = receivedData[i].name;
    characterData.births[i] = receivedData[i].birth_year;
    characterData.worlds[i] = worldData[i];
  }

  // Remove loading icon and display character list
  dataDoneLoading();
  displayList(characterData, listElement);
}

// List display function
// Clears wrapper, selects and displays subset of data array based on page  
function displayList(data){
  
  listElement.innerHTML = '';

  // Create html elements to display data
  for (let i= 0; i < data.names.length; i++){

    // Create div element for each name
    let nameElement   = document.createElement('div');             
    let birthElement  = document.createElement('div');
    let worldElement  = document.createElement('div');

    // Add css classes for styling
    nameElement.classList.add('name');                             
    birthElement.classList.add('info');
    worldElement.classList.add('info');

    // Displays data text
    nameElement.innerText   = data.names[i];;                                
    birthElement.innerText  = 'Birth Year:  ' + data.births[i];;
    worldElement.innerText  = 'Homeworld:   ' + data.worlds[i];

    // Append elements to wrapper
    listElement.appendChild(nameElement);                              
    nameElement.appendChild(birthElement);
    nameElement.appendChild(worldElement);
  }
}

// Displays loading icon
function dataLoading(){
  let loadIcon  = document.createElement('div');
  loadIcon.id   = 'loader';
  loadIcon.classList.add('loader');

  let list = document.getElementById('list');
  list.appendChild(loadIcon);
}

// Removes loading icon
function dataDoneLoading(){
  let loadIcon            = document.getElementById('loader');
  loadIcon.style.display  = 'none';
}


setupPagination();
fetchData();
