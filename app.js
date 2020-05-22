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

let personData = [];
let worldData  = [];

const listElement        = document.getElementById('list');
const paginationElement  = document.getElementById('pagination');
let currentPage          = 1;
const rows               = 10; 

//  Populate personData array with data from api then display list and setup pagination
updateData = async () => {
  dataLoading();

  for(let i = 0; i < swapiURLs.length; i++){
    await axios.get(swapiURLs[i]).then(response => personData = personData.concat(response.data.results));  
    //--Add error handling--
  }

  for (let i = 0; i< personData.length; i++){
    await axios.get(personData[i].homeworld).then(response => worldData = worldData.concat(response.data));
  }
  doneLoading();
  displayList(personData, listElement, rows, currentPage);
  setupPagination(personData, paginationElement, rows);
}

//  Clears wrapper, selects and displays subset of data array based on page  
function displayList(data, wrapper, rows, page){
  wrapper.innerHTML = '';
  page--;                                             //match page to zero-based array

  let start = rows * page;
  let end = start + rows;
  let paginatedData = data.slice(start, end);        //select subset from array

  for (let i= 0; i< paginatedData.length; i++){

    let name  = paginatedData[i].name;
    let birth = 'Birth Year:  ' + paginatedData[i].birth_year;
    let world = 'Homeworld:   ' + worldData[i].name;

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
function setupPagination(data, wrapper, rows){
  
  wrapper.innerHTML = '';

  let pageCount = Math.ceil(data.length / rows);       //Includes final page with <10 names

  for(let i = 1; i < pageCount + 1; i++){
    let btn = paginationButton(i, data);
    wrapper.appendChild(btn);
  }
}

//  creates and returns button for page
function paginationButton(page, data){
  let button = document.createElement('button');
  button.innerText = page;

  if(currentPage === page) button.classList.add('active');

  button.addEventListener('click', function(){           //Display list for page of button
    currentPage = page;
    displayList(data, listElement, rows, currentPage);

    let currentBtn = document.querySelector('.pagination button.active');
    currentBtn.classList.remove('active');
    button.classList.add('active');
  })

  return button;
}

function dataLoading(){
  let loadIcon = document.createElement('div');
  loadIcon.classList.add('loader');
  loadIcon.id = 'loader';

  let list = document.getElementById('list');
  list.appendChild(loadIcon);
}

function doneLoading(){
  let loadIcon = document.getElementById('loader');
  loadIcon.style.display = 'none';
}

updateData();