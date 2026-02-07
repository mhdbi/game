import * as trystero from '../library/trystero0.js';

const form = new FormData();
const SCRIPT_URL ="https://script.google.com/macros/s/AKfycbxrYt-PEUGOh8mw0Ui0aFtP7t0KmgqX3R3_pLdolzZtGBtLooXuqzlDhwfIEQFAi6n5/exec";
let roomID;

    
window.addEventListener('beforeunload',  async(e)=>{
    if(!roomID || roomID == null ) return;
    navigator.sendBeacon(SCRIPT_URL , form);
})

let sendData , getData , newPOS;

    battleBtn.innerText = "Finding Opponent...";
    battleBtn.disabled = true;

    try {
        // 1. Ask Google Sheets for a paired Room ID
        const response = await fetch(SCRIPT_URL);
              roomID = await response.text();
              form.append('roomID', roomID);
       
        // 2. Initialize Tystro with that Room ID
        const config = {
            appId: '0000',
            rtcConfig: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
        };

        const game = trystero.joinRoom( config , roomID );

        // 3. Handle Connection
        [sendData , getData]= game.makeAction('data');
            window.sendData = sendData;
            window.getData  = getData;

       game.onPeerJoin(  peerId=>{
        ready()
       });

       getData((data , peerId)=>{
        console.log(data);
       })

    } catch (err) {
        console.error("Matchmaking failed:", err);
        battleBtn.disabled = false;
    }



// // import to start the game 
   async function ready(){
       window.renderer.setAnimationLoop( window.animate );
       document.body.appendChild( window.renderer.domElement );
        document.getElementById('viewport').style.display = 'none';
        
        // load the entities
        // let MYentities = localStorage.getItem('my-entities');
        
        document.getElementById('entity-bar').style.display = 'flex';
    };
    
