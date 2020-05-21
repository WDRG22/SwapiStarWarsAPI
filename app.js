//initialize data arrays and declare next button
let nameArray   = [];
let birthArray  = [];
let worldArray  = [];
let nextBtn     = document.querySelector('#nextBtn');

//populate arrays with references to proper html elements
for(let i=0; i<10; i++){

  nameArray[i]  = document.querySelector('#name' + i).childNodes[0];
  birthArray[i] = document.querySelector('#birth' + i);
  worldArray[i] = document.querySelector('#world' + i);
}

function getInfo(){

  let swapiURL = 'https://swapi.dev/api/people/';

  //get data from server, update html elements with data
  axios.get(swapiURL).then(function(response){
    updateInfo(response.data.results);
  }).catch(function(){
    updateInfoError();
  })
}

function updateInfo(data){

  for(let i=0; i< 10; i++){

    nameArray[i].nodeValue  = data[i].name; //update nodeValue so nested lists aren't overwritten
    birthArray[i].innerText = `Birth Year:  ${data[i].birth_year}`;

    //data[i].homeworld returns url. Request and pass planet data to updatePlanetName(data)
    axios.get(data[i].homeworld).then(function(response){
      worldArray[i].innerText = "Home planet: " + response.data.name; 
    }).catch;
  }
}

function updateInfoError(){

  for(let i=0; i< 10; i++){

    nameArray[i].innerText    = 'Oops, error!';
    birthArray[i].innerText   = '';
    worldArray[i].innerText   = '';
  }
}

function updateWorldsError(){

  for(let i=0; i< 10; i++){

    worldArray[i].innerText = 'Oops, error!'
  }
}

nextBtn.addEventListener('click', getInfo);