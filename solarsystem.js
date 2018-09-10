
var renderer, scene, camera, controls, solarSystem;

var duration = 5000; // ms
var currentTime = Date.now();

function animate()
{
  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;
  var fract = deltat / duration;
  var angle = Math.PI * 2 * fract;
  var movement = now * 0.001;

  // Rotate the Sun
  rotateOwnAxis(solarSystem.children[1], angle);
  // Rotate each planet on own axis and orbits according to size
  for (var i = 2; i <= 10; i++) {
    rotateOwnAxis(solarSystem.children[i].children[0], angle);
    rotateFromParent(solarSystem.children[i], angle);
  }
  // Move moons
  // Earth moon
  rotateOwnAxis(solarSystem.children[4].children[0].children[0].children[0], angle);
  rotateFromParent(solarSystem.children[4].children[0].children[0], angle);
}

function run() {
  requestAnimationFrame(run);
  //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  // Render the scene
  renderer.render( scene, camera );
  // Spin the cube for next frame
  animate();
}

function rotateOwnAxis(planet, angle) {
  planet.rotation.y += angle / (planet.scale.getComponent(0) * 10);
}

function rotateFromParent(orbit, angle) {
  orbit.rotation.y += angle / orbit.children[0].box; // box.max
}

function createPlanet(planetConf) {
  var texture = new THREE.TextureLoader().load(planetConf.textureUrl);
  var material = new THREE.MeshPhongMaterial({ map: texture });
  var geometry = new THREE.SphereGeometry(planetConf.scale, 20, 20);
  var planet = new THREE.Mesh(geometry, material);
  return planet;
}

function createScene(canvas)
{
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

  // Set pixel ratio and size according to device
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( innerWidth, innerHeight );

  // Set for OrbitControls
  document.body.appendChild( renderer.domElement );

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Set the background color
  scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
  // Set image as background
  new THREE.TextureLoader().load('textures/2k_stars_milky_way.jpg' , function(texture)
  {
    scene.background = texture;
  });

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
  controls = new THREE.OrbitControls( camera );
  controls.screenSpacePanning = true;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;
  camera.position.z = 10;
  controls.update();
  scene.add(camera);

  setUpPlanets();
}

function setUpPlanets() {
  // Create a group for the whole System
  solarSystem = new THREE.Object3D;
  // Set Up Sun
  var sun = createPlanet({
    textureUrl:"textures/2k_sun.jpg",
    scale: 10
  });
  // Light from sun to everywhere
  var light = new THREE.PointLight( 0xffffff, 3, 150, 2);
  light.position.set( 0, 0, 0 );
  solarSystem.add(light);
  // Add light to sun
  sun.add(new THREE.AmbientLight( 0x404040, 0.5 )); // Orange own light
  sun.material.emissive = new THREE.Color( 0xc98e00 );;
  sun.material.emissiveIntensity = 1;
  // Add sun to solarSystem
  solarSystem.add(sun);
  // Create Orbits
  var mercuryOrbit = createOrbit(100,20,0,0);
  var venusOrbit = createOrbit(100,30,0,0);
  var earthOrbit = createOrbit(100,40,0,0);
  var marsOrbit = createOrbit(100,50,0,0);
  var jupiterOrbit = createOrbit(100,80,0,0);
  var saturnOrbit = createOrbit(100,100,0,0);
  var uranusOrbit = createOrbit(100,120,0,0);
  var neptuneOrbit = createOrbit(100,130,0,0);
  var plutoOrbit = createOrbit(100,150,0,0);
  solarSystem.add(mercuryOrbit);
  solarSystem.add(venusOrbit);
  solarSystem.add(earthOrbit);
  solarSystem.add(marsOrbit);
  solarSystem.add(jupiterOrbit);
  solarSystem.add(saturnOrbit);
  solarSystem.add(uranusOrbit);
  solarSystem.add(neptuneOrbit);
  solarSystem.add(plutoOrbit);
  // Add planets to Sun
  var mercury = createPlanet({
    textureUrl:"textures/2k_mercury.jpg",
    scale: 1
  });
  mercuryOrbit.add(mercury);
  mercury.position.set(0, 0, 20);
  var venus = createPlanet({
    textureUrl:"textures/2k_venus_atmosphere.jpg",
    scale: 1.5
  });
  venusOrbit.add(venus);
  venus.position.set(0, 0, 30);
  var earth = createPlanet({
    textureUrl:"textures/2k_earth_daymap.jpg",
    scale: 3
  });
  earthOrbit.add(earth);
  earth.position.set(0, 0, 40);
  // Add moon to earth
  var moonOrbit = createOrbit(100, 5, 0, 0);
  var moon = createPlanet({
    textureUrl:"textures/2k_moon.jpg",
    scale: 1
  });
  moonOrbit.add(moon);
  moonOrbit.material.transparent = true;
  moon.position.set(0, 0, 5);
  earth.add(moonOrbit);
  var mars = createPlanet({
    textureUrl:"textures/2k_mars.jpg",
    scale: 2
  });
  marsOrbit.add(mars);
  mars.position.set(0, 0, 50);
  var jupiter = createPlanet({
    textureUrl:"textures/2k_jupiter.jpg",
    scale: 6
  });
  jupiterOrbit.add(jupiter);
  jupiter.position.set(0, 0, 80);
  var saturn = createPlanet({
    textureUrl:"textures/2k_saturn.jpg",
    scale: 5
  });
  saturnOrbit.add(saturn);
  saturn.position.set(0, 0, 100);
  var uranus = createPlanet({
    textureUrl:"textures/2k_uranus.jpg",
    scale: 2
  });
  uranusOrbit.add(uranus);
  uranus.position.set(0, 0, 120);
  var neptune = createPlanet({
    textureUrl:"textures/2k_neptune.jpg",
    scale: 1.8
  });
  neptuneOrbit.add(neptune);
  neptune.position.set(0, 0, 130);
  var pluto = createPlanet({
    textureUrl:"textures/2k_pluto.jpg",
    scale: 1
  });
  plutoOrbit.add(pluto);
  pluto.position.set(0, 0, 150);
  // Add whole system to the scene
  scene.add( solarSystem );
  for (var i = 2; i <= 10; i++) {
    solarSystem.children[i].children[0].box = new THREE.Box3().setFromObject( solarSystem.children[i].children[0] ).getSize().z;
  }
  moon.box = new THREE.Box3().setFromObject( moon ).getSize().z;
  console.log(solarSystem.children[2]);
}

function createOrbit(definition, radius, x , y) {
  var geometry = new THREE.BufferGeometry();
  var verts = [];
  for (i = 0; i <= definition; i++){
    verts.push(
      radius*Math.cos(i*2*Math.PI/definition) + x,
      0,
      radius*Math.sin(i*2*Math.PI/definition) + y
    );
  }
  var vertices = new Float32Array(verts);
  geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  var material = new THREE.LineBasicMaterial( { color: 0xffffff } );
  var line = new THREE.Line( geometry, material );
  return line;
}
