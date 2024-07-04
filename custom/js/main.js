var isDrawOn = false
var draw
var PointType = ['ATM', 'Tree', 'Telephone Poles', 'Electricity Poles', 'Shops'];
var LineType = ['National Highway', 'State Highway', 'River', 'Telephone Lines'];
var PolygonType = ['Water Body', 'Commercial Land', 'Residential Land', 'Building', 'Government Building'];
var selectedGeomType

/**
 * Custom control
 */

window.app = {};
var app = window.app

app.DrawingApp = function (opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.id = 'drawbtn'
    button.innerHTML = '<i class="fas fa-pencil-ruler"</i>';

    var this_ = this
    var startStopApp = function () {
        if (isDrawOn == false) {
            $('#startDrawModal').modal('show')
        } else {
            map.removeInteraction(draw)
            isDrawOn = false
            document.getElementById('drawbtn').innerHTML = '<i class="fas fa-pencil-ruler"></i>';
            typeofFeature();
            $('#enterInformationModal').modal('show')
        }
    }

    button.addEventListener('click', startStopApp, false);
    button.addEventListener('touchstart', startStopApp, false)

    var element = document.createElement('div')
    element.className = 'draw-app ol-unselectable ol-control'
    element.appendChild(button)

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    })
}

ol.inherits(app.DrawingApp, ol.control.Control);

/**
 * View
 */
var baseMap = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: 'Example Application'
  })
});

var featureLayerSource = new ol.source.TileWMS({
  url: "http://localhost:8080/geoserver/example_app/wms",
  params: { 'LAYERS': 'example_app:featuresDrawn', 'tiled': true },
  serverType: 'geoserver'
});

var featureLayer = new ol.layer.Tile({
  source: featureLayerSource
});

var drawSource = new ol.source.Vector();

var drawLayer = new ol.layer.Vector({
  source: drawSource
});

var opentopoMap = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
  }),
  visible: false,
  title: 'OpenTopoMap'
});

var stamenWatercolor = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'watercolor'
  }),
  visible: false,
  title: 'Stamen Watercolor'
});
var stamenTerrain = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'terrain'
  }),
  visible: false,
  title: 'Stamen Terrain'
});
var esriWorldTopoMap = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ESRI</a>'
  }),
  visible: false,
  title: 'ESRI WorldTopoMap'
});

// var osm = new ol.layer.Tile({
//   source: new ol.source.OSM(),
//   visible: false,
//   title: 'OSM'
// });
var layerArray = [baseMap, featureLayer, drawLayer, opentopoMap, stamenWatercolor, stamenTerrain, esriWorldTopoMap

];

var mapView = new ol.View({
  center: [8633240.92947555, 1460858.9432369084],
  zoom: 17
});

var map = new ol.Map({
  target: 'map',
  layers: layerArray,
  view: mapView,
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }).extend([    new app.DrawingApp()  ])
});

var layerSwitcher = new ol.control.LayerSwitcher({
  tipLabel: 'Legend'
});

map.addControl(layerSwitcher);


function startDraw(geomType) {
    selectedGeomType = geomType
    draw = new ol.interaction.Draw({
        type: geomType,
        source: drawSource
    })
    $('#startDrawModal').modal('hide')
    map.addInteraction(draw)
    isDrawOn = true
    document.getElementById('drawbtn').innerHTML = '<i class="far fa-stop-circle"></i>'
}

function typeofFeature() {
    var dropdowntype = document.getElementById('typeofFeatures')
    dropdowntype.innerHTML = ''
    if (selectedGeomType == 'Point') {
        for (i = 0; i < PointType.length; i++) {
            var op = document.createElement('option')
            op.value = PointType[i]
            op.innerHTML = PointType[i]
            dropdowntype.appendChild(op)
        }
    } else if (selectedGeomType == 'LineString') {
        for (i = 0; i < LineType.length; i++) {
            var op = document.createElement('option')
            op.value = LineType[i]
            op.innerHTML = LineType[i]
            dropdowntype.appendChild(op)
        }
    } else {
        for (i = 0; i < PolygonType.length; i++) {
            var op = document.createElement('option')
            op.value = PolygonType[i]
            op.innerHTML = PolygonType[i]
            dropdowntype.appendChild(op)
        }
    }
}
var image_data = null; // global variable to store the file data

// add event listener to file input field
document.getElementById('image').addEventListener('change', function(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    image_data = event.target.result;
  };
  reader.readAsDataURL(file);
});
/**
 * Save features to DB
 */
// Define global variables



function selectImage() {
  var imageInput = document.getElementById('image');
  imageInput.click();
  handleImageChange(event, function() {
    savetodb();
  });
}

function handleImageChange(event, callback) {
  console.log(event);
  if(!event || !event.target || !event.target.files || !event.target.files[0]) {
    console.log('Invalid event object');
    return;
  }    
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function() {
      var image = new Image();
      image.src = reader.result;
      image.onload = function() {
        canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob(function(blob) {
          var reader = new FileReader();
          reader.onload = function() {
            image_data = reader.result;
            if (typeof callback === 'function') {
              callback();
            }
          };
          reader.readAsDataURL(blob);
        });
      };
    };
    reader.readAsDataURL(file);
}

function savetodb() {
  var features = drawSource.getFeatures();
  var geoJSONformat = new ol.format.GeoJSON();
  var geoJSONfeatures = geoJSONformat.writeFeaturesObject(features);

  geoJSONfeatures.features.forEach(element => {
      console.log(element.geometry);
      var type = document.getElementById('typeofFeatures').value;
      var name = document.getElementById('nameofFeatures').value;
      var geomstring = JSON.stringify(element.geometry);
      var base64_image_data = image_data.replace(/^data:image\/(png|jpeg);base64,/, ""); // remove image type prefix
      var formData = new FormData();
      formData.append('typeofFeature', type);
      formData.append('nameofFeature', name);
      formData.append('geom', geomstring);
      formData.append('image_data', base64_image_data);

      if (type != '') {
          $.ajax({
              url: 'http://localhost/example-app-main/example-app-main/save.php',
              type: 'POST',
              data: formData,
              contentType: false,
              processData: false,
              success: function (dataResult) {
                  console.log(dataResult)
                  var res = JSON.parse(dataResult)
                  if (res.statusCode == 200) {
                      console.log('Data added successfully')
                  } else {
                      console.log('Data not added')
                  }
              }
          })
      } else {
          alert('please select type')
      }
  });
  var params = featureLayer.getSource().getParams();
  params.t = new Date().getMilliseconds();
  featureLayer.getSource().updateParams(params);
}

  // Clear input value and listener
  function handleImageChange(event) {
    var imageInput = document.getElementById('image');
    var image_data;
    
    imageInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
    
      reader.onload = function() {
        image_data = reader.result;
      }
    
      reader.readAsDataURL(file);
    });
  }    

    // close modal
    $("#enterInformationModal").modal('hide')
    clearDrawSource()


/**
 * Clear DataSource
 */
function clearDrawSource() {
    drawSource.clear();
}

// Get the user's location
var longitude, latitude, accuracy;
navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var accuracy = position.coords.accuracy;

    // Add a marker to the user's location
    var marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        })
    });

    marker.setStyle(iconStyle);

    var vectorSource = new ol.source.Vector({
        features: [marker]
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    map.addLayer(vectorLayer);
});

// location description

// Add a marker to the user's location
var marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
    name: 'My Location',
    description: 'This is my current location'
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png'
    })
});

marker.setStyle(iconStyle);

var vectorSource = new ol.source.Vector({
    features: [marker]
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

// Add a popup to the marker
var popup = new ol.Overlay({
    element: document.getElementById('popup')
});
map.addOverlay(popup);

marker.on('click', function (evt) {
    var feature = evt.target;
    var coordinates = feature.getGeometry().getCoordinates();
    var name = feature.get('name');
    var description = feature.get('description');
    popup.setPosition(coordinates);
    popup.getElement().innerHTML = '<h4>' + name + '</h4><p>' + description + '</p>';
});

map.addLayer(vectorLayer);

// image png
// Add event listener to capture button
document.getElementById('capture-btn').addEventListener('click', function() {
    // Get the map viewport
    var mapViewport = document.getElementsByClassName('ol-viewport')[0];
    // Create a new canvas element
    var canvas = document.createElement('canvas');
    // Set the canvas dimensions to match the viewport
    canvas.width = mapViewport.offsetWidth;
    canvas.height = mapViewport.offsetHeight;
    // Get the map and all its layers
    var map = window.map;
    var layers = map.getLayers().getArray();
    // Get the canvas context
    var context = canvas.getContext('2d');
    // Draw each layer onto the canvas
    for (var i = layers.length - 1; i >= 0; --i) {
      var layer = layers[i];
      if (layer.getVisible() && layer.getRenderer) {
        var layerRenderer = layer.getRenderer();
        if (layerRenderer instanceof ol.renderer.canvas.Layer) {
          layerRenderer.renderFrame({context: context, size: [canvas.width, canvas.height]});
        }
      }
    }
    // Get the canvas as an image data URL
    var imageDataUrl = canvas.toDataURL('image/png');
    // Create a download link
    var link = document.createElement('a');
    link.download = 'map.png';
    link.href = imageDataUrl;
    link.click();
  });
  
//  image capture
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-button');
  // Get access to the camera
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // Display the camera stream in the video element
    video.srcObject = stream;
    video.play();
  })
  .catch(err => console.error(err));

// Capture an image from the video stream when the capture button is clicked
captureButton.addEventListener('click', () => {
  // Draw the current video frame to the canvas
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the data URL of the canvas image
  const imageDataURL = canvas.toDataURL();

  // Create a link element and download the image
  const link = document.createElement('a');
  link.href = imageDataURL;
  link.download = 'image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Get the current location and add a marker to the map
  navigator.geolocation.getCurrentPosition(position => {
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]))
    });
    const markerLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [marker]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: imageDataURL,
          imgSize: [canvas.width, canvas.height]
        })
      })
    });
    map.addLayer(markerLayer);
  });
});
  
//   wms layer import

var layersListEl = document.getElementById('layers-list');
var listLayersBtn = document.getElementById('list-layers-btn');
var existing_map_object = map;
listLayersBtn.addEventListener('click', function() {
  var wmsUrl = document.getElementById('wms-url').value.trim();
  if (!wmsUrl) {
    alert('Please enter a WMS URL.');
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', wmsUrl + '?request=GetCapabilities&service=WMS', true);
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xhr.response, 'application/xml');
      var layers = xmlDoc.getElementsByTagName('Layer');
      layersListEl.innerHTML = '';
      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var layerEl = document.createElement('div');
        var layerName = layer.getElementsByTagName('Name')[0].textContent;
        layerEl.innerHTML = '<input type="checkbox" name="layers" value="' + layerName + '"> ' + layerName;
        layersListEl.appendChild(layerEl);
      }
    } else {
      alert('Unable to load WMS capabilities.');
    }
  };
  xhr.onerror = function() {
    alert('Unable to load WMS capabilities.');
  };
  xhr.send();
});

layersListEl.addEventListener('click', function(event) {
  if (event.target.name === 'layers') {
    var wmsUrl = document.getElementById('wms-url').value.trim();
    var selectedLayerName = event.target.value;
    var selectedLayerSource = new ol.source.TileWMS({
      url: wmsUrl,
      params: {
        'LAYERS': selectedLayerName
      },
      projection: 'EPSG:4326'
    });
    var selectedLayer = new ol.layer.Tile({
      source: selectedLayerSource
    });
    map.addLayer(selectedLayer);
  }
});