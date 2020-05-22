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

  //parallel arrays
let personData  = [];
let nameData    = [];
let birthData   = [];
let worldData   = [];

const searchBar          = document.getElementById('searchBar');
const listElement        = document.getElementById('list');
const paginationElement  = document.getElementById('pagination');
const rows               = 10; 
let currentPage          = 1;

// 
searchBar.addEventListener('keyup', (e) =>{
  const searchString = e.target.value;
  let foundNameIndex = [];
  
  for(let i = 0; i < nameData.length; i++)  //populate array with indices of names containing searched string
    if(nameData[i].includes(searchString))
      foundNameIndex.push(i);
});

//  Populate personData array with data from api then display list and setup pagination
updateData = async () => {
  dataLoading();

  for(let i = 0; i < swapiURLs.length; i++){
    await axios.get(swapiURLs[i]).then(response => personData = personData.concat(response.data.results));  
    //--Add error handling--
  }

  for (let i = 0; i< personData.length; i++){
    nameData[i]   = personData[i].name;
    birthData[i]  = personData[i].birth_year;
    await axios.get(personData[i].homeworld).then(response => worldData = worldData.concat(response.data.name));
  }

  doneLoading();
  displayList(listElement, rows, currentPage);
  setupPagination(paginationElement, rows);
}

//  Clears wrapper, selects and displays subset of data array based on page  
function displayList(wrapper, rows, page){
  wrapper.innerHTML = '';
  page--;                                             //match page to zero-based array

  let start = rows * page;
  let end   = start + rows;

  let paginatedNames = nameData.slice(start, end);    //create subsets from each array to display per page
  let paginatedBirth = birthData.slice(start, end);
  let paginatedWorld = worldData.slice(start, end); 

  //loop creates div elements to display data
  for (let i= 0; i< paginatedNames.length; i++){

    let name  = paginatedNames[i];
    let birth = 'Birth Year:  ' + paginatedBirth[i];
    let world = 'Homeworld:   ' + paginatedWorld[i];

    let nameElement   = document.createElement('div');  //create html element for each name
    let birthElement  = document.createElement('div');
    let worldElement  = document.createElement('div');

    nameElement.classList.add('name');
    birthElement.classList.add('info');
    worldElement.classList.add('info');

    nameElement.innerText   = name;                     //display name
    birthElement.innerText  = birth;
    worldElement.innerText  = world;

    wrapper.appendChild(nameElement);
    nameElement.appendChild(birthElement);
    nameElement.appendChild(worldElement);
  }
}

//  calls paginationButton for each page
function setupPagination(wrapper, rows){
  
  wrapper.innerHTML = '';
  console.log()
  let pageCount     = Math.ceil(nameData.length / rows);       //Includes final page with <10 names
  console.log('HERE: ' + pageCount)

  for(let i = 1; i < pageCount + 1; i++){
    let btn = paginationButton(i);
    wrapper.appendChild(btn);
  }
}

//  creates and returns button for page
function paginationButton(page){
  let button        = document.createElement('button');
  button.innerText  = page;

  if(currentPage === page) button.classList.add('active');

  button.addEventListener('click', function(){           //Display list for page of button
    currentPage = page;
    displayList(listElement, rows, currentPage);

    let currentBtn = document.querySelector('.pagination button.active');
    currentBtn.classList.remove('active');
    button.classList.add('active');
  })

  return button;
}

function dataLoading(){
  let loadIcon  = document.createElement('div');
  loadIcon.id   = 'loader';
  loadIcon.classList.add('loader');

  let list = document.getElementById('list');
  list.appendChild(loadIcon);
}

function doneLoading(){
  let loadIcon            = document.getElementById('loader');
  loadIcon.style.display  = 'none';
}

updateData();