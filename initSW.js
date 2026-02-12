const fbConfig = {
              apiKey: "AIzaSyCKoCdxnRt497Zq7rP5uP0KFvcA1DPibe0",
              authDomain: "fcm-msg-teleshop.firebaseapp.com",
              projectId: "fcm-msg-teleshop",
              storageBucket: "fcm-msg-teleshop.firebasestorage.app",
              messagingSenderId: "150406104185",
              appId: "1:150406104185:web:8ee667482a917fd4e7c0a8",
              measurementId: "G-GFMQGWJ0KF"
            };
window.GASurl = 'https://script.google.com/macros/s/AKfycbwpPvFPtWKXL3bsxKULLszGWSH69rS2DLcP0ml4dRdO6sjMhSJWaF3-wi8SvSCZVM6DZg/exec';
////////////////////////////////////////////////////
/////////////////////////////////////////////////////
window.token = localStorage.getItem('token') || false;
let turnON = document.querySelector('.turnONN');
let info   = document.querySelector('#plase');

// for init new user  or update it 
window.setupUser = (action)=>{ 
        var x= JSON.stringify([window.NAME , window.ID , window.token ])
        fetch( window.GASurl+`?y=${action}&x=${x}`)
            .then(response => response.json())
            .then(data => { console.log('GAS says:', data);  })
            .catch(err => {
            console.log(err);
          });
  }

//////////////////////////////
const swOBJ = {

initSW :async function(){

        if(!window.navigator.onLine) return;
        const re = await navigator.serviceWorker.getRegistration();
        if(re){ 
            var data= await fetch('/check-cache');
            var test = await data.json();
                if( test.missing ) {
                    console.log('missing');await re.unregister(); window.location.reload();
                }else{ 
                  window.sw = re;
                  swOBJ.notifINIT();
                }
        }else{
              if('serviceWorker' in navigator){ 
                 navigator.serviceWorker.register('./sw.js').then(registration=>{
                 window.sw = registration; 
                 swOBJ.notifINIT();
                  }).catch(e=>{console.log(e)});
               }
          }
},

notif: async function(){
      firebase.initializeApp(fbConfig);
      const messaging = firebase.messaging();
           // Replace with your Public VAPID key from Step 1
      const publicVapidKey = 'BFjb5Hz9DHFRIWslwn0FJ89P_y-zNE2jHU4sc_wK79g6YulvSkEAjPfJmRidZiqlgxgxzD9VisP9ygQKo5wIPd4';
          let sw = await navigator.serviceWorker.ready;
          messaging.getToken({
            vapidKey: publicVapidKey,
            serviceWorkerRegistration: sw 
          }).then((currentToken) => {

             if(window.token && window.token == currentToken) return;
              localStorage.setItem('token',currentToken);
              window.token = currentToken;
            //  console.log(window.token)
             setupUser('update');
            })
          .catch((err) => {
            console.error(err); // this.FUNrun=true; // this.FUNname= this.notef;
            });
 

      // Handle foreground messages (app open)
       messaging.onMessage((payload) => {
          console.log('Foreground message:', payload);
          
          if (Notification.permission === 'granted') {
            new Notification(payload.notification?.title || 'FCM Message', {
              body: payload.notification?.body,
              icon: ''  // Optional: Add an icon file
            });
          }
        });


 
  
},      

notifINIT:function(){

        if (Notification.permission == 'granted' && 'Notification' in window  && window.sw) {
            info.textContent='notifacations is on';
            turnON.style.display = 'none';
            return this.notif();
          
        }else if(Notification.permission == 'denied'){
           info.textContent = 'you have to reset the website notifcation permission.!';
           turnON.style.display = 'none';

        }else if(window.sw){
            turnON.style.display = 'flex';
            turnON.addEventListener('click', ()=>{
                Notification.requestPermission().then(permission => {
                    if(permission === 'granted'){
                        info.textContent='notifacations is on';
                        turnON.style.display='none';
                        return this.notif();
                      } 
                        })
                  })
        }

    },

  

}


swOBJ.initSW();









///////////////////////////////////// install prompt/////////////////////////////////////

let downloadC     = document.getElementById('instruction');
let closeDownload = document.getElementsByClassName('okyBtn')[0];
let downLBTN      = document.getElementById('downLBTN');
let deferredPrompt;

downLBTN.addEventListener('click',      ()=>{  downloadC.style.display = 'flex';  })
closeDownload.addEventListener('click', ()=>{  downloadC.style.display = 'none';  })

window.addEventListener('beforeinstallprompt' ,(e)=>{
  e.preventDefault();
  deferredPrompt = e;
  downLBTN.removeEventListener('click', ()=>{  downloadC.style.display = 'flex';  })
  downLBTN.addEventListener('click', ()=>{ deferredPrompt.prompt();  })

})


//////////////////////////////// notifications ////////////////////////////////////////////////

let notifBTN   = document.getElementById('notificIcon');
let notificC   = document.getElementById('notificC'); 
let notiX      = document.getElementsByClassName('notiX')[0];

notifBTN.addEventListener('click', ()=>{  notificC.style.display = 'flex';  })
notiX.addEventListener('click',    ()=>{  notificC.style.display = 'none';  })















