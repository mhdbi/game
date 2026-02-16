import * as THREE from 'three';
import { GLTFLoader } from './library/GLTFloader.js';

////////////////////// standerd meshes \\\\\\\\\\\\\\\\\\\\\

  const segmentTemplate = `
    <polygon data-seg="a" class="segment" points="15,5 85,5 75,15 25,15" />
    <polygon data-seg="f" class="segment" points="5,15 5,75 15,65 15,25" />
    <polygon data-seg="b" class="segment" points="95,15 95,75 85,65 85,25" />
    <polygon data-seg="g" class="segment" points="15,80 25,70 75,70 85,80 75,90 25,90" />
    <polygon data-seg="e" class="segment" points="5,85 5,145 15,135 15,95" />
    <polygon data-seg="c" class="segment" points="95,85 95,145 85,135 85,95" />
    <polygon data-seg="d" class="segment" points="15,155 85,155 75,145 25,145" />
  `;

  // 2. Map of numbers to segments
  const mapping = {
    0: ['a','b','c','d','e','f'],
    1: ['b','c'],
    2: ['a','b','g','e','d'],
    3: ['a','b','g','c','d'],
    4: ['f','g','b','c'],
    5: ['a','f','g','c','d'],
    6: ['a','f','g','e','c', 'd'],
    7: ['a','b','c'],
    8: ['a','b','c','d','e','f','g'],
    9: ['a','b','c','d','f','g'],
    '-': ['g'] // Bonus: negative sign
  };

/////


 //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 /////////////////////////////// entity mehes |||||||||||||||||||||||||||||||||||||
/////////////////////////////////////////////////////////////////////////////////
let progress = document.getElementById('progress');
let container = document.getElementsByClassName('progress-bar')[0];
    container.style.display ='flex';
const faceLoader = new THREE.LoadingManager();
      faceLoader.onProgress = (u,l,t)=>{ 
         let v = Math.floor((l/t)*100); 
         container.firstElementChild.textContent = `Loding   ${v}%`;
         progress.value = v; 
        }
      faceLoader.onLoad = async ()=>{ 

      const scripts = [ './main.js',  './cone.js'];
       for(const src of scripts ){
            //  faceLoader.itemStart(src);
             // await new Promise(res=>{
                let moduleScript = document.createElement('script');
                    moduleScript.type = 'module';
                    moduleScript.src = src;
                    moduleScript.async = false;
              //      moduleScript.onload=()=>{ faceLoader.itemEnd(src); res(); }
                    document.body.appendChild(moduleScript);
             //   })
            };

        container.style.display ='none'; 
    }
const gltfLoader = new GLTFLoader(faceLoader);
////////////////////////////////////////
////////////////////////////////////////

 let entities = {};
 let assets = {};
//////////////
       gltfLoader.load('./GameEntity/assets/ground.glb', gltf =>{ 
         assets['ground'] = gltf.scene;
         })
 ////////////////////////////////////////////////////////////////////
      gltfLoader.load('./GameEntity/assets/navMesh.glb', gltf =>{ 
      assets['navMesh'] = gltf.scene; 
      assets['navMesh'].visible = false; 
    })
////////////////////////////////////////////////////////////////////
// let tree;
// gltfLoader.load('../GameEntity/assets/tree.glb', gltf =>{  
//      tree = gltf.scene;
///////////////////////////////////////////////////////////////////
     gltfLoader.load('./GameEntity/assets/tower.glb', gltf =>{  
     assets['tower'] =  gltf.scene;
     assets['tower'].animations = gltf.animations;
     assets['tower'].name = 'tower';

 assets['tower'].userData = {
    health : 3000 ,
    maxHealth : 3000 ,
    attackRad : 5 ,
}
})
///////////////////////////////////////////////////////////////////


     //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////    
/////////////////////////  entities  ////////////////////////////////////    
//////////////////////////////////////////////////////////////////////
{  // Alien
    gltfLoader.load('./GameEntity/Alien.glb', gltf =>{  
  
        entities['Alien']={};

    var model = entities['Alien'].model =  gltf.scene;
    // model.traverse( (n)=>{ if(n.isMesh)n.castShadow = true;  })
    model.scale.multiplyScalar(.8);
    model.name = 'Alien';
    
    model.userData = {
                  class : 'entity',
                  type : 'ground',
                  cost : 4 ,
                  health : 2000 ,
                  maxHealth : 2000 ,
                  hit : 300 ,
                  attackRad : 3 ,
                  maxSpeed  : .5 ,
              }

     model.animations = gltf.animations; 
     })
}    

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{  // Alpaca
  gltfLoader.load('./GameEntity/Alpaca.glb', gltf =>{  
  
        entities['Alpaca']={};

    var model = entities['Alpaca'].model =  gltf.scene;
    // model.traverse( (n)=>{ if(n.isMesh)n.castShadow = true;  })
    model.scale.multiplyScalar(.6);
    model.name = 'Alpaca';
    
    model.userData = {
                  class : 'entity',
                  type : 'ground',
                  health : 2000 ,
                  maxHealth : 2000 ,
                  cost : 4 ,
                  hit : 400 ,
                  attackRad : 3 ,
                  maxSpeed  : .3 ,
              }

     model.animations = gltf.animations; 
     })
}    
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{  // Apators
  gltfLoader.load('./GameEntity/Apators.glb', gltf =>{  
  
        entities['Apators']={};

    var model = entities['Apators'].model =  gltf.scene;
    // model.traverse( (n)=>{ if(n.isMesh)n.castShadow = true;  })
    model.scale.multiplyScalar(.18);
   // model.rotation.z +=180;
    model.name = 'Apators';
    
    model.userData = {
                  class : 'entity',
                  type : 'ground',
                  health : 4000 ,
                  maxHealth : 4000 ,
                  cost : 7 ,
                  hit : 700 ,
                  attackRad : 4 ,
                  maxSpeed  : .3 ,
              }

     model.animations = gltf.animations; 
     })
}    
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Bat
    gltfLoader.load('./GameEntity/Bat.glb', gltf =>{  
  
        entities['Bat']={};
    var model = entities['Bat'].model =  gltf.scene;
        model.scale.multiplyScalar(.35);
        model.name = 'Bat';

        model.userData = {
                    class : 'entity',
                    type : 'Air',
                    cost : 3 ,
                    hit : 200 ,
                    health : 1500 ,
                    maxHealth : 1500 ,
                    attackRad : 3 ,
                    maxSpeed  : .5 ,
                }

        model.animations = gltf.animations; 
        
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Bull
    gltfLoader.load('./GameEntity/Bull.glb', gltf =>{  
  
        entities['Bull']={};
    var model = entities['Bull'].model =  gltf.scene;
        model.scale.multiplyScalar(.35);
        model.name = 'Bull';

        model.userData = {
                    class : 'entity',
                    type : 'ground',
                    cost : 5 ,
                    hit : 500 ,
                    health : 3000 ,
                    maxHealth : 3000 ,
                    attackRad : 3 ,
                    maxSpeed  : .6 ,
                }

        model.animations = gltf.animations; 
        
     })    
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Cow
    gltfLoader.load('./GameEntity/Cow.glb', gltf =>{  
  
        entities['Cow']={};
    var model = entities['Cow'].model =  gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Cow';

        model.userData = {
                    class : 'entity',
                    type : 'ground',
                    cost : 4 ,
                    hit : 100 ,
                    health : 3000 ,
                    maxHealth : 3000 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Deer
    gltfLoader.load('./GameEntity/Deer.glb', gltf =>{  
  
        entities['Deer']={};
    var model = entities['Deer'].model =  gltf.scene;
        model.scale.multiplyScalar(.5);
        model.name = 'Deer';

        model.userData = {
                    class : 'entity',
                    type : 'ground',
                    health : 1500 ,
                    maxHealth : 1500 ,
                    cost : 2 ,
                    hit : 100 ,
                    attackRad : 2 ,
                    maxSpeed  : .7 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Donkey
    gltfLoader.load('./GameEntity/Donkey.glb', gltf =>{  
  
        entities['Donkey']={};
    var model = entities['Donkey'].model =  gltf.scene;
        model.scale.multiplyScalar(.6);
        model.name = 'Donkey'

        model.userData = {
                    class : 'entity',
                    type : 'ground',
                    health : 2000 ,
                    maxHealth : 2000 ,
                    cost : 3 ,
                    hit : 200 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Dragon
    gltfLoader.load('./GameEntity/Dragon.glb', gltf =>{  
  
        entities['Dragon']={};
    var model = entities['Dragon'].model =  gltf.scene;
        model.scale.multiplyScalar(.7);
        model.name = 'Dragon'

        model.userData = {
                    class : 'entity',
                    type : 'Air',
                    health : 3000 ,
                    maxHealth : 3000 ,
                    cost : 5 ,
                    hit : 400 ,
                    attackRad : 3 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Fox
    gltfLoader.load('./GameEntity/Fox.glb', gltf =>{  
  
        entities['Fox']={};
    var model = entities['Fox'].model =  gltf.scene;
        model.scale.multiplyScalar(.55);
        model.name = 'Fox'

        model.userData = {
                    class : 'entity',
                    type : 'Grond',
                    health : 2000 ,
                    maxHealth : 2000 ,
                    cost : 4 ,
                    hit : 500 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Frog
    gltfLoader.load('./GameEntity/Frog.glb', gltf =>{  
  
        entities['Frog']={};
    var model = entities['Frog'].model =  gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Frog';

        model.userData = {
                    class : 'entity',
                    type : 'Grond',
                    health : 1000 ,
                    maxHealth : 1000 ,
                    cost : 2 ,
                    hit : 200 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // George
    gltfLoader.load('./GameEntity/George.glb', gltf =>{  
  
        entities['George']={};
    var model = entities['George'].model =  gltf.scene;
        model.scale.multiplyScalar(.55);
        model.name = 'George'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 2500 ,
                    maxHealth : 2500 ,
                    cost : 5 ,
                    hit : 600 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Husky
    gltfLoader.load('./GameEntity/Husky.glb', gltf =>{  
  
        entities['Husky']={};
    var model = entities['Husky'].model =  gltf.scene;
        model.scale.multiplyScalar(.55);
        model.name = 'Husky'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 2000 ,
                    maxHealth : 2000 ,
                    cost : 3 ,
                    hit : 300 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Parasa
    gltfLoader.load('./GameEntity/Parasa.glb', gltf =>{  
  
        entities['Parasa']={};
    var model = entities['Parasa'].model =  gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Parasa'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 1000 ,
                    maxHealth : 1000 ,
                    hit : 400 ,
                    cost : 3 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Pig
    gltfLoader.load('./GameEntity/Pig.glb', gltf =>{  
  
        entities['Pig']={};
    var model = entities['Pig'].model =  gltf.scene;
        model.scale.multiplyScalar(.6);
        model.name = 'Pig';

        model.userData = {
                   class : 'entity',
                    type : 'Ground',
                    health : 2000 ,
                    maxHealth : 2000 ,
                    cost : 3 ,
                    hit : 200 ,
                    attackRad : 5 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Pug
    gltfLoader.load('./GameEntity/Pug.glb', gltf =>{  
  
        entities['Pug']={};
    var model = entities['Pug'].model =  gltf.scene;
        model.scale.multiplyScalar(.6);
        model.name = 'Pug'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 1000 ,
                    maxHealth : 1000 ,
                    hit : 400 ,
                    cost : 3 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Rat
    gltfLoader.load('./GameEntity/Rat.glb', gltf =>{  
  
        entities['Rat']={};
    var model = entities['Rat'].model =  gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Rat';

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 1000 ,
                    maxHealth : 1000 ,
                    cost : 3 ,
                    hit : 400 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Sheep
    gltfLoader.load('./GameEntity/Sheep.glb', gltf =>{  
  
        entities['Sheep']={};
    var model = entities['Sheep'].model =  gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Sheep';

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 2500 ,
                    maxHealth : 2500 ,
                    hit : 100 , 
                    cost : 2 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Shiba
    gltfLoader.load('./GameEntity/Shiba.glb', gltf =>{  
  
        entities['Shiba']={};
    var model = entities['Shiba'].model =  gltf.scene;
        model.scale.multiplyScalar(.7);
        model.name = 'Shiba';

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 3000 ,
                    maxHealth : 3000 ,
                    cost : 3 ,
                    hit : 300 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Snake
    gltfLoader.load('./GameEntity/Snake.glb', gltf =>{  
  
        entities['Snake']={};
    var model = entities['Snake'].model =  gltf.scene;
        model.scale.multiplyScalar(.5);
        model.name = 'Snake';

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 1500 ,
                    maxHealth : 1500 ,
                    cost : 3 ,
                    hit : 400 ,
                    attackRad : 3 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Spider
    gltfLoader.load('./GameEntity/Spider.glb', gltf =>{  
  
        entities['Spider']={};
    var model = entities['Spider'].model =  gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Spider'

        model.userData = {
                    class : 'entity',
                    type : 'Grond',
                    health : 1500 ,
                    maxHealth : 1500 ,
                    hit : 400 ,
                    cost : 3 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Stag
    gltfLoader.load('./GameEntity/Stag.glb', gltf =>{  
  
        entities['Stag']={};
    var model = entities['Stag'].model =  gltf.scene;
        model.scale.multiplyScalar(.7);
        model.name = 'Stag'

        model.userData = {
                    class : 'entity',
                    type : 'Grond',
                    health : 2000 ,
                    maxHealth : 2000 ,
                    cost : 3 ,
                    hit : 300 , 
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Stego
    gltfLoader.load('./GameEntity/Stego.glb', gltf =>{  
  
        entities['Stego']={};
    var model = entities['Stego'].model =  gltf.scene;
        model.scale.multiplyScalar(.25);
        model.name = 'Stego'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 4500 ,
                    maxHealth : 4500 ,
                    hit : 600 ,
                    cost : 6 ,
                    attackRad : 3 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Trex
    gltfLoader.load('./GameEntity/Trex.glb', gltf =>{  
  
        entities['Trex']={};
    var model = entities['Trex'].model =  gltf.scene;
        model.scale.multiplyScalar(.2);
        model.name = 'Trex';

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 5000 ,
                    maxHealth : 5000 ,
                    cost : 8 ,
                    hit : 1000 ,
                    attackRad : 3 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Tricera
    gltfLoader.load('./GameEntity/Tricera.glb', gltf =>{  
  
        entities['Tricera']={};
    var model = entities['Tricera'].model =  gltf.scene;
        model.scale.multiplyScalar(.35);
        model.name = 'Tricera'

        model.userData = {
                    class : 'entity',
                    type : "Ground",
                    health : 4500 ,
                    maxHealth : 4500 ,
                    hit : 500 ,
                    cost : 5 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Veloci
    gltfLoader.load('./GameEntity/Veloci.glb', gltf =>{  
  
        entities['Veloci']={};
    var model = entities['Veloci'].model =  gltf.scene;
        model.scale.multiplyScalar(.3);
        model.name = 'Veloci';

        model.userData = {
                    class : 'entity',
                    type : "Ground",
                    health : 1500 ,
                    maxHealth : 1500 ,
                    hit : 500 ,
                    cost : 4 ,
                    attackRad : 3 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations;
        
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Wasp
    gltfLoader.load('./GameEntity/Wasp.glb', gltf =>{  
  
        entities['Wasp']={};
    var model = entities['Wasp'].model =  gltf.scene;
        model.scale.multiplyScalar(.55);
        model.name = 'Wasp'

        model.userData = {
                    class : 'entity',
                    type : 'Air',
                    health : 1000 ,
                    maxHealth : 1000 ,
                    cost : 3 , 
                    hit : 400 ,
                    attackRad : 3 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Wolf
    gltfLoader.load('./GameEntity/Wolf.glb', gltf =>{  
  
        entities['Wolf']={};
    var model = entities['Wolf'].model =  gltf.scene;
        model.scale.multiplyScalar(.6);
        model.name = 'Wolf'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 2500 ,
                    maxHealth : 2500 ,
                    cost : 4 ,
                    hit : 500 ,
                    attackRad : 2 ,
                    maxSpeed  : .7 ,
                }

        model.animations = gltf.animations; 
     })    
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Zebra
    gltfLoader.load('./GameEntity/Zebra.glb', gltf =>{  
  
        entities['Zebra']={};
    var model = entities['Zebra'].model =  gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Zebra'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 3000 ,
                    maxHealth : 3000 ,
                    cost : 4 ,
                    hit : 500 ,
                    attackRad : 5 ,
                    maxSpeed  : 1 ,
                }

        model.animations = gltf.animations; 
     })    
}




/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////  vfx  ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
{   // fireWave
    gltfLoader.load('./GameEntity/vfx/fireWave.glb', gltf =>{  
  
        entities['fireWave']={};
    var model = entities['fireWave'].model =  gltf.scene;
        model.name = 'fireWave'

        model.userData = {
                    class : 'vfx',
                    type: 'magic',
                    cost : 5 ,
                    attackRad : 5 ,
                    hit : 200  ,
                    duration : 5,
                    maxSpeed : 5,
                }

        model.animations = gltf.animations; 
     })    
}


{   // tornado
    gltfLoader.load('./GameEntity/vfx/tornado.glb', gltf =>{  
  
        entities['tornado']={};
    var model = entities['tornado'].model =  gltf.scene;
        model.name = 'tornado';

        model.userData = {
                    class : 'vfx',
                    type: 'magic',
                    cost : 5 ,
                    attackRad : 5 ,
                    hit : 200  ,
                    maxSpeed : 5,
                    duration : 6
                }

        model.animations = gltf.animations; 
     })    
}


{   // waterWave
    gltfLoader.load('./GameEntity/vfx/waterWave.glb', gltf =>{  
  
        entities['waterWave']={};
    var model = entities['waterWave'].model =  gltf.scene;
        model.name = 'waterWave';

        model.userData = {
                    class : 'vfx',
                    type: 'magic',
                    cost : 5 ,
                    attackRad : 5 ,
                    hit : 200  ,
                    duration : 5 ,
                    maxSpeed : 5,
                }

        model.animations = gltf.animations; 
     })    
}


{   // zapWave
    gltfLoader.load('./GameEntity/vfx/zapWave.glb', gltf =>{  
  
        entities['zapWave']={};
    var model = entities['zapWave'].model =  gltf.scene;
        model.name = 'zapWave';

        model.userData = {
                  class : 'vfx',
                    type: 'magic',
                    cost : 5 ,
                    attackRad : 5 ,
                    hit : 200  ,
                    duration : 5 ,
                    maxSpeed : 5,
                }

        model.animations = gltf.animations; 
     })    
}







////////////////////////////  exports /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
 export default{segmentTemplate,mapping,   assets   ,entities  };
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



 




        // mesh.children.forEach(m=>{ 
        //   if(m.name=='Plane') 
        //      m.material = new THREE.MeshBasicMaterial({ color: 0x232323 })
        //  })
        //  mesh.traverse( (n)=>{ if(n.isMesh)n.receiveShadow = true;  })
           



