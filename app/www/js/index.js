// MAP FUNCTIONS

var map;
function initialize() {
  //https://www.mapbox.com/developers/api/
  var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
  map = L.map('map-layer').setView([51.45, -2.6], 13);
  L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png'.concat(accToken), {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
  }).addTo(map);
  
  var bounds = map.getBounds();
  
  featureStyle = {
      fillColor: 'green',
      visible: true,
      strokeWeight: 1
  };
  var rootUrl = "http://54.154.15.47/geoserver/ea/ows";
  var defaultParameters = {
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'ea:Flood_Warning_Areas',
      outputFormat : 'text/javascript',
      format_options : 'callback:getJson',
      maxfeatures: 5,
      BBOX: bounds._southWest.lat+","+bounds._southWest.lng+","+bounds._northEast.lat+","+bounds._northEast.lng,
      SrsName : 'EPSG:41001'
  };
  var parameters = L.Util.extend(defaultParameters);
  //_url = rootUrl + L.Util.getParamString(parameters);
  //FROM SAM:
  _url = "http://54.154.15.47/geoserver/ea/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=ea%3Aflood_warning_areas&srsName=EPSG%3A3857&maxFeatures=1&outputFormat=application%2Fjson&bbox=-280065.271637%2C6665193.142305%2C-270281.332016%2C6687726.302866";
  //_url = "http://54.154.15.47:80/geoserver/wfs?request=GetFeature&version=1.1.0&typeName=ea:Flood_Warning_Areas&BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326&outputFormat=application/json";
  console.log("using url: " + _url);
  console.log(map);
  /*
  var WFSLayer = null;
  var ajax = $.ajax({
    url : _url,
    dataType : 'jsonp',
    jsonpCallback : 'getJson',
    success : function (response) {
        console.log("success");
        WFSLayer = L.geoJson(response, {
            style: function (feature) {
                return {
                    stroke: false,
                    fillColor: 'FFFFFF',
                    fillOpacity: 0
                };
            }
        }).addTo(map);
        
    },
    error: function(response) {
      console.log("Error: " + response);
    }
  });
  */
}
window.onload = initialize;

// SEARCH BAR EXPAND
$('#search-bar input').click(function(){

    // IF HIDDEN, SHOW
    if(!$('#search-bar-expanded').is(':visible')){
        // SLIDE DOWN
        $('#search-bar-expanded').slideDown();

        // EXCHANGE ICON TO GO BACK
        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/left-arrow-icon.png').fadeIn();
        });
    }

});

// CLOSE SEARCH BAR

$('#search-icon').click(function(){
    hideSearchBar();
});
$('html').click(function() {
    hideSearchBar();
});

function hideSearchBar() {
    // IF VISIBLE, HIDE
    if($('#search-bar-expanded').is(':visible')){
        $('#search-bar-expanded').slideUp();
        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/search-icon.png').fadeIn();
        });
    }
}

$('#search-bar, #search-bar-expanded').click(function(e){
    e.stopPropagation();
});

// BUTTONS EXPAND
function buttonExpand(side, override){

    // IF NOT VISIBLE, DISPLAY
    if(typeof override === "undefined" && !$('#' + side + '-legend-button').is(':visible') && !$('#' + side + '-topic-button').is(':visible')) {
        $('#' + side + '-legend-button').show("fast", function(){ $(this).addClass('btn-expanded'); });
        $('#' + side + '-topic-button').show("fast", function(){ $(this).addClass('btn-expanded'); });
        $('#' + side + '-button').attr('src', 'img/buttons/close-menu-icon.png');
    }

    // IF VISIBLE, HIDE
    else {
        $('#' + side + '-legend-button').removeClass("btn-expanded");
        $('#' + side + '-topic-button').removeClass("btn-expanded");
        
        setTimeout(function(){
            $('#' + side + '-legend-button').hide();
            $('#' + side + '-topic-button').hide();
        }, 500);
        
        $('#' + side + '-button').attr('src', 'img/buttons/'+ side +'-menu-icon.png');
    }
}
    
$('#left-button').click(function() {
    buttonExpand("left");
});

$('#right-button').click(function() {
    buttonExpand("right");
});

// TOGGLE MAP TOPIC MENU
$('#right-topic-button, #left-topic-button').click(function() {
    $('#map-select-layer').show().animate({marginTop: "0px"}, {queue: false, duration: 750});
    $('#map-select-layer').animate({height: "100%"}, {queue: false, duration: 750});
});

// SLIDE UP TOPIC MENU
$('#menu-icon').click(function() {
    $('#map-select-layer').animate({marginTop: "100%"}, {queue: false, duration: 750});
    $('#map-select-layer').animate({height: "0px"}, {queue: false, duration: 750}, function(){
        $(this).hide();
    });
});

function sliderOffset(offset){

    // SHOW BUTTON IF SIDE IS VISIBLE
    if(offset >= 135 && !$('#left-button-block').is(':visible')){
        $('#left-button-block').fadeIn();
    }
    else if(offset < 135 && $('#left-button-block').is(':visible')){
        buttonExpand("left", true);
        $('#left-button-block').fadeOut();        
    }
    else if(offset <= $(window).width() - 185 && !$('#right-button-block').is(':visible')){
        $('#right-button-block').fadeIn();
    }
    else if(offset > $(window).width() - 185 && $('#right-button-block').is(':visible')){
        buttonExpand("right", true);
        $('#right-button-block').fadeOut();    
    }
    
    // SHOW ARROWS ON SIDE OF SLIDER
    if(offset >= 50 && $('#drag-right').is(':visible')){
        $('#drag-right').fadeOut();
    }
    else if(offset < 50 && !$('#drag-right').is(':visible')){
        $('#drag-right').fadeIn();        
    }
    if(offset <= $(window).width() - 100 && $('#drag-left').is(':visible')){
        $('#drag-left').fadeOut();
    }
    else if(offset > $(window).width() - 100 && !$('#drag-left').is(':visible')){
        $('#drag-left').fadeIn();        
    }
}
    
// DRAGGABLE SLIDER
$('#slider-bar').on('mousedown', function(){
    $(this).addClass('dragging');
});
$('#slider-bar').on('mouseup', function(){
    $(this).removeClass('dragging');
});

$('body').on('mousemove', function(e){
    var leftOffset = 0;
    if($('#slider-bar').hasClass('dragging')){       
        if(leftOffset != e.pageX - 25);{
            leftOffset = e.pageX - 25;
            sliderOffset(leftOffset);
            $('#slider-bar').offset({
                left: leftOffset
            });
        }
    }
});


// ADDRESS SEARCH
// TODO: proper styling, (responsiveness etc)
$('#search-input').on('input', function() { 
    addr_search();
});

function addr_search() {
  var inp = document.getElementById("search-input");
  var num_results = 5;
  
  //http://nominatim.openstreetmap.org/
  $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit='+num_results+'&countrycodes=gb&q=' + inp.value, function(data) {
    var items = [];
    $.each(data, function(key, val) {
      //limit result lengths
      maxLen = 60;
      if(val.display_name.length > maxLen) {
        locationText = val.display_name.substring(0,40) + " ...";
      } else {
        locationText = val.display_name;
      }
      items.push(
        "<li><a href='#' onclick='chooseAddr(" +
        val.lat + ", " + val.lon + ");return false;'>" + locationText +
        '</a></li>'
      );
    });
    $('#search-bar-expanded').empty();
    if (items.length != 0) {
      $('<ul/>', {
        'class': 'favourite-locations',
        html: items.join('')
      }).appendTo('#search-bar-expanded');
    } else {
      $('<p>', { html: "No results found" }).appendTo('#search-bar-expanded');
    }
  });
}

function chooseAddr(lat, lng, type) {
  var location = new L.LatLng(lat, lng);
  console.log(map);
  map.panTo(location);

  if (type == 'city' || type == 'administrative') {
    map.setZoom(11);
  } else {
    map.setZoom(13);
  }
  hideSearchBar();
}
