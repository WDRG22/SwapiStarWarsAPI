let swapiURLs = [
  'https://swapi.dev/api/people/?page=1',
  'https://swapi.dev/api/people/?page=2',
  'https://swapi.dev/api/people/?page=3',
  'https://swapi.dev/api/people/?page=4',
  'https://swapi.dev/api/people/?page=5',
  'https://swapi.dev/api/people/?page=6',
  'https://swapi.dev/api/people/?page=7',
  'https://swapi.dev/api/people/?page=8',
  'https://swapi.dev/api/people/?page=9']

let characterData    = [];                                        //Array of arrays contains character's name, birth and homeworld

const searchBar          = document.getElementById('searchBar');  //variables for pagination and search bar
const listElement        = document.getElementById('list');
const paginationElement  = document.getElementById('pagination');
const rows               = 10; 
let currentPage          = 1;


searchBar.addEventListener('keyup', (e) =>{
  const searchString = e.target.value;
  let foundNameIndex = [];
  
  for(let i = 0; i < nameData.length; i++)                        //populate array with indices of names containing searched string
    if(nameData[i].includes(searchString))
      foundNameIndex.push(i);
});

//  Primary function that calls all other functions
//  Populates characterData array with name, birth, world data from api
//  Displays initial list (first page) then sets up pagination
updateData = async () => {

  let receivedData   = [];                                         //Used for general data fetching
  let worldData      = [];                                         //used to fetch homeworld data
  
  dataLoading();

  for(let i = 0; i < swapiURLs.length; i++){
    await axios.get(swapiURLs[i]).then(response => 
      receivedData = receivedData.concat(response.data.results));  //fetch person data

    //--Add error handling--
  }

  for (let i = 0; i< receivedData.length; i++){
    await axios.get(receivedData[i].homeworld).then(response => 
      worldData = worldData.concat(response.data.name));          //fetch homeworld data

    characterData[i] =                                            //populate array of arrays
    [
      receivedData[i].name, 
      receivedData[i].birth_year,
      worldData[i]
    ]
  }

  doneLoading();                                                  //remove loading icon, call displayList and setupPagination
  displayList(listElement, rows, currentPage);
  setupPagination(paginationElement, rows);
}

//  Clears wrapper, selects and displays subset of data array based on page  
function displayList(wrapper, rows, page){
  wrapper.innerHTML = '';
  page--;                                                         //match page to zero-based array

  let start = rows * page;
  let end   = start + rows;

  let paginatedCharData = characterData.slice(start, end);
  console.log(paginatedCharData);

  //loop creates html elements to display data
  for (let i= 0; i< paginatedCharData.length; i++){

    let name  = paginatedCharData[i][0];
    let birth = 'Birth Year:  ' + paginatedCharData[i][1];
    let world = 'Homeworld:   ' + paginatedCharData[i][2];

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
function setupPagination(wrapper, rows){
  
  wrapper.innerHTML = '';
  let pageCount     = Math.ceil(characterData.length / rows);       //Math.ceil includes final page with <10 names

  for(let i = 1; i < pageCount + 1; i++){
    let btn = paginationButton(i);
    wrapper.appendChild(btn);
  }
}

//  creates and returns button for page, corresponding list on button click
function paginationButton(page){
  let button        = document.createElement('button');
  button.innerText  = page;

  if(currentPage === page) button.classList.add('active');

  button.addEventListener('click', function(){                        //Display list for page of clicked button
    currentPage = page;
    displayList(listElement, rows, currentPage);

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