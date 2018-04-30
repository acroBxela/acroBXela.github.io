 var map;
 var gray = document.getElementById("grayOut");
 var layer = document.getElementById("layer1");
 var phones = [];

 function initMap() {
         map = new google.maps.Map(document.getElementById('map'), {
         zoom: 21,
         fullscreenControl:false,
         streetViewControl: false,
         rotateControl:false,
         zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
          }

     });

     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
             var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
             map.setCenter(pos);
         }, undefined)

     }


        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');

        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        searchBox.addListener('places_changed', function() {
         var places = searchBox.getPlaces();
        var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
        map.fitBounds(bounds);
        });

      }

 function hideGray() {
     gray.style.display = "none";
 }

 function hideLayer() {
     layer.style.display = "none";
 }

 function showGray() {
     gray.style.display = "flex";
 }

 function showLayer() {
     layer.style.display = "flex";
 }
 var confirm;

 function addPhone() {
     for (var i = 0; i < markersArray.length; i++) {
         markersArray[i].setMap(null);
     }
     hideGray();
     hideLayer();
     confirm = document.getElementById("confirmDiv");
     confirm.style.display = "flex";

     google.maps.event.addListener(map, "click", (event) => { markerPlacement(event); });
 }

 var cMark = "first";

 function markerPlacement(event) {

     if (cMark !== "first")
         cMark.setMap(null);
     cMark = new google.maps.Marker({
         position: event.latLng,
         map: map
     });

 }

 function setInfo() {
     if (cMark !== "first") {
         document.getElementById("modelType").value = "";
         document.getElementById("desc").value = "";
         confirm.style.display = "none";
         showLayer();
         showGray();

         document.getElementById("selectEvent").style.display = "none";
         document.getElementById("setUpBox").style.display = "inline-block";
     }
 }

 function dataAdd() {

     phones.push({
         pos: cMark.position,
         description: document.getElementById("desc").value,
         model: document.getElementById("modelType").value
     });
     cMark.setMap(null);
     cMark = "first";
     document.getElementById("selectEvent").style.display = "flex";
     document.getElementById("setUpBox").style.display = "none";
     google.maps.event.clearListeners(map, 'click');
 }
 var markersArray = [];

 function showPhones() {
     document.getElementById("back").style.display = "block";
     hideGray();
     hideLayer();

     for (var i = 0; i < phones.length; i++) {

         var marker = new google.maps.Marker({
             position: phones[i].pos,
             map: map,
             loc: i
         });
         markersArray.push(marker);
         google.maps.event.addListener(marker, 'click', (function(marker, i) {

             return function() {
                 openBox(i);
                 moveTo(marker);
             }

         })(marker, i));
     }

 }
 var opened = false;

 function openBox(id) {
     console.log(phones[id].model);
     if (!opened) {
         document.getElementById("phoneInfo").style.display = "block";
         opened = true;
     }
     document.getElementById("modelNumber").innerHTML = phones[id].model;
     document.getElementById("foundAroundDisplay").innerHTML = phones[id].description;

 }
function moveTo (marker){
    map.setZoom(21);
    map.panTo(marker.position);
}
 function back() {
     opened = false;
     document.getElementById("phoneInfo").style.display = "none";
     document.getElementById("back").style.display = "none";
     showGray();
     showLayer();

 }

 function closeBox() {
     document.getElementById("phoneInfo").style.display = "none";
     opened = false;
 }
