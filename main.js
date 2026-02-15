import * as meshes from './meshes.js';

const {segmentTemplate ,mapping,  entities  } = meshes.default;



const meshesData = entities;
////////////////////////////////////////////////
let test3 = document.getElementsByClassName('test3')[0];
let Pid = document.getElementById('Pid');
let dots = document.getElementById('textDot');

let screen0 = document.getElementById('screen0');
let screen1 = document.getElementById('screen1');
let screen2 = document.getElementById('screen2');

let panelC  = document.getElementsByClassName('panelC')[0];
let deck    = document.getElementById('deck');
let entityC = document.getElementById('entityC');



var l = Object.keys(meshesData);
var r =  Math.floor(Math.random()*l.length/2);
let editNuum =null;

let MYdeck = [];
let entityArr =[...l];

screen0.addEventListener('click', (e)=>{

    if(e.target.className=='add' && editNuum){
            editNuum = e.target.dataset.set;

            document.getElementsByClassName('active')[0].classList.remove('active');
            e.target.parentNode.classList.add('active');    
        
    }else if(e.target.className=='add' ){
  
                    editNuum = e.target.dataset.set;
                    e.target.parentNode.classList.add('active');
                    screen0.scrollTo({ top: 0 , behavior: 'smooth'})
                   deck.querySelectorAll('.entityImg').forEach(e=> e.classList.add('outlineAni'));
  
    }else if(e.target.dataset.name && editNuum ){
               
                [ MYdeck[e.target.dataset.name] , entityArr[editNuum] ] =
                [ entityArr[editNuum] , MYdeck[e.target.dataset.name] ];

                cards(); 
                localStorage.setItem('my-entities', JSON.stringify(MYdeck) );
                editNuum=null;

    }else if(e.target.dataset && e.target.localName =='img'&& !editNuum){
                 let mesh;
                if(e.target.parentNode.parentNode.id == 'deck'){
                    const n = MYdeck[e.target.dataset.name];
                     mesh =  meshesData[n].model;
                }else {
                    const n = entityArr[e.target.dataset.set];
                      mesh =  meshesData[n].model;
                }
                

            panelC.style.display='flex';
            panelC.querySelector('.titlee').textContent = mesh.name;
            panelC.querySelector('.imgg').src           = `./GameEntity/Himg/${mesh.name}.webp`;
            panelC.querySelector('.type').textContent  = mesh.userData.type;
            panelC.querySelector('.cost').textContent  = mesh.userData.cost;
            panelC.querySelector('.speed').textContent ='speed:'+ mesh.userData.maxSpeed*10;
            panelC.querySelector('.hit').textContent   = 'hit:' + mesh.userData.hit ;
            panelC.querySelector('.rang').textContent  = mesh.userData.attackRad;
            panelC.querySelector('.health').textContent= mesh.userData.health;



            if(!editNuum)return;
                  editNuum=null;
                  document.getElementsByClassName('active')[0].classList.remove('active');


    }else if(e.target.className == 'panelC'){

             e.target.style.display = 'none';
    
    }else{
            if(!editNuum)return;
                  editNuum=null;
                  document.getElementsByClassName('active')[0].classList.remove('active');
                  deck.querySelectorAll('.entityImg').forEach(e=> e.classList.remove('outlineAni'))
    }
    
 
});




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Gen ID //////////////////////////////////////////////////////////////
const generateUID = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...Array(length)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
let localSdata = localStorage.getItem('my-entities');
{   // init deck cards and all remain cards

if(!localSdata){
    for(let i=0; i<16; i+=2){ 
       MYdeck.push(l[i]);
    }
     localStorage.setItem('my-entities', JSON.stringify(MYdeck) );
     window.MYdeck = MYdeck;
   }else{
     window.MYdeck = MYdeck= JSON.parse(localSdata);
  }



for(let e=0; e < MYdeck.length; e++){
     entityArr.splice( entityArr.indexOf(MYdeck[e]) ,1);
    }


 cards();

}


let localNI = localStorage.getItem('NI');
{   // init name and ID
if(!localNI){
    window.NAME = 'Noob';
    window.ID   = generateUID(8);
   localStorage.setItem('NI', JSON.stringify( [NAME,ID]) );
   test3.textContent = NAME;
   Pid.textContent = ID;
   setupUser('initUser');  // from initSW
}else{
    let a = JSON.parse(localNI);
     window.NAME = a[0];
     window.ID   = a[1];
    test3.textContent = NAME;
    Pid.textContent = ID;
}

}

await initSW();



 function cards(){
    deck.innerHTML=''; 

        for(let i=0; i < MYdeck.length; i++){
        var HTMLtext = `
            <div class='entityHolder'  > 
            <img class='entityImg' src='./GameEntity/Himg/${MYdeck[i]}.webp' data-name='${i}' >
            </div>
        `;
        deck.innerHTML += HTMLtext;
        }
    /////////////////////////////////////////////////
 let COST = 0;
    for(let e=0; e < MYdeck.length; e++){
    COST+= meshesData[MYdeck[e]].model.userData.cost;
    }
  
    digetNUM(COST)

    /////////////////////////////////////////
    entityC.innerHTML='';
    for(let i=0; i < entityArr.length; i++){
        
        var HTMLtext = `
            <div class='entityHolder'> 
            <img class='entityImg' src='./GameEntity/Himg/${entityArr[i]}.webp' data-set='${i}' >
                <div class='add' data-set='${i}'> add </div>
            </div>
         `;
        entityC.innerHTML += HTMLtext;
        
        }
}



//////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////  screen 1  //////////////////////////////


let userD = document.getElementById('userD');

screen1.addEventListener('click',(e)=>{
  
    if(e.target.className.animVal=='userDD' || e.target.className=='test3'){
        userD.style.display = 'flex';

    }else if(e.target.id=='userDX'){
        userD.style.display = 'none';

    }

})


let changeNI = document.getElementById('changeNI');
let Pname = document.getElementById('Pname');

userD.querySelector('input').oninput=()=>{   

        if(Pname.value ==''){
            changeNI.style.pointerEvents = 'none';
            changeNI.style.background = 'gray';
           
        }else{
            changeNI.style.pointerEvents = 'auto';
            changeNI.style.background = '#ff1d11';
        } 
 }
    
changeNI.addEventListener('click',()=>{
        NAME = Pname.value;
        localStorage.setItem('NI', JSON.stringify( [NAME,ID] ) );
        test3.textContent = NAME;
        Pid.textContent = ID;
        userD.style.display = 'none';
    
   // server init
    setupUser('update');

    })






///////////////////////////////////////////////////////////////////
////////////////////////// screen 2 \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


let AF = document.getElementById('AF');
let addF = document.getElementById('addF');
let Fname = document.getElementById('Fname');
let Fid = document.getElementById('Fid');
let statusF = document.getElementById('statusF');



AF.querySelectorAll('input').forEach(e=> e.oninput=()=>{   
 
        if(Fid.value =='' || Fname.value ==''){
            addF.style.pointerEvents = 'none';
            addF.style.background = 'gray';
           
        }else if(Fid.value.length > 5){
            
            addF.style.pointerEvents = 'auto';
            addF.style.background = '#ff1d11';

        } 
 })



addF.addEventListener('click',()=>{
 let localF = localStorage.getItem('freinds');

    addF.style.pointerEvents = 'none';
    addF.style.background = 'gray';
    dots.style.display ='flex';

    ///////////////// logic ///////////////
    let arr = JSON.parse(localF || '[]');
    if(arr.indexOf(Fid.value)!= -1){   dots.style.display ='none'; 
        statusF.textContent = 'freind exists..!'; return setTimeout(()=>{statusF.textContent=''}, 3000)  }
    ///////////////////////////////////////

      var x = JSON.stringify([ID , Fid.value]);
   fetch(GASurl+`?y=addFreind&x=${x}`  )
    .then(r=> r.json())
    .then(data=>{
        if(data.status== 'true'){
            dots.style.display ='none';
            statusF.textContent = 'freind added';
            statusF.style.color = 'green';
            setTimeout(()=>{statusF.textContent=''}, 3000)
            
             arr.push({name: Fname.value , id: Fid.value})
             localStorage.setItem('freinds', JSON.stringify(arr))
             localF = localStorage.getItem('freinds');
             updatedF()
        }else{
            dots.style.display ='none';
            statusF.textContent = 'Id is not correct!';
            setTimeout(()=>{statusF.textContent=''}, 3000)

        }
       Fid.value = '';
       Fname.value = '';

     });

})



////////////////////////////////////////////////////////////////////
let allF = document.getElementById('allF');
let playWF =  document.getElementsByClassName('playWF')[0];
let waitingF = document.getElementById('waitingF');

function updatedF() {
     let localF = localStorage.getItem('freinds') ;
            let arr = JSON.parse(localF || '[]');
            if(arr.length==0)return allF.innerHTML='';
            allF.innerHTML='';
            arr.forEach(a=>{
                let html = `
                <div class="freinds playerF" data-id=${a.id} data-name=${a.name}>
                        <svg  width="24" height="24" viewBox="0 0 24 24" fill="#e7e7e7" xmlns="http://www.w3.org/2000/svg">
                            <path  d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path  d="M20 22V20C20 18.9391 19.5786 17.9217 18.8284 17.1716C18.0783 16.4214 17.0609 16 16 16H8C6.93913 16 5.92172 16.4214 5.17157 17.1716C4.42143 17.9217 4 18.9391 4 20V22" stroke="#f25d28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <p  style="position: absolute;bottom: -6.5vh;font-size: 14px;">${a.name} </p>
                </div>
                `;
             allF.innerHTML +=html;
            })
            ///////

     let playerF =  document.querySelectorAll('.playerF');
         playerF.forEach(p=>{
            p.addEventListener('click', (e)=>{
                let data = e.currentTarget.dataset;
                    playWF.style.display='flex';
                    playWF.innerHTML='';
                  let li = document.createElement('li');
                        li.className   = 'invited';
                        li.textContent = `invite ${data.name} to play`;
                        li.onclick = async ()=>{ await invitedF(data.id);}
                        playWF.append(li);
                        // delete btn 
                        let delFriend = document.createElement('li');
                            delFriend.id = 'delFriend';
                            delFriend.textContent = `delete ${data.name}`;
                            delFriend.onclick =  ()=>{ delFriendF(data.id , arr) }
                            playWF.append(delFriend);
                        // close 
                        let closeF = document.createElement('li');
                            closeF.id = 'closeF';
                            closeF.textContent= 'close';
                            closeF.onclick = ()=>{ playWF.style.display='none'; }
                            playWF.append(closeF);
              })
            })
         ///////
            dots.style.display ='none';

}

updatedF();

const invitedF= async (id)=>{
              playWF.style.display='none';
              dots.style.display ='flex';
            let res = await window.invited(id);
              
            if (res ){ 
                dots.style.display ='none';
                waitingF.style.display='flex';
                waitingF.style.opacity= 1;
                
            }else{
                dots.firstChild.textContent='sending error .. retry it ';
                dots.style.color = 'red'; dots.style.textShadow = '0px 0px 3px #000';
                setTimeout(()=>{
                    dots.style.display ='none';
                    dots.style.color = '#fff';
                    dots.firstChild.textContent='waiting';
                }, 5000 )
             }
      }
const delFriendF = (id , arr)=>{
         playWF.style.display='none';
         dots.style.display ='flex';
         for(let i=0; i<arr.length; i++){
            if(arr[i].id==id){
                arr.splice(i ,1);
                localStorage.setItem('freinds',JSON.stringify(arr));
            }
         }
         updatedF()
      }
 


////////////////////////////
////////////////////////////
///////////////////////////
//////////////////////////////


  function digetNUM(value) {
    const container = document.getElementById('deckPrice');
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











