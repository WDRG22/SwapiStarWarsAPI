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

const listElement = document.getElementById('list');
const paginationElement = document.getElementById('pagination');
let currentPage = 1;
const rows = 10; 

//  Populate personData array with data from api 
updateData = async () => {

  for(let i = 0; i < swapiURLs.length; i++){
    await axios.get(swapiURLs[i]).then(response => personData = personData.concat(response.data.results));
    //--Add error handling--
  }

  console.log(personData);
  displayList(personData, listElement, rows, currentPage);
  setupPagination(personData, paginationElement, rows);
}

//  Clears wrapper, selects and displays subset of data array based on page  
function displayList(data, wrapper, rows, page){
  wrapper.innerHTML = '';
  page--;                                             //match page to zero-based array

  let start = rows * page;
  let end = start + rows;
  let paginatedItems = data.slice(start, end);        //select subset from array

  for (let i= 0; i< paginatedItems.length; i++){

    let item = paginatedItems[i].name;
    let itemElement = document.createElement('div');  //create html element for each item

    itemElement.classList.add('item');
    itemElement.innerText = item;                     //display item

    wrapper.appendChild(itemElement);
  }
}

//  calls paginationButton for each page
function setupPagination(data, wrapper, rows){
  
  wrapper.innerHTML = '';

  let pageCount = Math.ceil(data.length / rows);       //Includes final page with <10 items

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

updateData();