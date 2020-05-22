
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

let characterData = {                                           //global character object
  names:  [],
  births: [],
  worlds: []
};

const searchBar          = document.getElementById('searchBar');  //variables for pagination and search bar
const listElement        = document.getElementById('list');
const paginationElement  = document.getElementById('pagination');
const rows               = 10; 
let currentPage          = 1;

//Filters display list as input entered in search bar
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

  displayList(foundCharacters, listElement, rows, currentPage);   //display list and setup pagination with
  setupPagination(foundCharacters, paginationElement, rows);      //filtered results
});

//  Primary function
//  Populates characterData object name, birth, world arrays with data from api
//  Displays initial list (first page) then sets up pagination
updateData = async () => {

  let receivedData   = [];                                         //Used for general data fetching
  let worldData      = [];                                         //used to fetch homeworld data
  
  dataLoading();

  for(let i = 0; i < swapiURLs.length; i++){

    await axios.get(swapiURLs[i]).then(response => 
      receivedData = receivedData.concat(response.data.results));  //fetch person data
  }

  for (let i = 0; i< receivedData.length; i++){

    await axios.get(receivedData[i].homeworld).then(response => 
      worldData = worldData.concat(response.data.name));          //fetch homeworld data

    characterData.names[i]  = receivedData[i].name;
    characterData.births[i] = receivedData[i].birth_year;
    characterData.worlds[i] = worldData[i];
  }

  console.log(characterData);
  doneLoading();                                                  //remove loading icon, call displayList and setupPagination
  displayList(characterData, listElement, rows, currentPage);
  setupPagination(characterData, paginationElement, rows);
}

//  Clears wrapper, selects and displays subset of data array based on page  
function displayList(data, wrapper, rows, page){
  wrapper.innerHTML = '';
  page--;                                                         //align page with zero-based array

  let start = rows * page;
  let end   = start + rows;

  let paginatedCharData = {
    names:  data.names.slice(start, end),
    births: data.births.slice(start, end),
    worlds: data.worlds.slice(start, end)
  }

  //loop creates html elements to display data
  for (let i= 0; i < paginatedCharData.names.length; i++){

    let name  = paginatedCharData.names[i];
    let birth = 'Birth Year:  ' + paginatedCharData.births[i];
    let world = 'Homeworld:   ' + paginatedCharData.worlds[i];

    let nameElement   = document.createElement('div');             //create div element for each name
    let birthElement  = document.createElement('div');
    let worldElement  = document.createElement('div');

    nameElement.classList.add('name');                             //add css classes for styling
    birthElement.classList.add('info');
    worldElement.classList.add('info');

    nameElement.innerText   = name;                                //displays data text
    birthElement.innerText  = birth;
    worldElement.innerText  = world;

    wrapper.appendChild(nameElement);                              //append elements to wrapper
    nameElement.appendChild(birthElement);
    nameElement.appendChild(worldElement);
  }
}

// Determines page count and calls paginationButton for each page
function setupPagination(data, wrapper, rows){
  
  wrapper.innerHTML = '';
  let pageCount     = Math.ceil(data.names.length / rows);       //Math.ceil includes final page with <10 names

  for(let i = 1; i < pageCount + 1; i++){
    let btn = paginationButton(data, i);
    wrapper.appendChild(btn);
  }
}

//  creates and returns button for page, corresponding list on button click
function paginationButton(data, page){
  let button        = document.createElement('button');
  button.innerText  = page;

  if(currentPage === page) button.classList.add('active');

  button.addEventListener('click', function(){                        //Display list for page of clicked button
    currentPage = page;
    displayList(data, listElement, rows, currentPage);

    let currentBtn = document.querySelector('.pagination button.active');
    currentBtn.classList.remove('active');
    button.classList.add('active');
  })

  return button;
}

//  Displays loading icon
function dataLoading(){
  let loadIcon  = document.createElement('div');
  loadIcon.id   = 'loader';
  loadIcon.classList.add('loader');

  let list = document.getElementById('list');
  list.appendChild(loadIcon);
}

//  Removes loading icon
function doneLoading(){
  let loadIcon            = document.getElementById('loader');
  loadIcon.style.display  = 'none';
}

updateData();