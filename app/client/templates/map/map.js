var sessionId = function () {
  var id = MapData.findOne()._id;
  if (MapData.find().count() > 1) {
    console.log("MULTIPLE MapData records found!!");
  }
  return id;
};
var cTemplate = function () {
  var cTemplate = MapData.findOne().currentTemplate;
  return cTemplate;
};

var modalFlip = function (templateSelected) {
  console.log('Current template: ' + cTemplate());
  console.log('New template: ' + templateSelected);

  if (cTemplate() != templateSelected) {
    MapData.update({
      _id: sessionId()
    }, {
      $set: {
        currentTemplate: templateSelected
      }
    });
    if (Session.get("closeTab") == true) {
      $('.map-float-container').transition('fade up');
    }
    BlazeLayout.render("mapLayout", {
      area: "map",
      controlls: templateSelected
    });
  } else {
    if (Session.get("closeTab") == true) {
      Session.set("closeTab", false);
    } else {
      if (cTemplate == "addingPanel") {
        BlazeLayout.render("mapLayout", {
          area: "map",
          controlls: templateSelected
        });
      }
      Session.set("closeTab", true);
    }
  }
};
Template.map.events({
  "click [data-action=delete-roof]": function (event) {
    event.preventDefault();
    if (typeof(mapController) == 'undefined' || !mapController.isReady()) return; // Prevent errors while initialising
    mapController.disableDrawingMode();
    if (mapController.getSelectedRoof()) mapController.deleteSelectedRoof();
  },
  "click [data-action=cancel-add-area]": function(event) {
    event.preventDefault();
    mapController.disableDrawingMode();
  },
  "click [data-action=add-new-area]": function (event) {
    event.preventDefault();
    console.log('adding panel');
    console.log(cTemplate());
    if (cTemplate() == 'addingPanel') {
      return;
    }
    if (Session.get("closeTab") == false) {
      $('.map-float-container').transition('fade up');
    }

    if (typeof(mapController) == 'undefined' || !mapController.isReady()) return; // Prevent errors while initialising
    mapController.enableDrawingMode();
    BlazeLayout.render("mapLayout", {
      area: "map",
      controlls: 'MapControls'
    });
    Session.set("closeTab", false);

  },
  //"mouseenter #map2,.trash": function () {
  //
  //  if (typeof(mapController) == 'undefined' || !mapController.isReady()) return; // Prevent errors while initialising
  //
  //  if (mapController.getRoofController().count() <= 0) {
  //    Template.instance().$(".isdraw").hide();
  //  } else {
  //    Template.instance().$(".isdraw").show();
  //    // Only show delete button if there is a selected roof
  //    if (mapController.getSelectedRoof() == null) {
  //      Template.instance().$('[data-action=delete-area]').hide();
  //    } else {
  //      Template.instance().$('[data-action=delete-area]').show();
  //    }
  //  }
  //},

  //NEW CONTROLS FOR NEW UI
  "click .ui.fluid.animated.blue.button": function () {
    if (cTemplate() == 'addingPanel') {
      return;
    }
    $('.map-float-container').transition('fade up');
  },
  //Email Requred Controls

  'click .customSettings ': function (e) {
    e.preventDefault();
    var templateSelected = $(e.currentTarget).attr('data-template');
    modalFlip(templateSelected);
  },

  'click #ok': function () {
    Session.set("closeTab", false);
    $('.map-float-container').transition('fade up');
  },
  'click [data-template="Usage"]': function (e) {
    var templateSelected = $(e.currentTarget).attr('data-template');

    modalFlip(templateSelected);
  },
  'click .help':function(){
    $('#how-to-use').transition('drop');
    if ("none" == $('.help-icon').css('display')) {
      $('.help.close').hide();
      $('.help-icon').show();
    } else {
      $('.help-icon').hide();
      $('.help.close').show();
    }
  }
});

Template.map.helpers({

  telLink: function() {
    return Meteor.settings.public.contact.telephone.replace(/\s/g,''); // remove whitespace
  },
  telephone: function() {
    return Meteor.settings.public.contact.telephone;
  },
  selectedRoofClass: function() {
    if (MapData.findOne() == undefined || MapData.findOne().totalPanelCount == undefined) return "noRoofSelected";
    return MapData.findOne().selectedRoof == null ? "noRoofSelected" : "roofSelected";
  }
});

Template.map.onCreated( function() {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    var handle = homeSubs.subscribe('panels');
    var cityHandle = homeSubs.subscribe("solar-access", MapData.findOne().closestCity);
    var roofAngleHandle = homeSubs.subscribe("roof_angles");
    self.ready.set(handle.ready() && cityHandle.ready() && roofAngleHandle.ready());
  });
});

function getFacingDirection(azimuth) {
  var facing = 'N';
  if (azimuth > 11.25) facing = 'NNE';
  if (azimuth > 33.75) facing = 'NE';
  if (azimuth > 56.25) facing = 'ENE';
  if (azimuth > 78.75) facing = 'E';
  if (azimuth > 101.25) facing = 'ESE';
  if (azimuth > 123.75) facing = 'SE';
  if (azimuth > 146.25) facing = 'SSE';
  if (azimuth > 168.75) facing = 'S';
  if (azimuth > 191.25) facing = 'SSW';
  if (azimuth > 213.75) facing = 'SW';
  if (azimuth > 236.25) facing = 'WSW';
  if (azimuth > 258.75) facing = 'SW';
  if (azimuth > 281.25) facing = 'WNW';
  if (azimuth > 303.75) facing = 'NW';
  if (azimuth > 326.25) facing = 'NNW';
  if (azimuth > 348.75) facing = 'N';
  return facing;
}

Template.map.onRendered(function () {
  var self = this;

  $('.map-float-container').transition('drop');
  var saveto = MapData.findOne(); // Local collection - no need to restrict
  if (!saveto) {
    FlowRouter.go('/');
    return; // SJO - return here because FlowRouter redirect does not prevent the rest of the code below from running!
  }

  $('.map-float-container').transition('fade up');
  MapData.update({
    _id: saveto._id
  }, {
    $set: {
      currentTemplate: "Usage"
    }
  });

  var address = saveto.location;
  var handle = this.autorun(function () {
    // Load the Google Maps API on startup
    // Wait for API to be loaded
    if (Template.instance().subscriptionsReady() && self.ready && GoogleMaps.loaded()) {

      MapFunctions.init(); // add extra prototype to Google Maps classes e.g. Polygon.rotate(...)

      mapController.init(Panels.find().fetch()); // Initialize mapController object

      mapController.registerForUpdates(function () {
        var saveto = MapData.findOne();
        var closestCity = saveto.closestCity;
        var pitchTilt = RoofAngles.findOne({name: saveto.pitchSettings}).value;
        var solarAccessData = [];
        if (closestCity) {
          solarAccessData = SolarAccess.find({name:closestCity}).fetch();
        }
        // if data is empty here??
        if (solarAccessData.length > 0) {
          var panelCapacity = Panels.find().fetch().map( function(panel) {
            return {
              brand: panel.brand,
              code: panel.code,
              power: panel.power,
              capacityW: 0,
              dailyOutputKWh: 0
            }
          });

          panelCapacity.unshift({
            brand: "Not Set",
            code: "Not Set",
            power: 0,
            capacityW: 0,
            dailyOutputKWh: 0
          });
          panelCapacity[0].selected = true;

//          console.dir(panelCapacity);
          var systemCapacity = 0;
          var estimatedCapacity = "$0K";
          var encodedPolyPaths = [];
          var directionMarkerPoints = [];

          var roofs = mapController.getRoofs();
          if (roofs.length == 0) {
            MapData.update({
              _id: saveto._id
            }, {
              $set: {
                isFakeData: true,
                systemCapacity: 0.0,
                estimatedCost: estimatedCapacity,
                panelCapacity: panelCapacity,
                totalAreaSqm: 0,
                totalPanelCount: 0,
                selectedRoof: null,
                panels: [],
                directionMarkerPoints: [],
                currentTemplate: '',
                pitchTiltValue: pitchTilt
              }
            });
          } else {
            roofs.forEach(function (roof, idx) {
              encodedPolyPaths.push(JSON.stringify(roof.getPath()));
              directionMarkerPoints.push(JSON.stringify(roof.roofInfo.directionMarker.getPosition()));
              roof.panelTypeCapacity.forEach(function (pType, pTypeIdx) {
                if (pType === null) {
                  console.warn("Panel type is null - ignoring - index= [" + pTypeIdx + "]");
                } else {
                  panelCapacity[pTypeIdx].capacityW += (pType.capacityW / 1000);
                  //TODO add dailyOutputKWh calculation here

                }
              })
            });

            systemCapacity = panelCapacity[0].capacityW;
            if (systemCapacity <= 1.6) estimatedCapacity = "$2.5K - $3.7K";
            if (systemCapacity <= 3.1) estimatedCapacity = "$6K - $7K";
            var estCost = 11000 + ((systemCapacity - 5.0) * 2200);
            estimatedCapacity = "$" + ((estCost-1000)/1000).toFixed(1) + "K - $" + ((estCost+1750)/1000).toFixed(1)+"K";
            var selectedRoof = mapController.getSelectedRoof();
            var selectedRoofData = null;
            if (selectedRoof != null) {
              var azimuth = selectedRoof.roofInfo.azimuth;
              var facing = getFacingDirection(azimuth);

              selectedRoofData = {
                areaSqm: selectedRoof.getAreaSqm(),
                panelCount: selectedRoof.panelTypeCapacity[0].panelCount,
                facing: facing,
                azimuth: azimuth,
                size: selectedRoof.panelTypeCapacity[0].capacityW / 1000,
                brand: selectedRoof.panelTypeCapacity[0].panelType.brand + " " + selectedRoof.panelTypeCapacity[0].panelType.code,
                power: selectedRoof.panelTypeCapacity[0].panelPower,
                capacity: selectedRoof.panelTypeCapacity[0].capacityW / 1000,
                roofAngle: 0,
                roofShade: 0
              }
            }
            MapData.update({
              _id: saveto._id
            }, {
              $set: {
                isFakeData: false,
                systemCapacity: systemCapacity,
                estimatedCost: estimatedCapacity,
                panelCapacity: panelCapacity,
                totalAreaSqm: mapController.getRoofController().getTotalAreaSqm(),
                totalPanelCount: mapController.getRoofController().getTotalPanelCount(),
                selectedRoof: selectedRoofData,
                panels: encodedPolyPaths,
                directionMarkerPoints: directionMarkerPoints,
                currentTemplate: '',
                pitchTiltValue: pitchTilt
          }
            });
          }
        }
      });

      $('#place3').geocomplete({
        map: "#map2",
        location: address,
        mapOptions: {
          tilt: 0,
          mapTypeId: "hybrid",
          mapTypeControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
          },
          streetViewControl: false,
          zoom: 21,
          scrollwheel: true
        },
        types: ['address'],
        componentRestrictions: {
          'country': 'au'
        },
        markerOptions: {
          draggable: false,
          visible: false
        }
      }).bind("geocode:result", function (event, result) {
        SolarQuote.Utils.CurrentLocationManager.setLocation(result);
        renderMapDraw();
      });

      // Stop auto-run here (to prevent re-triggering)
      if (typeof(handle) != 'undefined') handle.stop();
    } // end autorun
  });
  $('.bxslider').bxSlider({
    adaptiveHeight: true,
    tickerHover: true,
    controls: false,
    auto: true
  });
});

function renderMapDraw() {
  var map = $("#place3").geocomplete("map");
  map.setTilt(0);
  map.setZoom(21);
  var newAddress = false;

  if (MapData.findOne() && typeof(MapData.findOne().addressParts) === 'undefined' || (typeof(MapData.findOne().location) != undefined && MapData.findOne().location != Session.get('location')) ) {
    newAddress = true;
    MapData.remove({}); // Clear local persistence store on new address

    // Clear the current lead data in Session
    Session.set('emailSet', undefined);
    Session.set('leadId', undefined);

    delete Session.keys.emailSet;
    delete Session.keys.leadId;

    var closestCity = findClosestCity(new google.maps.LatLng(Session.get('locationLL')));
    MapData.insert({
      location: Session.get('location'),
      lnglat: Session.get('locationLL'),
      addressParts: Session.get('locationAddress'),
      closestCity: closestCity.name,
      avgPeakSunHours: closestCity.apsh,
      pitchSettings: "standard",
      pitchTiltValue: RoofAngles.findOne({name:"standard"}).value
    }); // Create new persistence store
  }
  mapController.setMap(map);

  if (!newAddress && MapData.findOne() && typeof(mapController) !== 'undefined') {
    var panels = MapData.findOne().panels;
    var markerPts = MapData.findOne().directionMarkerPoints;

    if (panels && markerPts && panels.length > 0 && panels.length == markerPts.length) {

      // When map has finished drawing restore saved polygons / polylines
      var listenerHandle;
      listenerHandle = google.maps.event.addListener(map, 'idle', function () {
        // We only want this to trigger ONCE - so immediately remove event listener
        google.maps.event.removeListener(listenerHandle);

        console.log("Restoring...");
        mapController.restore(panels, markerPts);
      });
    }
  } else {
    console.log("New address - initialising...");
    // New address or in weird state

    // When map has finished drawing restore saved polygons / polylines
    var listenerHandle;
    listenerHandle = google.maps.event.addListener(map, 'idle', function () {
      // We only want this to trigger ONCE - so immediately remove event listener
      google.maps.event.removeListener(listenerHandle);

      mapController.getRoofController().deleteAllRoofs();
      mapController.notifyUpdateHandler();
    });

  }
  // Intentionally trigger miniscule map pan event - this will trigger the map 'idle' event to run the restore
  map.setCenter(new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng() + 0.000000001));
  // Finally, try zooming in again after small delay
  // This fixes issue where map zoom can be left at 19 after viewing an area where maxZoom is only 19 (e.g. Kingscliff in NSW)
  setTimeout(function() {
    map.setZoom(21);
  }, 700);
}

function findClosestCity(addressPt) {
  var closest = null;
  var cities = Cities.find().fetch();
  cities.forEach(function(city, idx) {
    var ll = new google.maps.LatLng(city.lat, city.lng);
    var distance = (google.maps.geometry.spherical.computeDistanceBetween(addressPt, ll) / 1000);
    if (closest == null) {
      closest = city;
      closest.location = ll;
      closest.distance = distance;
    } else {
      if (distance < closest.distance) {
        closest = city;
        closest.location = ll;
        closest.distance = distance;
      }
    }
  });
  return closest;
}
