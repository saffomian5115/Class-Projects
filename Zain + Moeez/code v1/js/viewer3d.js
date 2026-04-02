/* ============================================
   FOUR WHEELS — 3D VIEWER JS
   4 Different Models based on Vehicle TYPE
   Car | SUV | Bike | Truck
   ============================================ */

function init3DViewer(vehicle) {
  const canvas  = document.getElementById('threeCanvas');
  const loading = document.getElementById('viewer3dLoading');
  const type    = (vehicle && vehicle.type ? vehicle.type : 'Car').toLowerCase();

  const scene  = new THREE.Scene();
  const W = canvas.parentElement.clientWidth  || 600;
  const H = canvas.parentElement.clientHeight || 420;
  const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100);
  camera.position.set(4, 2.5, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  let carBodyMat = new THREE.MeshPhysicalMaterial({
    color:0x00f5ff, metalness:0.9, roughness:0.1, clearcoat:1.0, clearcoatRoughness:0.05,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color:0x88ccff, metalness:0, roughness:0, transmission:0.9, transparent:true, opacity:0.4,
  });
  const tireMat = new THREE.MeshStandardMaterial({ color:0x111111, roughness:0.9 });
  const rimMat  = new THREE.MeshStandardMaterial({ color:0x888888, metalness:1, roughness:0.2 });
  const lightMat= new THREE.MeshStandardMaterial({ color:0x00f5ff, emissive:0x00f5ff, emissiveIntensity:2.0 });
  const glowMat = new THREE.MeshStandardMaterial({ color:0x00f5ff, emissive:0x00f5ff, emissiveIntensity:3.0 });

  scene.add(new THREE.AmbientLight(0x112244, 1.5));
  const cyanLight = new THREE.PointLight(0x00f5ff, 3, 20);
  cyanLight.position.set(5,5,5); scene.add(cyanLight);
  const bl = new THREE.PointLight(0x0066ff, 2, 20); bl.position.set(-5,3,-5); scene.add(bl);
  const pl = new THREE.PointLight(0xbf00ff, 1.5, 15); pl.position.set(0,-2,6); scene.add(pl);
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5,10,5); dir.castShadow=true; scene.add(dir);

  const carGroup = new THREE.Group();
  const wheels   = [];
  let underglow  = null;

  function addWheel(x, y, z, r) {
    r = r || 0.35;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r,r,0.26,24), tireMat);
    t.rotation.x=Math.PI/2; t.position.set(x,y,z); t.castShadow=true; carGroup.add(t);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(r*0.55,r*0.55,0.27,8), rimMat);
    rim.rotation.x=Math.PI/2; rim.position.set(x,y,z); carGroup.add(rim);
    wheels.push(t);
  }

  function addGlow(sx, sz) {
    const g = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.04, sz), glowMat.clone());
    g.position.set(0, 0.03, 0); carGroup.add(g);
    return g;
  }

  // ── BUILD MODEL BY TYPE ──
  if (type === 'bike') {
    camera.position.set(2, 1.8, 3.5);
    const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,1.8,12), carBodyMat);
    frame.rotation.z=Math.PI/2; frame.position.set(0,0.7,0); carGroup.add(frame);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.3,0.4), carBodyMat);
    tank.position.set(0.1,0.98,0); carGroup.add(tank);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55,0.1,0.35), new THREE.MeshStandardMaterial({color:0x111111}));
    seat.position.set(-0.2,1.05,0); carGroup.add(seat);
    const fairing = new THREE.Mesh(new THREE.BoxGeometry(0.15,0.45,0.38), carBodyMat);
    fairing.position.set(0.82,0.82,0); carGroup.add(fairing);
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.06,0.1,0.18), lightMat);
    hl.position.set(0.9,0.84,0); carGroup.add(hl);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.06,0.08,0.16),
      new THREE.MeshStandardMaterial({color:0xff2200,emissive:0xff2200,emissiveIntensity:1.5}));
    tl.position.set(-0.82,0.78,0); carGroup.add(tl);
    const exh = new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.6,8), rimMat);
    exh.rotation.z=Math.PI/2; exh.position.set(-0.3,0.4,0.3); carGroup.add(exh);
    [0.82,-0.82].forEach(function(x){
      addWheel(x, 0.42, 0, 0.42);
    });
    underglow = addGlow(1.4, 0.1);
    underglow.position.set(0,0.52,0);

  } else if (type === 'truck') {
    camera.position.set(5,3,6);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.6,1.0,2.0), carBodyMat);
    cab.position.set(1.4,1.0,0); carGroup.add(cab);
    const base = new THREE.Mesh(new THREE.BoxGeometry(4.6,0.55,2.0), carBodyMat);
    base.position.set(0.2,0.28,0); carGroup.add(base);
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.4,0.15,2.0), carBodyMat);
    bed.position.set(-0.8,0.55,0); carGroup.add(bed);
    [[-2.0,0.3,0,0.1,0.6,2.0],[0,0.3,1.0,2.4,0.6,0.1],[0,0.3,-1.0,2.4,0.6,0.1]].forEach(function(d){
      const w = new THREE.Mesh(new THREE.BoxGeometry(d[3],d[4],d[5]), carBodyMat);
      w.position.set(d[0],d[1],d[2]); carGroup.add(w);
    });
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.2,0.1,2.0), carBodyMat);
    hood.position.set(2.3,0.58,0); carGroup.add(hood);
    const fb = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.4,2.0), carBodyMat);
    fb.position.set(3.0,0.4,0); carGroup.add(fb);
    const rb = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.4,2.0), carBodyMat);
    rb.position.set(-2.2,0.4,0); carGroup.add(rb);
    [0.8,-0.8].forEach(function(z){
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.16,0.4), lightMat);
      hl.position.set(3.0,0.56,z); carGroup.add(hl);
    });
    [[1.4,0.4,1.1],[1.4,0.4,-1.1],[-1.0,0.4,1.1],[-1.0,0.4,-1.1]].forEach(function(p){
      addWheel(p[0],p[1],p[2],0.42);
    });
    underglow = addGlow(4.0, 1.8);

  } else if (type === 'suv') {
    camera.position.set(4.5,2.8,5.5);
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.0,0.7,2.0), carBodyMat);
    body.position.set(0,0.55,0); carGroup.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.4,0.85,1.85), carBodyMat);
    cabin.position.set(-0.1,1.28,0); carGroup.add(cabin);
    const rack = new THREE.Mesh(new THREE.BoxGeometry(2.0,0.06,1.6), rimMat);
    rack.position.set(-0.1,1.74,0); carGroup.add(rack);
    const wsF = new THREE.Mesh(new THREE.PlaneGeometry(1.8,0.7), glassMat);
    wsF.rotation.y=Math.PI/2; wsF.rotation.z=-0.28; wsF.position.set(1.1,1.26,0); carGroup.add(wsF);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.3,0.1,1.95), carBodyMat);
    hood.position.set(1.7,0.95,0); carGroup.add(hood);
    const fb = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.5,2.0), carBodyMat);
    fb.position.set(2.1,0.42,0); carGroup.add(fb);
    const rb = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.5,2.0), carBodyMat);
    rb.position.set(-2.1,0.42,0); carGroup.add(rb);
    [0.8,-0.8].forEach(function(z){
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.18,0.42), lightMat);
      hl.position.set(2.12,0.6,z); carGroup.add(hl);
    });
    [[1.3,0.38,1.05],[1.3,0.38,-1.05],[-1.3,0.38,1.05],[-1.3,0.38,-1.05]].forEach(function(p){
      addWheel(p[0],p[1],p[2]);
    });
    underglow = addGlow(3.4, 1.85);

  } else {
    // Default CAR
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.8,0.65,1.8), carBodyMat);
    body.position.set(0,0.55,0); carGroup.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0,0.6,1.6), carBodyMat);
    cabin.position.set(-0.1,1.1,0); carGroup.add(cabin);
    const wsF = new THREE.Mesh(new THREE.PlaneGeometry(1.5,0.55), glassMat);
    wsF.rotation.y=Math.PI/2; wsF.rotation.z=-0.35; wsF.position.set(0.95,1.08,0); carGroup.add(wsF);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.2,0.08,1.75), carBodyMat);
    hood.position.set(1.6,0.86,0); carGroup.add(hood);
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.08,1.75), carBodyMat);
    trunk.position.set(-1.55,0.86,0); carGroup.add(trunk);
    const fb = new THREE.Mesh(new THREE.BoxGeometry(0.18,0.38,1.8), carBodyMat);
    fb.position.set(1.99,0.38,0); carGroup.add(fb);
    const rb = new THREE.Mesh(new THREE.BoxGeometry(0.18,0.38,1.8), carBodyMat);
    rb.position.set(-1.99,0.38,0); carGroup.add(rb);
    [0.75,-0.75].forEach(function(z){
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.14,0.36), lightMat);
      hl.position.set(2.02,0.52,z); carGroup.add(hl);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.12,0.3),
        new THREE.MeshStandardMaterial({color:0xff2200,emissive:0xff2200,emissiveIntensity:1.5}));
      tl.position.set(-2.02,0.5,z); carGroup.add(tl);
    });
    [[1.2,0.32,1.0],[1.2,0.32,-1.0],[-1.2,0.32,1.0],[-1.2,0.32,-1.0]].forEach(function(p){
      addWheel(p[0],p[1],p[2]);
    });
    underglow = addGlow(3.0, 1.55);
  }

  scene.add(carGroup);

  // Ground
  const ground = new THREE.Mesh(new THREE.CircleGeometry(5,64),
    new THREE.MeshStandardMaterial({color:0x020818,roughness:0.3,metalness:0.5}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-0.01; scene.add(ground);
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.0,2.2,64),
    new THREE.MeshBasicMaterial({color:0x00f5ff,side:THREE.DoubleSide,transparent:true,opacity:0.15}));
  ring.rotation.x=-Math.PI/2; ring.position.y=0.01; scene.add(ring);
  scene.add(new THREE.GridHelper(10,20,0x00f5ff,0x001122));

  // Particles
  var pGeo=new THREE.BufferGeometry();
  var pPos=new Float32Array(900);
  for(var i=0;i<900;i++) pPos[i]=(Math.random()-0.5)*16;
  pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  scene.add(new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x00f5ff,size:0.04,transparent:true,opacity:0.5})));

  setTimeout(function(){ if(loading) loading.classList.add('hidden'); }, 500);

  // Orbit controls
  var isDragging=false, prevMouse={x:0,y:0};
  var spherical={theta:0.5, phi:Math.PI/4, radius: type==='bike'?4:6.5};

  canvas.addEventListener('mousedown',function(e){isDragging=true;prevMouse={x:e.clientX,y:e.clientY};});
  window.addEventListener('mouseup',function(){isDragging=false;});
  window.addEventListener('mousemove',function(e){
    if(!isDragging) return;
    spherical.theta-=(e.clientX-prevMouse.x)*0.008;
    spherical.phi=Math.max(0.15,Math.min(Math.PI/2.2,spherical.phi-(e.clientY-prevMouse.y)*0.005));
    prevMouse={x:e.clientX,y:e.clientY};
  });
  canvas.addEventListener('wheel',function(e){
    spherical.radius=Math.max(2.5,Math.min(12,spherical.radius+e.deltaY*0.01));
    e.preventDefault();
  },{passive:false});

  // Color picker
  document.querySelectorAll('.cs-swatch').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.cs-swatch').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var hex=btn.getAttribute('data-color');
      carBodyMat.color.setStyle(hex);
      if(underglow){ underglow.material.color.setStyle(hex); underglow.material.emissive.setStyle(hex); }
    });
  });

  window.addEventListener('resize',function(){
    var w=canvas.parentElement.clientWidth, h=canvas.parentElement.clientHeight;
    camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
  });

  var autoRotate=true;
  canvas.addEventListener('mousedown',function(){autoRotate=false;});
  var clock=new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    var t=clock.getElapsedTime();
    if(autoRotate) spherical.theta+=0.004;
    camera.position.x=spherical.radius*Math.sin(spherical.phi)*Math.sin(spherical.theta);
    camera.position.y=spherical.radius*Math.cos(spherical.phi);
    camera.position.z=spherical.radius*Math.sin(spherical.phi)*Math.cos(spherical.theta);
    camera.lookAt(0,0.5,0);
    wheels.forEach(function(w){w.rotation.y+=0.04;});
    if(underglow) underglow.material.emissiveIntensity=Math.sin(t*2)*0.5+2.5;
    cyanLight.intensity=2.5+Math.sin(t*1.5)*0.8;
    renderer.render(scene,camera);
  }
  animate();
}
