"use strict";
var countryField = document.getElementById("countryField");
var cityField = document.getElementById("cityField");
var searchBtn = document.getElementById("searchBtn");
var form = document.getElementById("form");
var loader = document.getElementById("loader");
var pagination = document.getElementById("pagination");
var modalTitle = document.getElementById("modalTitle");
var modalPrise = document.getElementById("modalPrise");
var modalDescr = document.getElementById("modalDescr");
var modalRooms = document.getElementById("modalRooms");
var modalBedrooms = document.getElementById("modalBedrooms");
var modalBathrooms = document.getElementById("modalBathrooms");
var modalLink = document.getElementById("modalLink");
var pageNumber = document.getElementById("pageNumber");
var sliderPrice = document.getElementById('slider-price');
var sliderRooms = document.getElementById('slider-rooms');
var sliderBedrooms = document.getElementById('slider-bedrooms');
var sliderBathrooms = document.getElementById('slider-bathrooms');
var electsClear = document.getElementById('electsClear');
var cardLink = document.getElementById('cardLink');
var modalImg = document.getElementById('modalImg');
var modalLinkMaps = document.getElementById('modalLinkMaps');
var response = {listings:[]};
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

function createQuery(country, city, type, page, filtr){
  loader.style.display = "block"
  if(country == "br"){
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
    addItems(result.response.listings);
    pagination.style.display = "block";
    pageNumber.innerHTML = page;
  }
  loader.style.display = "none";
}

function addItems(listings){
  loader.style.display = "none";
  while (content.children[0]) {
    content.removeChild(content.lastChild);
  }
  for (var i = 0; i < listings.length; i++){
    content.insertAdjacentHTML( "beforeEnd", `
    <a id="cardLink" onclick="addModalElements()" name="${i}" class="modal-trigger" href="#modal1">
    <div class="col s12 m12 cards">
        <div class="card horizontal">
            <div class="card-image">
                <img src="${listings[i].img_url}">
            </div>
            <div class="card-stacked">
                <div class="card-content">
                    <p class="price">${listings[i].price_formatted}</p>
                    <p class="title">${listings[i].title}</p>
                    <p class="descr">${listings[i].summary}</p>
                </div>
                <div class="card-action">
                    <a class="waves-effect waves-light btn grey lighten-5" id="elect" name="${i}">Add favorite</a>
                </div>
            </div>
        </div>
    </div>
</a>`);
  }
}
function addModalElements(){
  var id = event.currentTarget.name;
  modalTitle.innerHTML = response.listings[id].title;
  modalPrise.innerHTML = response.listings[id].price_formatted;
  modalDescr.innerHTML = response.listings[id].summary;
  modalBedrooms.innerHTML = "Bedrooms: " + response.listings[id].bedroom_number;
  modalBathrooms.innerHTML = "Bathrooms: " + response.listings[id].bathroom_number;
  modalLink.href = response.listings[id].lister_url;
  modalImg.src = response.listings[id].img_url;
  modalLinkMaps.href = `https://maps.google.com/?hl=ru&q=${response.listings[id].latitude},${response.listings[id].longitude}`
}

document.addEventListener("click", function(element) {
  if(element.target.id == "searchBtn"){
    electsClear.style.display = "none";
    country = countryField.options[countryField.selectedIndex].value;
    city = cityField.value;
    type = form.elements["group1"].value;
    page = 1;
    filtr.prise_min = sliderPrice.noUiSlider.get()[0];
    filtr.prise_max = sliderPrice.noUiSlider.get()[1];
    filtr.rooms_min = sliderRooms.noUiSlider.get()[0];
    filtr.rooms_max = sliderRooms.noUiSlider.get()[1];
    filtr.bedrooms_min = sliderBedrooms.noUiSlider.get()[0];
    filtr.bedrooms_max = sliderBedrooms.noUiSlider.get()[1];
    filtr.bathrooms_min = sliderBathrooms.noUiSlider.get()[0];
    filtr.bathrooms_max = sliderBathrooms.noUiSlider.get()[1];
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
    var id = element.target.name;
    var serialObj = JSON.stringify(response.listings[id]);
    localStorage.setItem(pos, serialObj);
  }

  if(element.target.id == "elects"){
    if(!localStorage.length){
      alert("Not found");
    }
    else{
      pagination.style.display = "none";
      electsClear.style.display = "inline-block";
      var listings = [];
      for (var key = 0; key < localStorage.length; key++) {
        var returnObj = JSON.parse(localStorage.getItem(key));
        listings.push(returnObj);
      }
      addItems(listings);
      response.listings = listings;
    }
  }
  if(element.target.id == "electsClear"){
    localStorage.clear();
    electsClear.style.display = "none";
    while (content.children[0]) {
      content.removeChild(content.lastChild);
    }
  }

});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, "options");
  });

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, "options");
});

  noUiSlider.create(sliderPrice, {
    start: [0, 5000000],
    connect: true,
    step: 100,
    range: {
        'min': 0,
        'max': 5000000
    },
    format: wNumb({
      decimals: 0,
    })
  });
  
  noUiSlider.create(sliderRooms, {
    start: [0, 50],
    connect: true,
    step: 1,
    range: {
        'min': 0,
        'max': 50
    },
    format: wNumb({
      decimals: 0,
    })
  });
  
  noUiSlider.create(sliderBedrooms, {
    start: [0, 50],
    connect: true,
    step: 1,
    range: {
        'min': 0,
        'max': 50
    },
    format: wNumb({
      decimals: 0,
    })
  });
  
  noUiSlider.create(sliderBathrooms, {
    start: [0, 50],
    connect: true,
    step: 1,
    range: {
        'min': 0,
        'max': 50
    },
    format: wNumb({
      decimals: 0,
    })
  });