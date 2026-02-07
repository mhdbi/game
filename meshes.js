import * as THREE from 'three';
import { GLTFLoader } from '../library/GLTFloader.js';

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

const faceLoader = new THREE.LoadingManager();
      faceLoader.onProgress = (u,l,t)=>{ progress.value = (l/t)*100; }
      faceLoader.onLoad = ()=>{  container.style.display ='none'; }
const gltfLoader = new GLTFLoader(faceLoader);
////////////////////////////////////////
////////////////////////////////////////

 let entities = {};
 let gltf;
//////////////
 let ground;
  try{  gltf = await gltfLoader.loadAsync('../GameEntity/assets/ground.glb')  }catch(e){ }
     ground = gltf.scene;

 ////////////////////////////////////////////////////////////////////
let navMesh; 
try{  gltf = await gltfLoader.loadAsync('../GameEntity/assets/navMesh.glb')  }catch(e){ }
    navMesh = gltf.scene;
    navMesh.visible = false; 
////////////////////////////////////////////////////////////////////
// let tree;
// try{  gltf = await gltfLoader.loadAsync('../GameEntity/assets/tree.glb')  }catch(e){ }
//      tree = gltf.scene;
///////////////////////////////////////////////////////////////////
let tower;
try{  gltf = await gltfLoader.loadAsync('../GameEntity/assets/tower.glb')  }catch(e){ }
     tower = await gltf.scene;
     tower.animations = gltf.animations;
     tower.name = 'tower';

 tower.userData = {
    health : 3000 ,
    maxHealth : 3000 ,
    attackRad : 5 ,
}
///////////////////////////////////////////////////////////////////


     //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////    
/////////////////////////  entities  ////////////////////////////////////    
//////////////////////////////////////////////////////////////////////
{  // Alien
  try{  gltf = await gltfLoader.loadAsync('../GameEntity/Alien.glb')  }catch(e){ }
  
        entities['Alien']={};

    var model = entities['Alien'].model = await gltf.scene;
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
}    
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{  // Alpaca
  try{  gltf = await gltfLoader.loadAsync('../GameEntity/Alpaca.glb')  }catch(e){ }
  
        entities['Alpaca']={};

    var model = entities['Alpaca'].model = await gltf.scene;
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
}    
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{  // Apators
  try{  gltf = await gltfLoader.loadAsync('../GameEntity/Apators.glb')  }catch(e){ }
  
        entities['Apators']={};

    var model = entities['Apators'].model = await gltf.scene;
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
}    
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Bat
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Bat.glb')  }catch(e){ }
  
        entities['Bat']={};
    var model = entities['Bat'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Bull
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Bull.glb')  }catch(e){ }
  
        entities['Bull']={};
    var model = entities['Bull'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Cow
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Cow.glb')  }catch(e){ }
  
        entities['Cow']={};
    var model = entities['Cow'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Deer
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Deer.glb')  }catch(e){ }
  
        entities['Deer']={};
    var model = entities['Deer'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Donkey
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Donkey.glb')  }catch(e){ }
  
        entities['Donkey']={};
    var model = entities['Donkey'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Dragon
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Dragon.glb')  }catch(e){ }
  
        entities['Dragon']={};
    var model = entities['Dragon'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Fox
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Fox.glb')  }catch(e){ }
  
        entities['Fox']={};
    var model = entities['Fox'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Frog
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Frog.glb')  }catch(e){ }
  
        entities['Frog']={};
    var model = entities['Frog'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // George
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/George.glb')  }catch(e){ }
  
        entities['George']={};
    var model = entities['George'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Husky
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Husky.glb')  }catch(e){ }
  
        entities['Husky']={};
    var model = entities['Husky'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Parasa
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Parasa.glb')  }catch(e){ }
  
        entities['Parasa']={};
    var model = entities['Parasa'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Pig
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Pig.glb')  }catch(e){ }
  
        entities['Pig']={};
    var model = entities['Pig'].model = await gltf.scene;
        model.scale.multiplyScalar(.6);
        model.name = 'Pig';

        model.userData = {
                   class : 'entity',
                    type : 'Ground',
                    health : 2000 ,
                    maxHealth : 2000 ,
                    cost : 3 ,
                    hit : 200 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations;     
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Pug
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Pug.glb')  }catch(e){ }
  
        entities['Pug']={};
    var model = entities['Pug'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Rat
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Rat.glb')  }catch(e){ }
  
        entities['Rat']={};
    var model = entities['Rat'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Sheep
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Sheep.glb')  }catch(e){ }
  
        entities['Sheep']={};
    var model = entities['Sheep'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Shiba
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Shiba.glb')  }catch(e){ }
  
        entities['Shiba']={};
    var model = entities['Shiba'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Snake
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Snake.glb')  }catch(e){ }
  
        entities['Snake']={};
    var model = entities['Snake'].model = await gltf.scene;
        model.scale.multiplyScalar(.5);
        model.name = 'Snake';

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 1500 ,
                    maxHealth : 1500 ,
                    cost : 3 ,
                    hit : 400 ,
                    attackRad : 5 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations;     
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Spider
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Spider.glb')  }catch(e){ }
  
        entities['Spider']={};
    var model = entities['Spider'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Stag
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Stag.glb')  }catch(e){ }
  
        entities['Stag']={};
    var model = entities['Stag'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Stego
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Stego.glb')  }catch(e){ }
  
        entities['Stego']={};
    var model = entities['Stego'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Trex
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Trex.glb')  }catch(e){ }
  
        entities['Trex']={};
    var model = entities['Trex'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Tricera
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Tricera.glb')  }catch(e){ }
  
        entities['Tricera']={};
    var model = entities['Tricera'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Veloci
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Veloci.glb')  }catch(e){ }
  
        entities['Veloci']={};
    var model = entities['Veloci'].model = await gltf.scene;
        model.scale.multiplyScalar(.3);
        model.name = 'Veloci';

        model.userData = {
                    class : 'entity',
                    type : "Ground",
                    health : 1500 ,
                    maxHealth : 1500 ,
                    hit : 500 ,
                    cost : 4 ,
                    attackRad : 2 ,
                    maxSpeed  : .3 ,
                }

        model.animations = gltf.animations;     
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Wasp
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Wasp.glb')  }catch(e){ }
  
        entities['Wasp']={};
    var model = entities['Wasp'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Wolf
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Wolf.glb')  }catch(e){ }
  
        entities['Wolf']={};
    var model = entities['Wolf'].model = await gltf.scene;
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
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
{   // Zebra
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/Zebra.glb')  }catch(e){ }
  
        entities['Zebra']={};
    var model = entities['Zebra'].model = await gltf.scene;
        model.scale.multiplyScalar(.4);
        model.name = 'Zebra'

        model.userData = {
                    class : 'entity',
                    type : 'Ground',
                    health : 3000 ,
                    maxHealth : 3000 ,
                    cost : 4 ,
                    hit : 500 ,
                    attackRad : 2 ,
                    maxSpeed  : 1 ,
                }

        model.animations = gltf.animations;     
}




/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////  vfx  ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
{   // fireWave
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/vfx/fireWave.glb')  }catch(e){ }
  
        entities['fireWave']={};
    var model = entities['fireWave'].model = await gltf.scene;
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
}


{   // tornado
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/vfx/tornado.glb')  }catch(e){ }
  
        entities['tornado']={};
    var model = entities['tornado'].model = await gltf.scene;
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
}


{   // waterWave
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/vfx/waterWave.glb')  }catch(e){ }
  
        entities['waterWave']={};
    var model = entities['waterWave'].model = await gltf.scene;
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
}


{   // zapWave
    try{  gltf = await gltfLoader.loadAsync('../GameEntity/vfx/zapWave.glb')  }catch(e){ }
  
        entities['zapWave']={};
    var model = entities['zapWave'].model = await gltf.scene;
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
}






////////////////////////////  exports /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
 export default{segmentTemplate,mapping,   tower,ground,navMesh   ,entities  };
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



 




        // mesh.children.forEach(m=>{ 
        //   if(m.name=='Plane') 
        //      m.material = new THREE.MeshBasicMaterial({ color: 0x232323 })
        //  })
        //  mesh.traverse( (n)=>{ if(n.isMesh)n.receiveShadow = true;  })
           



