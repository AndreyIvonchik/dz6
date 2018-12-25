"use strict";
var countryField = document.getElementById("countryField");
var cityField = document.getElementById("cityField");
var searchBtn = document.getElementById("searchBtn");
var form = document.getElementById("form");
var loader = document.getElementById("loader");
var pagination = document.getElementById("pagination");
var response;
var country;
var city;
var type;
var page;
var filtr ={
  prise_min: "min",
  prise_max: "max",
  rooms_min: "min",
  rooms_max: "max",
  bedrooms_min: "min",
  bedrooms_max: "max",
  bathrooms_min: "min",
  bathrooms_max: "max"      
};
// var slider = document.getElementById('test-slider');

// noUiSlider.create(slider, {
//   start: [20, 80],
//   connect: true,
//   range: {
//       'min': 0,
//       'max': 100
//   }
// });

function createQuery(country, city, type, page, filtr){
  loader.style.display = "block"
  if(country == "au" || country == "br"){
    country = `com.${country}`;
  }
  if(country == "uk"){
    country = `co.${country}`;
  }
  var script = document.createElement('SCRIPT');
  script.src = `https://api.nestoria.${country}/api?action=search_listings&encoding=json&callback=callbackFunc&listing_type=${type}&place_name=${city}&page=${page}&price_min=${filtr.prise_min}&price_max=${filtr.prise_max}&bedroom_min=${filtr.bedrooms_min}&bedroom_max=${filtr.bedrooms_max}&room_min=${filtr.rooms_min}&room_max=${filtr.rooms_max}&bathroom_min=${filtr.bathrooms_min}&bathroom_max=${filtr.bathrooms_max}`;
  document.getElementsByTagName("head")[0].appendChild(script);
  script.onerror = function(){
    alert("Ошибка запроса");
    loader.style.display = "none";
  };
}

function callbackFunc(result){
  response = result.response;
   if(result.response.application_response_code == 200){
    alert("Unknown location");
  } 
  else if(result.response.listings.length == 0){
    alert("Not found");
  }
  else{
    console.log(response);
    addItems(result.response.listings);
    pagination.style.display = "block";
  }
  loader.style.display = "none";
}

function addItems(listings){
  loader.style.display = "none";
  while (content.children[2]) {
    content.removeChild(content.lastChild);
  }
  for (var i = 0; i < listings.length; i++){ 
    content.insertAdjacentHTML( "beforeEnd", `<div class="card horizontal">
                              <div class="card-image">
                                <img src= "${listings[i].img_url}">
                              </div>
                              <div class="card-stacked">
                                <div class="card-content">
                                  <p>${listings[i].title} Prise: ${listings[i].price_formatted} </p>
                                </div>
                                <div class="card-action center">
                                  <a href="#"><i id="elect" class="material-icons small">star_border</i></a>
                                </div>
                              </div>
                            </div>`);
  }
}

document.addEventListener("click", function(element) {
  if(element.target.id == "searchBtn"){
    country = countryField.options[countryField.selectedIndex].value;
    city = cityField.value;
    type = form.elements["group1"].value;
    page = 1;
    createQuery(country, city, type, page, filtr);
  }

  if(element.target.id == "pageRight"){
    page += 1;
    if(page > 50) page = 1;
    createQuery(country, city, type, page, filtr); 
  }
  
  if(element.target.id == "pageLeft"){
    page -= 1;
    if(page < 1) page = 50;
    createQuery(country, city, type, page, filtr);
  }

  if(element.target.id == "elect"){
    var pos = localStorage.length;
    var id = 0;//ДОБАВИТЬ ПОЛУЧЕНИЕ ID ЗАПИСИ
    var serialObj = JSON.stringify(response.listings[id]);
    localStorage.setItem(pos, serialObj);
  }

  if(element.target.id == "elects"){
    if(!localStorage.length){
      alert("No elects");
    } 
    else{
      pagination.style.display = "none";
      var listings = [];
      for (var key = 0; key < localStorage.length; key++) {
        var returnObj = JSON.parse(localStorage.getItem(key));
        listings.push(returnObj);
      }
      addItems(listings);
    }
  }
});


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, "options");
  });
