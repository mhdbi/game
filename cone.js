import * as THREE from 'three';
import { OrbitControls } from './library/OrbitControls.js';
import * as SkeletonUtils from './library/SkeletonUtils.js';

import * as trystero from './library/trystero0.js';

import * as YUKA from './library/yuka.module.js';

////////////////////////////////////////////////////
import * as meshes from './meshes.js';

const {segmentTemplate ,mapping,   assets ,entities  } = meshes.default;
let ONLINE = window.navigator.onLine;

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const scene = new THREE.Scene();
const entityManager = new YUKA.EntityManager();  

      scene.add( assets['navMesh'] ); 


/////////////////////  light  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////////////////////////////////////////////
const directe = new THREE.DirectionalLight(0xffffff , 2);
      directe.position.set(0,5,.5)
     // directe.castShadow = true;
      scene.add(directe);

const spotL = new THREE.SpotLight(0xffffff , 10);
      spotL.angle = Math.PI;
      spotL.penumbra = 0.5;
      spotL.position.y = 2
      scene.add(spotL)
/////////////////////////////////////////////////////////////////
///////////////////// render ///////////////////////////////////
///////////////////////////////////////////////////////////////
const width = window.innerWidth, height = window.innerHeight;
const renderer = new THREE.WebGLRenderer( { antialias: true } );
     // renderer.shadowMap.enabled = true;
      renderer.outputColorSpace= THREE.SRGBColorSpace;
      renderer.setSize( width, height );
      window.renderer =renderer;


const camera = new THREE.PerspectiveCamera( 70, width / height, 0.1, 1000 );
      camera.position.set(0,35,5);

const orbit = new OrbitControls(camera , renderer.domElement);
    //  orbit.minPolarAngle = -Math.PI/2.5 ; 
      orbit.maxPolarAngle = Math.PI/2.5;         // top bottom  vertecal
      orbit.minAzimuthAngle = -Math.PI/2; 
      orbit.maxAzimuthAngle = Math.PI/2;     // left right  horizintal
      orbit.minDistance = 10; orbit.maxDistance = 70; orbit.enablePan = false;   // 2 how close can go ,15 how fare
      orbit.update();


//////////////////////////////////////////////////////////////////////////
//////////////////////////////  for yuka  ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const loaderYuka = new YUKA.NavMeshLoader();
const loudedNavMesh = await  loaderYuka.load('./GameEntity/assets/navMesh.glb');

////////////////////////////////////////////////////////////////////
///////////////////////  deck   /////////////////////////////////
//////////////////////////////////////////////////////////////////

let insideBar1 = document.getElementById('insideBar');
let entityBar1 = document.getElementsByClassName('entity-bar1')[0];
let entityBar2 = document.getElementsByClassName('entity-bar2')[0];

/////////////////
let uiMap = new Map() , Hname , clickedPos , BARmesh , BARmeshN ;
let vfxArr = ['fireWave', 'tornado', 'waterWave' ,'zapWave'];
function inserUItDeck(){ 
    MYdeck.forEach(e=>{ 
        // M
        var img   = document.createElement('img');
            img.setAttribute('data-mname' , e);
            img.src= `./GameEntity/Himg/${e}.webp`;
            img.addEventListener('click', (x)=>{
                        BARmeshN = x.target.dataset.mname;
                        BARmesh = entities[BARmeshN].model;  
                    });
            insideBar1.append(img);
    

        if(vfxArr.indexOf(e) != -1) return;
            // for H
        var imgH   = document.createElement('img');
            imgH.setAttribute('data-hname' , e);
            imgH.src= `./GameEntity/Himg/${e}.webp`;
            imgH.addEventListener('click', (i)=>{
                Hname = i.target.dataset.hname;
                BARmesh = BARmeshN = null;
                    
                clickedPos = entityManager.entities.filter(x=>{ if(x.name== Hname) return true; })[0].userData.realPos;
                })
            entityBar2.append(imgH);

            // for map
            uiMap.set(e, {h:imgH , m:img});
        });
}
/////////////
function syncUIWithEntities() {
    // 1. Reset all 8 bars to 'Inactive' (White)
    uiMap.forEach(ui => {
        ui.h.style.filter = 'contrast(0.1) brightness(0.5)';
        ui.h.style.pointerEvents = 'none';
        ui.m.style.filter = ' drop-shadow(0px 15px 9px black)';
        ui.m.style.pointerEvents = 'auto';
    });

    // 2. Only 'Activate' (Black) bars for entities that actually exist
      const entities = entityManager.entities;
    for(let i= entities.length-1;  i>=0;  i--){ 
        const entity = entities[i];

        const ui = uiMap.get(entity.name);
        if ( ui && entity._uuid==0 ) {
            ui.h.style.filter = 'contrast(0.1) brightness(2)';
            ui.h.style.pointerEvents = 'auto';
            ui.m.style.filter = 'contrast(0.2)';
            ui.m.style.pointerEvents = 'none';
        }
    };
}

////////////////////////////////////////////////////////////////////
///////////////////////  events   /////////////////////////////////
//////////////////////////////////////////////////////////////////
const mousePDown = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();
let intersectsD;

let startPos = { x: 0, y: 0 };
let isZooming = false;
const THRESHOLD = 3; // Allow 3 pixels of accidental movement

// Start click
renderer.domElement.addEventListener( 'mousedown' ,(e)=>{
    // Detect multi-touch (zoom) immediately
    if (e.touches && e.touches.length > 1) {
        isZooming = true;
    } else {
        isZooming = false;
        const contact = e.touches ? e.touches[0] : e;
        startPos.x = contact.clientX;
        startPos.y = contact.clientY;
    }
})

let digetN = 50;
/////////////////////////////////////////////////////////////////////////////////////////////
renderer.domElement.addEventListener('mouseup',async (e)=>{
        if (isZooming) return; // Ignore if they were zooming

    const contact = e.changedTouches ? e.changedTouches[0] : e;
    const dx = Math.abs(contact.clientX - startPos.x);
    const dy = Math.abs(contact.clientY - startPos.y);
    
    // If movement is less than 3px, it's a intentional click
if (dx < THRESHOLD && dy < THRESHOLD) {

    mousePDown.x = (contact.clientX / window.innerWidth) * 2 - 1;
    mousePDown.y = -(contact.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(mousePDown , camera);
    intersectsD = rayCaster.intersectObject(assets['navMesh'], true);
    
    if(intersectsD.length>0){
      const startPoint = intersectsD[0].point;
            clickedPos = new THREE.Vector3().copy(startPoint);

      if(!BARmesh) return;
      Hname = BARmeshN;
      const BARclone = SkeletonUtils.clone(BARmesh);       

    // send data
     wrapperSendGet['sendDEPLOY']({for:'getDEPLOY', BARmeshN ,pos: new THREE.Vector3().copy(startPoint).multiplyScalar(-1)});

    let s = new spawn( BARclone , clickedPos , 'DEPLOY', 0);
        s[BARclone.userData.class]();
        BARmesh=null;

               
    }
  }

});

function addDiget(){
    setTimeout(()=>{addDiget() }, 5000);
    if(digetN==50) return;
    digetN += 1;
    digetNUM(digetN);
}



///////////////////////////////////////////////////////////////////////
//////////////////////////  animate  /////////////////////////////////
/////////////////////////////////////////////////////////////////////
const ti= new YUKA.Time();
let delta;

function animate( time ) {
    delta = ti.update().getDelta();

     // Loop through every entity in your manager
    const entities = entityManager.entities;
    for(let i= entities.length-1; i>=0; i--){ 
        // If the entity has a state machine, run its logic
        const entity = entities[i];
        if (entity.stateMachine && entity.manager) {
            entity.stateMachine.update(delta);
        }    

    };

   // play the animation 
     spotL.position.x= 10*Math.sin(time/1000)
     spotL.position.z= 10*Math.cos(time/1000)
   // end animations 

    entityManager.update(delta);
    renderer.render( scene, camera );
}




let SPholder= document.getElementById('SPholder');
let opponentN;
 async function ready(){
         
        SPholder.style.display= 'flex';
        let SPHtml = `
        <div id="SPcontainer" >
                <div class="PNJ"> ${NAME} </div>
                <div id='VS'> vs </div>
                <div class="PNJ"> ${opponentN} </div>
            </div>
        `;


        let oppDiv = document.createElement('div');
            oppDiv.textContent = opponentN;    oppDiv.id='oppN';
        
        SPholder.innerHTML=SPHtml;
        document.body.append(oppDiv);
        document.getElementById('viewport').remove();

        waitingF.style.opacity= 0;
        waitingF.style.display='none';

         inserUItDeck();  // from local storage
         addDiget();
        
await new Promise((r)=>{
     setTimeout(()=>{r(0) , 2000 });
 }).then((e)=>{
         renderer.setAnimationLoop( animate );
         document.body.appendChild( renderer.domElement );
         entityBar1.style.display = 'flex';
         entityBar2.style.display = 'flex';

        const tower = assets['tower'];
        const t = SkeletonUtils.clone(tower); 
              t.rotation.y = Math.PI; 
        let s = new spawn( t , new THREE.Vector3(0,0,18 ) ,false , 0);
            s['tower']();

        const tt = SkeletonUtils.clone(tower);
        let ss = new spawn( tt , new THREE.Vector3(0,0,-18 ),false , 1 );
            ss['tower']();

         setTimeout(()=>{
            SPholder.style.display='none';
         } , 6000);

    }) 

    };
      
 













//////////////////////////////////////////////////////////////////////
/////////////// hundle the trystero joins ///////////////////////////
////////////////////////////////////////////////////////////////////
let wantPlay = false;
let Ponline = document.getElementById('online');
let textDot = document.getElementById("textDot0");
let screen1 = document.getElementById('screen1');

window.addEventListener('beforeunload',  async(e)=>{
    if(!roomID || roomID == null ) return;
    navigator.sendBeacon(GASurl , form);
})
let btnHolder = document.getElementsByClassName('btnHolder')[0];
    btnHolder.addEventListener('click',(e)=>{

       wantPlay = !wantPlay;
          if(wantPlay){ 
                    btnHolder.querySelector('.btnBefor').classList.add('lightAni');
                    btnHolder.firstChild.textContent='stop';
                let arr = screen1.querySelectorAll('.net');
                    arr[0].classList.add('netR');
                    arr[1].classList.add('netL');
           }else{ 
                    btnHolder.querySelector('.btnBefor').classList.remove('lightAni');
                    btnHolder.firstChild.textContent='play';
                let arr = screen1.querySelectorAll('.net');
                    arr[0].classList.remove('netR');
                    arr[1].classList.remove('netL');
           
            if(roomID){ navigator.sendBeacon(GASurl , form) };
            if(game){ game.leave(); game=null; };
                roomID = null;
                Ponline.style.pointerEvents = 'auto';
                Ponline.style.filter = 'none';
                textDot.style.display ='none';
                
        }
})




const form = new FormData();
let roomID, sendData , getData , game ,joined;
let wrapperSendGet={

   'sendPOS'   :(data)=> {sendData(data)} ,
   'sendDEPLOY':(data)=> {sendData(data)},
   'sendNAME'  :(data)=> {sendData(data)} ,

   'getPOS'    : function(data){
       let e = entityManager.entities.find(e=> e.name==data.N && e._uuid==1 );
                  e.userData.realPos = data.P;
                  findFromPathTo(e , data.P);
                  changeA('idle' , 'go' , e);
   },

   'getDEPLOY' : function(data){
                let BC = SkeletonUtils.clone(entities[data.BARmeshN].model);       
                let s  = new spawn( BC , data.pos , 'PATROL', 1 );
                    s[BC.userData.class]();
   },

   'getNAME'   : function(data){
                opponentN =data.name
                ready();
   }
}

 Ponline.onclick = async () => {
     if(online)
      try {
         if(!roomID && roomID == null){
                Ponline.style.pointerEvents = 'none';
                Ponline.style.filter = 'contrast(0.5)';
                textDot.style.display='flex';
                // 1. Ask Google Sheets for a paired Room ID
                const response = await fetch(GASurl+'?y=onlineR&x=0');
                        roomID = await response.text();
            }
             console.log(roomID)
             form.append('roomID', roomID);
           // 2. Initialize Tystro with that Room ID
          const config = {
              appId: '0000',
              rtcConfig: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
          };
            game = trystero.joinRoom( config , roomID );
          
          // 3. Handle Connection
          [sendData , getData]= game.makeAction('data');
              window.sendData = sendData;
              window.getData  = getData;
  
         game.onPeerJoin( peerId=>{
            joined = true;
           wrapperSendGet['sendNAME']({for:'getNAME' ,name : NAME});

         });

         getData((data , peerId)=>{
           wrapperSendGet[data.for](data);
         })
        

      } catch (err) {
          console.error("Matchmaking failed:", err);
          Ponline.style.pointerEvents = 'auto';
          Ponline.style.filter = 'none';
      }
  
}
      


// play with friends 1v1
window.invited = async (id)=>{
   // hundle html ui in main js
   try{
    var x = JSON.stringify([NAME , id]);
   let data = await fetch(GASurl+`?y=invited&x=${x}`).then(x=>x.json());
       if(data.status!='false'){
        wantPlay = true;
        roomID = data.status;
        Ponline.click();
        return true;
       }else{
        return false;
       }
    }catch(e){
        return false;
    }

}
/////////////////////////////////////////////
// for exit waiting friend
let waitingF = document.getElementById('waitingF');
let exitWF   = document.getElementById('exitWF');
    exitWF.onclick =()=>{ 
            waitingF.style.opacity= 0;
            waitingF.style.display='none';
            btnHolder.click();
        }
// hundle on load for the html and action notification
const openNOT =()=>{
 
    const query = window.location.search;
    const urlP = new URLSearchParams(query);
    if(urlP.has('RT')){
        const roomTime = JSON.parse( urlP.get('RT') );
            let date = new Date();
            console.log(roomTime)
        if(roomTime.time.H - date.getHours()>-1&& roomTime.time.M - date.getMinutes()> -2){
                waitingF.style.display='flex';
                waitingF.style.opacity= 1;
                roomID = roomTime.room;
                wantPlay = true;
                Ponline.click();
                return;
          }
      }
        window.location.href=window.location.origin+window.location.pathname+'#/';
}

if(document.readyState==='complete' || document.readyState=='interactive'){
       openNOT();
}else{
    window.addEventListener('load', openNOT);
}


////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////////////////////
//let Poffline= document.getElementById('offline');
// Poffline.addEventListener('click', ()=>{
//    textDot.innerHTML = 'soon <span></span> ';
//    textDot.style.display='flex';
//    setTimeout(()=>{
//     textDot.innerHTML = 'finding player <span></span>';
//    textDot.style.display='none';
//    } , 5000)
// })

////////////////////////////////////////
////////////// batching \\\\\\\\\\\\\\\\

// const box = new THREE.BoxGeometry(1 , 1 , 1 );
// const sphere = new THREE.SphereGeometry(.6 , 7 , 7);
// const mater = new THREE.MeshPhongMaterial({color:0xffcc00});

// batch(20 ,sphere , mater , 'x');









///////////////////////////////////////////////////////////////
////////  End  ///////////   End  //////////  End  ////////////
/////////////////////////////////////////////////////////////




  





  




//////////////////////////////////////////////////////////////////////
//  .sub  subScalar ////  .divide   .divideScalar  // multiply  .multiplyScalar  
// .equals // v1.dot()  // .cross 

////////////////////////    end      //////////////////////////
////////////////////////    end      /////////////////////////





























window.addEventListener('resize',()=>{
    if(!joined){ return init() };

    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
})

///////////////////////////////////////////////////////////////////////



{     // instanc draw

    // function batch(maxInstance , mesh , material ){ 
//       const maxVertexCount = mesh.attributes.position.count;
//       const maxIndexCont = mesh.index.count;

//       const batchMesh =new THREE.BatchedMesh( maxInstance ,maxVertexCount , maxIndexCont , material );
//       scene.add(batchMesh);

//       const batchGeoId = batchMesh.addGeometry(mesh);

          
//       ///////////////////////////////////////////
//       function setMatrix(x , z ){
//           const mat = new THREE.Matrix4();
//           const pos = new THREE.Vector3(0 , 0, 0);
//           const scale = new THREE.Vector3(1,1,1);
//           const rot = new THREE.Euler();
//           const quaternion = new THREE.Quaternion();

//              pos.x += -24 + x ;
//              pos.z += z + Math.random()*10 - 5;

//               quaternion.setFromEuler(rot);
//         return mat.compose(pos , quaternion , scale);
//       }
   


//       for(let i=0; i < maxInstance; i++){
//         let id;
//         id = batchMesh.addInstance(batchGeoId);
//         let ii = i%100;
//         if(ii < 50){ 
//           batchMesh.setMatrixAt(id , setMatrix(ii , -22));
//         }else{
//           batchMesh.setMatrixAt(id , setMatrix(ii%50 , 22));
//         }
//       }

// }

// batch(100 ,tree.children[0].geometry , tree.children[0].material );
////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////







// const count = 20;
// const geometry = stone.children[0].geometry;


// const material = stone.children[0].material;


// const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

// const dummy = new THREE.Object3D();
// for (let i = 0; i < count; i++) {
//     if(i<count/2){ 
//         dummy.position.set( Math.random() * 30 - 15 , 0.1 ,  + 15);
//         // dummy.rotation.y = Math.random() * Math.PI;
//         // var s =Math.random()*2;
//         // dummy.scale.set(s,s,s);
//         dummy.updateMatrix();
//         instancedMesh.setMatrixAt(i, dummy.matrix);
//     }else{
//          dummy.position.set( Math.random() * 30 - 15 , 0.1 ,  - 15);
//         // dummy.rotation.y = Math.random() * Math.PI;
//         // var s =Math.random()*2;
//         // dummy.scale.set(s,s,s);
//         dummy.updateMatrix();
//         instancedMesh.setMatrixAt(i, dummy.matrix);
//     }
// }
// scene.add(instancedMesh);






// const c =3;

// const geometry2 = column.children[0].geometry;
// const material2 = column.children[0].material;

// const instancedMesh2 = new THREE.InstancedMesh(geometry2, material2, c);
// const dummy2 = new THREE.Object3D();



//         dummy2.position.set(0,0,-18);
        
//         dummy2.updateMatrix();
//         instancedMesh2.setMatrixAt(0, dummy2.matrix);
 
//         dummy2.position.set(-25.5,0,-18);

//         dummy2.updateMatrix();
//         instancedMesh2.setMatrixAt(1, dummy2.matrix);

//         dummy2.position.set(-25.5,0,0);

//         dummy2.updateMatrix();
//         instancedMesh2.setMatrixAt(2, dummy2.matrix);

// scene.add(instancedMesh2)

}



//////////////////////////////////////////////
///////////////// textuer ////////////////////

const loader = new THREE.TextureLoader();

// Load the optimized images you saved from Squoosh
const colorTexture = loader.load('./public/texture.webp');
const normalTexture = loader.load('./public/normal.webp');
const roughnessTexture = loader.load('./public/rofness.webp');

// normalTexture.colorSpace = THREE.NoColorSpace;
// normalTexture.type = THREE.HalfFloatType;
// We apply the tiling settings to ALL of them so they stay aligned
[colorTexture,normalTexture, roughnessTexture].forEach(tex => {  // [ + roughnessTexture]
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2,2); // Adjust this based on your 60m size!
    //tex.flipY =false;
});

const TextuerMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    vertexColors: false // Keeping this for your river!
});

//TextuerMaterial.normalScale.set(-1,1)


assets['ground'].traverse((child)=>{
  if(child.name=='Plane'){
    child.material = TextuerMaterial;
  }
})
scene.add(assets['ground'])










































  function digetNUM(value) {
    const container = document.getElementById('display-container');
    container.innerHTML = ''; // Clear current display
   
    const chars = value.toString().split(''); // Convert "123" to ['1', '2', '3']

    chars.forEach(char => {
      // Create a new SVG for each character
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 100 160");
      svg.classList.add("digit-svg");
      svg.innerHTML = segmentTemplate;
     
      container.appendChild(svg);

      // Light up segments if character is in our map
      if (mapping[char]) {
        mapping[char].forEach(segId => {
          svg.querySelector(`[data-seg="${segId}"]`).classList.add('on');
        });
      }
    });
  }
////////////
 

  digetNUM(50);







































////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//////////////]]]]]]]]]]]]]][[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]\\\\\\\\\\\\\\\\\
/////////////////////////// state machine ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
function changeA(from , to , vehicle){
        vehicle.userData.anim = to;
        vehicle.animations.get(from).reset().fadeOut(vehicle.crossFadeDuration);
        vehicle.animations.get(to).reset().fadeIn(vehicle.crossFadeDuration);
    }
/////////////////////////////////////////////////

class PatrolState extends YUKA.State {
    enter(vehicle){
      
      const idle = vehicle.animations.get('idle');
            idle.reset().fadeIn(vehicle.crossFadeDuration);

            vehicle.userData.realPos = clickedPos = vehicle.position;
    }

    execute(vehicle ) {
        if (vehicle.manager === null) return;
            vehicle.mixer.update(delta)

        const entities = vehicle.manager.entities;
        const AR = vehicle.userData.attackRad;

       for(const entity of entities){ 

             // animation handler for both uuid  1 , 0
            if(entity.position.squaredDistanceTo(vehicle.userData.realPos) < 0.05 && vehicle.userData.anim =='go'){
               changeA('go', 'idle', vehicle);
             }


            if (entity === vehicle || entity._uuid==vehicle._uuid ) continue; // Don't target yourself
          //  if (vehicle.userData.type === 'Ground' && entity.userData.type === 'Air') continue;
                  
            const distSq = vehicle.position.squaredDistanceTo(entity.position);

            // 1. Priority 1: Look for Enemy Troops
             if ( distSq <=  AR *AR ) {

                        vehicle.userData.targetEnemy = entity;
                        vehicle.stateMachine.changeTo('ATTACK');
                        return;     
             }

           
        };
     // end of the loop /


           if( vehicle.name != Hname || vehicle._uuid==1) return;

           if( vehicle.userData.realPos == clickedPos ){
              return;
           }else{
             wrapperSendGet['sendPOS']({for:'getPOS', N:vehicle.name , P:new THREE.Vector3().copy(clickedPos).multiplyScalar(-1) });

               vehicle.userData.realPos = clickedPos;
               changeA('idle', 'go', vehicle)
               findFromPathTo(vehicle , clickedPos);
           };
        
            

    }


    exit(vehicle){
      const idle = vehicle.animations.get('idle');
            idle.reset().fadeOut(vehicle.crossFadeDuration);
    }
}

////..............

class AttackState extends YUKA.State {
    enter(vehicle) {
         // animations 
         const attack = vehicle.animations.get('attack');
               attack.reset().fadeIn(vehicle.crossFadeDuration);

        // 1. Stop the movement behaviors
        const followPath = vehicle.steering.behaviors.find(b => b instanceof YUKA.FollowPathBehavior);
        if (followPath) {followPath.active = false;
                vehicle.velocity.set(0,0,0);}

        // 2. Face the enemy
        vehicle.lookAt(vehicle.userData.targetEnemy.position);
       
        // Initialize attack timer
        vehicle.userData.lastAttackTime = 0;
        console.log("Entering Combat!");
      }


    execute(vehicle ) {
        // update animations;
        vehicle.mixer.update(delta);

        const target = vehicle.userData.targetEnemy;
        const AR     = vehicle.userData.attackRad;

        // 3. Safety Check: If target is dead or gone, go back to Patrol
        if (!target || !target.manager) {
            vehicle.stateMachine.changeTo('PATROL');
            return;
        }

        // 4. Check Distance: If enemy moved away, go back to Patrol to chase them
        const distSq = vehicle.position.squaredDistanceTo(target.position);
        if (distSq > AR*AR) { // Range + buffer
            vehicle.stateMachine.changeTo('PATROL');
            return;
        }

        // Use delta for attack speed
        vehicle.userData.lastAttackTime += delta;

        if (vehicle.userData.lastAttackTime >= 1.0) { // 1 second interval
            this.attack( target , vehicle.userData.hit );
            vehicle.userData.lastAttackTime = 0;
        }

      }

     exit(vehicle){
        const attack = vehicle.animations.get('attack');
               attack.reset().fadeOut(vehicle.crossFadeDuration);
     }

     attack( target , hit ) {
          target.userData.health -= hit; // Deal 10 damage
        
          const healthPercent = target.userData.health / target.userData.maxHealth;
        
          // Update the visual bar
          if (target.userData.healthBar) {
              target.userData.healthBar.updateHealth(healthPercent);
          }

      }


}

//................

class GlobalState extends YUKA.State {
    execute(vehicle) {
        // Ensure we don't try to "die" if we are already removed from the manager
        if (vehicle.manager !== null && vehicle.userData.health <= 0  ) {
            this.die(vehicle);
        }
    }

    die(vehicle) {
        const mesh = vehicle._renderComponent; //|| vehicle.mesh;
      
        if (mesh) {
             
            if(mesh.geometry){    mesh.geometry.dispose();   }

            if(mesh.material){
                if(Array.isArray(mesh.material)){
                    mesh.material.forEach(m => m.dispose() );

                }else{
                    mesh.material.dispose();
                }
            }

            if (mesh.parent) {   mesh.parent.remove(mesh);  }

        }
        
        // Important: Remove from manager makes vehicle.manager null
        if (vehicle.manager) {
            vehicle.manager.remove(vehicle);
            syncUIWithEntities();
        }
          console.log(vehicle)
        if(vehicle.name== 'tower'){
            console.log(vehicle)
            let winner , looser;
            vehicle._uuid==0?(winner=opponentN,looser=NAME):(winner=NAME,looser=opponentN);

                SPholder.style.display= 'flex';
            let SPHtml = `
            <div id="SPcontainer" >
                    <div class="PNJ" id='winner'> ${winner} is the winner </div>
                    <div class="PNJ" id='looser'> ${looser} is the looser </div>
                    <div id='VS' onclick='window.location.reload()'> exit </div>
                </div>
            `;
            SPholder.innerHTML=SPHtml;
            

            
        }
    }
}

//................


class DeployState extends YUKA.State {
    enter(entity) {
        entity.maxSpeed = 0; // Don't move yet
        entity.spawnTimer = 0;
        entity.deploymentTime = 1; // 1 second delay

        // Show clock and play spawn animation
        if (entity.clockMesh) entity.clockMesh.visible = true;
        // if (entity.mixer) entity.clipAction('Idle').play();
    }

    execute(entity) {
        entity.spawnTimer += delta;
        const progress = Math.min(entity.spawnTimer / entity.deploymentTime, 1);

        // Update Clock Visuals (The "Loading" effect)
        if (entity.clockMesh) {
            entity.clockMesh.geometry.dispose();
            entity.clockMesh.geometry = new THREE.RingGeometry(
                0.4, 0.5, 32, 1, 0, Math.max(progress * Math.PI * 2 , 0.0001)
            );
           
            // Optional: Make clock face the camera
            // entity.clockMesh.lookAt(camera.position);
        }

        // Transition logic
        if (entity.spawnTimer >= entity.deploymentTime) {
            entity.stateMachine.changeTo('PATROL');
        }
    }

    exit(entity) {
        // Remove clock visuals
        if (entity.clockMesh) {
            entity.clockMesh.visible = false;
            // Clean up geometry to prevent memory leaks
            entity.clockMesh.geometry.dispose();
        }
        entity.maxSpeed = entity.userData.maxSpeed;
    }
}
//..............

class VfxState extends YUKA.State {
  enter(vehicle) {
          const vfx = vehicle.animations.get('vfx');
                vfx.reset().fadeIn(vehicle.crossFadeDuration);

                vehicle.userData.realPos = clickedPos = vehicle.position;

    this.duration = vehicle.userData.duration;
    this.elapsed = 0;
  }

  execute(vehicle) {
    //const delta = vehicle.manager.getTime().getDelta()
    
    this.elapsed += delta;

    if (this.elapsed >= this.duration) {
      this.die(vehicle)
    }

    //  check for enemys
     if (vehicle.manager === null) return;
            vehicle.mixer.update(delta);

        const entities = vehicle.manager.entities;
        const AR = vehicle.userData.attackRad;

       for(const entity of entities){ 

            if (entity === vehicle || !entity.userData.enemy ) continue; // Don't target yourself

            const distSq = vehicle.position.squaredDistanceTo(entity.position);

            // 1. Priority 1: Look for Enemy Troops
             if ( distSq <=  AR *AR ) {
                 this.attack(entity)
             }
           }
           
  }

//   attack( target) {
//           target.userData.health -= 500; // Deal 10 damage
        
//           const healthPercent = target.userData.health / target.userData.maxHealth;
        
//           // Update the visual bar
//           if (target.userData.healthBar) {
//               target.userData.healthBar.updateHealth(healthPercent);
//           }

//       }

    die(vehicle) {
        const mesh = vehicle._renderComponent; //|| vehicle.mesh;
      
        if (mesh) {
             
            if(mesh.geometry){
                mesh.geometry.dispose();
 
            }

            if(mesh.material){
                if(Array.isArray(mesh.material)){
                    mesh.material.forEach(m => m.dispose() );

                }else{

                    mesh.material.dispose();
                }
            }

            if (mesh.parent) {
  
                mesh.parent.remove(mesh);

            }
        }
        
        // Important: Remove from manager makes vehicle.manager null
        if (vehicle.manager) {
            vehicle.manager.remove(vehicle);
            syncUIWithEntities();
        }
    }
}
//...............



////////////////////////////////////////////////////////////
///////////////////////  tower classes \\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////////////////////////////////////////

class TowerIdleState extends YUKA.State {
    enter(tower){
        const attack = tower.animations.get('attack');
              attack.reset().fadeIn(tower.crossFadeDuration);
          //    attack.enabled = false;
    }

    execute(tower) {
        if (tower.manager === null) return;
        let AllEnemy = false;
        tower.mixer.update(delta);

        const entities = tower.manager.entities;
        const range = 64; // Attack range

        tower.userData.lastAttackTime += delta;
        if(tower.userData.lastAttackTime <= 2) return;

        for (const entity of entities) {
            if(tower == entity || entity._uuid == tower._uuid) continue;
                const distSq = tower.position.squaredDistanceTo(entity.position);
     
                if (distSq < range ) {

                    this.shoot( entity);
                    tower.userData.lastAttackTime = 0;
            
                  AllEnemy = true;
                }
            }

        if(tower.userData.lastAttackTime >= 2){  tower.userData.lastAttackTime =0  }
         
        //  const attack = tower.animations.get('attack');
        // if(AllEnemy==false){
        //          attack.reset();
        //          attack.enabled=false;
        // }else{
        //          attack.enabled=true;
        // }
    }

     shoot( target ) {

        target.userData.health -= 100; 
        const healthPercent = target.userData.health / target.userData.maxHealth;

          if (target.userData.healthBar) {
              target.userData.healthBar.updateHealth(healthPercent);
          }
        // You can trigger your projectile animation here
    }
}







/////////////////////////..........\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////////////////////////////////////////


async function findFromPathTo(v, to) {
    // 1. Convert Three.js positions to Yuka Vector3s
    const fromYuka = new YUKA.Vector3(v.position.x, v.position.y, v.position.z);
    const toYuka = new YUKA.Vector3(to.x, to.y, to.z);

    // 2. Pass the Yuka vectors to the NavMesh
   // const r = await loudedNavMesh.getRegionForPoint(fromYuka);
   // console.log(r)  for check if null on the navMesh
    const path = await loudedNavMesh.findPath(fromYuka, toYuka);
    
    // console.log(path);

    // 3. Update the behavior (Uncommented and fixed for you)
    const vehicleBehavior = v.steering.behaviors.find(b => b instanceof YUKA.FollowPathBehavior);

    if (path.length > 0) {
        vehicleBehavior.active = true;
        vehicleBehavior.path.clear();

        for (let p of path) {
            // path points returned by NavMesh are already YUKA.Vector3
            vehicleBehavior.path.add(p);
        }
    } else {
        vehicleBehavior.active = false;
    }
}

////////...........end state machine..........\\\\\\\\\








class spawn{
    constructor( cloneM , position , state , uuid){ 
        
        this.uuid = uuid;
        this.state = state;
        this.cloneM     = cloneM;
        this.position   = position;
        this.pivotGroup = new THREE.Group();
        this.mixer      = new THREE.AnimationMixer(cloneM); 
        this.animations = new Map();
        this.vehicle    = new YUKA.Vehicle();

    }


 initV(){
    const vehicle = this.vehicle;
          vehicle.userData = this.cloneM.userData;
          vehicle._uuid = this.uuid;

          //////////////////////////////
          vehicle.mixer = this.mixer;
          vehicle.animations = this.animations;
          vehicle.position.copy(this.position);
          vehicle.name                = this.cloneM.name;
          vehicle.steering.active     = false;
        //  name=='tower'?vehicle.mass  = Infinity :null;

        ////////////////////////////////////////////////////
        this.pivotGroup.add(this.cloneM);
        vehicle.setRenderComponent(this.pivotGroup,(entity,renderComponent)=>{
            renderComponent.position.copy(entity.position);
            renderComponent.quaternion.copy(entity.rotation);
        });  // sync shoud be declear

       ////////////////////////////////////////////////////
      vehicle.stateMachine = new YUKA.StateMachine(vehicle);
      vehicle.stateMachine.globalState = new GlobalState();

    return vehicle;
 }


 entity(){
    let vehicle = this.initV();
    let cost = vehicle.userData.cost;
     if ( digetN < cost ) return;
      digetN -= cost;
      digetNUM(digetN);
    ///////////////////////////////////////////////////////////////////////////////////////////

     const go     =  this.mixer.clipAction('go');       go.play();        go.enabled = false;
     const attack =  this.mixer.clipAction('attack');   attack.play();    attack.enabled = false;
     const death  =  this.mixer.clipAction('death');    death.play();     death.enabled = false;
     const idle   =  this.mixer.clipAction('idle');     idle.play();      idle.enabled = false;

     this.animations.set('go' , go);           this.animations.set('idle' , idle); 
     this.animations.set('attack' , attack);   this.animations.set('death' , death);     


       const clockMesh = this.createClockUI();
       const healthBar = this.createHealthBar();

          vehicle.boundingRadius      = 0.2;
          vehicle.userData.healthBar  = healthBar;
          vehicle.steering.active     = false;
        //  name=='tower'?vehicle.mass  = Infinity :null;


            this.pivotGroup.add(healthBar);
            this.pivotGroup.add(clockMesh);
            scene.add(this.pivotGroup);

          vehicle.clockMesh = clockMesh;

    // 3. FSM Setup
    vehicle.stateMachine.add('PATROL', new PatrolState());
    vehicle.stateMachine.add('ATTACK', new AttackState());
    vehicle.stateMachine.add('DEPLOY', new DeployState());
   
    // behaviors
    const followPath = new YUKA.FollowPathBehavior();
          followPath.nextWaypointDistance = 0.5;
          followPath.weight = 5;
          followPath.active = false;

    // const separation = new YUKA.ObstacleAvoidanceBehavior(entityManager.entities);
    //       separation.weight =  3;  const arrive = new YUKA.ArriveBehavior();  
   // vehicle.steering.add(separation);
    vehicle.steering.add(followPath);
  
    // 5. Add to Manager (Now it exists in the "World")
    entityManager.add(vehicle);
    syncUIWithEntities();
    vehicle.stateMachine.changeTo(this.state);
    return vehicle;

 }


 vfx(){
        let vehicle = this.initV();
        let cost = vehicle.userData.cost;
     if ( digetN < cost ) return;
        digetN -= cost;
        digetNUM(digetN);
      /////////////////////////////////////////////////////////////////////////////////
        const vfx = this.mixer.clipAction('vfx');    vfx.play();    vfx.enabled = false;
            this.animations.set('vfx' , vfx);

    scene.add(this.pivotGroup);

   // digetNUM(digetN-=5);

        vehicle.stateMachine.add('DEPLOY', new DeployState());
        vehicle.stateMachine.add('PATROL', new VfxState() );
       // 5. Add to Manager (Now it exists in the "World")
        entityManager.add(vehicle);
        vehicle.stateMachine.changeTo(this.state);
     //   syncUIWithEntities();
 return vehicle;
 }

tower(){
    let vehicle = this.initV();

        vehicle.maxSpeed= 0;
    const attack = this.mixer.clipAction('attack');    attack.play();    attack.enabled = false;
            this.animations.set('attack' , attack);

            scene.add(this.pivotGroup);

        vehicle.stateMachine.add('towerI', new TowerIdleState() );

        entityManager.add(vehicle);
        vehicle.stateMachine.changeTo('towerI');
}

//.......................
 createHealthBar() {
    // Create a canvas to draw the green/red bar
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 16;
    const context = canvas.getContext('2d');

    // Create the texture
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
   
    // Scale it to be wide and thin
    sprite.scale.set(0.9, 0.1, 1);
    sprite.position.y = 2.5; 

    // Function to update the bar's appearance
    sprite.updateHealth = (percent) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Red background
        context.fillStyle = '#ff0000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Green foreground
        context.fillStyle = '#00ff00';
        context.fillRect(0, 0, canvas.width * percent, canvas.height);
        texture.needsUpdate = true;
    };

    sprite.updateHealth(1.0); // Start full
    return sprite;
}
//  create the initial clock mesh
 createClockUI() {
    const geometry = new THREE.RingGeometry(0.4, 0.5, 32, 1, 0, 0.001);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    const mesh = new THREE.Mesh(geometry, material);
   
    // Position it above the character's head
    mesh.position.y = 3.5;
    return mesh;
}
////........

}


















//  function createNavMeshHelper(navMesh) {
//     const positions = [];

//     for (const region of navMesh.regions) {
//         // We start at the first edge of the polygon
//         const edge = region.edge;
//         let currentEdge = edge;

//         // Loop through the linked list of edges to get each vertex
//         do {
//             const vertex = currentEdge.vertex;
//             positions.push(vertex.x, vertex.y, vertex.z);
//             currentEdge = currentEdge.next;
//         } while (currentEdge !== edge);
//     }

//     const geometry = new THREE.BufferGeometry();
//     geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
   
//     // Using MeshBasicMaterial with wireframe helps us see the triangle edges
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
//     return new THREE.Mesh(geometry, material);
// }

// // Usage:
// const helper = createNavMeshHelper(loudedNavMesh);
// scene.add(helper);











































