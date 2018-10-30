
var map,largeInfowindow,avm;

function initInfowindow() {
  //Create infowindow for the marker
  largeInfowindow = new google.maps.InfoWindow();
}
//Map
var makeMap = function(){
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 34.0076259, lng: -84.6371447},
  zoom: 12,
  mapTypeControl: false
})
};
//Start LocationModel
var LocationModel = function(data, index){
  var self = this;

  this.title = data.title;
  this.location = data.location;
  this.address = data.address;
  this.city = data.city;
  this.marker = data.marker;
  this.res_id = data.res_id;

  //Custom Markers
  this.customMarker = { url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"};
//set up marker
  this.marker = new google.maps.Marker({
    position: data.location,
    title:data.title,
    animation: google.maps.Animation.DROP,
    city:data.city,
    visible: false
  });

//pupulateinfowindow
  this.populateInfoWindow = function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      console.log(data)

      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  };
  //end populateInfoWindow

  //mouseover
  this.marker.addListener('mouseover',function(){
    this.setIcon(self.customMarker);
  });
  //mouseout
  this.marker.addListener('mouseout',function(){
    this.setIcon(null);
  });
  //click
  this.marker.addListener('click', function() {
    self.clickedMarker(this, largeInfowindow);
  });
  //clickedMarker
  this.clickedMarker = function(marker, infoWindow) {
    map.panTo(marker.position);
    self.populateInfoWindow(marker, largeInfowindow);
  }; // end of clickedMarker
}
//End LocationModel

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
var AppViewModel = function(){
    var self = this;

    //makeMap
    makeMap();

    this.locations = ko.observableArray([]);
    this.searchAddress = ko.observable('');

    //function for ko observables
    this.addData = function(argument){
      for (var i=0; i < data.length; i++){
        argument.push(new LocationModel(data[i],i));
      }
    };

    this.addData(self.locations());

    //function to add delay in dropping markers on map
  this.addMarkers = function(position) {
    position.setMap(map);
  };

  this.showLocations = function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < self.locations().length; i++) {
      self.addMarkers(self.locations()[i].marker);
      bounds.extend(self.locations()[i].marker.position);
    }
    map.fitBounds(bounds);
  };

  self.openLocInfo = function(locInfo) {
   locInfo.clickedMarker(locInfo.marker, largeInfowindow);
 };


  initInfowindow();
  this.showLocations();

  //computed list of locations
 this.filteredLocations = ko.computed(function() {
   var filterItem = self.searchAddress().toLowerCase();
   // checks if search bar is empty, if yes, will display all location by default
   if (!filterItem) {
     self.locations().forEach(function(title) {
       title.marker.setVisible(true);
     });
     return self.locations();
   } else {
     //return true if conditions in function are fulfilled
     //marker is also updated accordingly
     return ko.utils.arrayFilter(self.locations(), function(item) {
       if (item.title.toLowerCase().indexOf(filterItem) !== -1) {
         item.marker.setVisible(true);
       } else {
         item.marker.setVisible(false);
       }
       return item.title.toLowerCase().indexOf(filterItem) !== -1;
     });
   }
 }, this); // end of filteredLocations computed function

 //function to center map for mobile view to clicked location
 this.centerLoc = function(title) {
   self.openLocInfo(title);
 };
 this.colorChange = function(title) {
   self.openLocInfo(title);
   console.log(title.marker);
 };
};

// For sidebar
function toggleNav(){
    navSize = document.getElementById("sidebarlist").style.width;
    if (navSize == "250px") {
        return closeNav();
    }
    return openNav();
}

function changeButton(x) {
    x.classList.toggle("change");
}

function openNav() {
    document.getElementById("sidebarlist").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";

}

function closeNav() {
    document.getElementById("sidebarlist").style.width = "0";
    document.getElementById("main").style.marginLeft = "0px";

}
// Activates knockout.js
function initMap() {
  avm = new AppViewModel();
  ko.applyBindings(avm);
}
