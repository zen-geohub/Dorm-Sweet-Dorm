// let code = require('polyline-encoded')
const map = L.map('map')

const basemaps = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 25
}).addTo(map);

let jatinangor = [-7.757427, 110.3773647]
let jatinangor2 = [-7.755427, 110.3773647]
// let encoded = jatinangor.encodePath()
// let encoded2 = jatinangor2.encodePath()
let ce = [-23.5523, -46.6318]
L.marker(ce).addTo(map)
map.setView(ce, 16)
let userPOI
let bufferPOI

let markerAdded
let bufferAdded



$('#checkbox').change((e) => {
  let mapContainer = map.getContainer()
  mapContainer.style.cursor = e.target.checked ? "pointer" : "grab"

  const isChecked = e.target.checked
  $('.locationOn').toggleClass('block', !isChecked).toggleClass('hidden', isChecked);
  $('.locationAdd').toggleClass('block', isChecked).toggleClass('hidden', !isChecked);

  if (isChecked) {
    map.on('click', (event) => {
      if (markerAdded) {
        map.removeLayer(markerAdded)
      }
      userPOI = (turf.point([event.latlng.lng, event.latlng.lat]))
      markerAdded = L.geoJSON(userPOI).addTo(map)

      updateBuffer()
      // $('#radiusValue').change(updateBuffer)
      $('#radiusValue').on('input', updateBuffer)
    })
  } else {
    map.off('click')
    if (markerAdded) {
      map.removeLayer(markerAdded)
      map.removeLayer(bufferAdded)
      // map.removeControl(route)
      groupCoba["features"].forEach(item => {
        map.removeControl(item)
      })
      console.log(routeOptions, 'routeOptions');
      console.log(route, 'route');
      console.log(groupCoba, 'group');
      console.log(coba, 'cobaa');
      console.log(points, 'points');
    }
  }
})

let wayPon = [-46.6318, -23.5523]
let wayPon2 = [-46.5318, -23.4523]

var latlngs = [
  [38.5, -120.5],
];
var polyline = L.polyline(latlngs);

console.log(polyline.encodePath());
// console.log(encoded);
// console.log(wayPon2);
// console.log(1+2);

let userChoice = []

export const userRidingOption = async () => {
  return new Promise((resolve) => {
    const userChoice = document.querySelector('#selector');

    userChoice.addEventListener('input', (e) => {
      let user = e.target.value;
      resolve(user);
    });
  });
}
// console.log(user);
let hehe
let hihu = async () => {
  const user = await userRidingOption()
  if (hehe) {
    map.removeControl(hehe)

  }

  userChoice.length = 0
  userChoice.push(user)
  // userChoice.pop()

  hehe = L.Routing.control({
    waypoints: [jatinangor, jatinangor2],
    routeWhileDragging: true,
    serviceUrl: `https://routing.openstreetmap.de/routed-${userChoice[0]}/route/v1`,
    profile: 'driving',
    // mode: 'foot'
  }).addTo(map);
}

$('#selector').change(hihu)



// console.log(hehe);

var points = turf.points([
  // [-46.6318, -23.5523],
  [-46.6246, -23.5325],
  [-46.6062, -23.5513],
  [-46.663, -23.554],
  [-46.643, -23.557]
]);

L.geoJSON(points).addTo(map)
let coba
let route
let routeOptions
let groupCoba = turf.featureCollection()
groupCoba.features = []
let updateBuffer = () => {
  const staticOrigin = wayPon.reverse();
  if ($('#radiusValue').val() !== "" && $('#radiusValue').val() !== NaN) {
    if (bufferAdded) {
      map.removeLayer(bufferAdded)

    }
    if (route) {
      // route.options["waypoints"][1] = []
      console.log(route.options["waypoints"], 'route');
      groupCoba.features = []
      // route.spliceWaypoints(0, 2)
      // map.removeControl(route)
    }
    let radiusValue = parseInt($('#radiusValue').val())
    bufferPOI = turf.buffer(userPOI, radiusValue, { units: "meters" })
    bufferAdded = L.geoJSON(bufferPOI).addTo(map)


    if (points) {
      coba = turf.pointsWithinPolygon(points, bufferPOI)
      
    }

    // console.log(cobaa);
    // Assuming wayPon is a static point

    routeOptions = {
      waypoints: [staticOrigin],
      createMarker: function (i, waypoint, n) {
        // Return null to prevent marker creation
        return null;
      },
      // serviceUrl: 'https://router.project-osrm.org/route/v1',
      // profile: 'driving'
    };

    coba.features.forEach(feature => {
      // Add the dynamic destination to the waypoints array
      // let destination = feature.geometry["coordinates"].reverse();
      routeOptions.waypoints[1] = feature.geometry["coordinates"].reverse()
      // let hehi = turf.booleanIntersects(bufferPOI, points)
      console.log(feature);
      // Create and add the routing control
      route = L.Routing.control(routeOptions).addTo(map)

      groupCoba["features"].push(route)

      // Log for verification
      // console.log(routeOptions.waypoints);
    });

    // groupCoba["features"].addTo(map)

    // coba = L.geoJSON(cobaa).addTo(map)
    // let coba = turf.pointsWithinPolygon(points, bufferPOI)
  }
  else {
    console.log('hehe');
  }

}

console.log(hihu());