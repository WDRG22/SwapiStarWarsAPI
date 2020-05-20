let button = document.querySelector('#searchButton');
let name = document.querySelector('#name');


function getInfo(){
  axios.get('https://swapi.dev/api/people/1').then(function(response){
    updateInfo(response.data);
  });
}

function updateInfo(data){
  name.innerText = data.name;
}

button.addEventListener('click', getInfo);