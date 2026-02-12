const fbConfig = {
              apiKey: "AIzaSyCKoCdxnRt497Zq7rP5uP0KFvcA1DPibe0",
              authDomain: "fcm-msg-teleshop.firebaseapp.com",
              projectId: "fcm-msg-teleshop",
              storageBucket: "fcm-msg-teleshop.firebasestorage.app",
              messagingSenderId: "150406104185",
              appId: "1:150406104185:web:8ee667482a917fd4e7c0a8",
              measurementId: "G-GFMQGWJ0KF"
            };
window.GASurl = 'https://script.google.com/macros/s/AKfycbwoNq7u1Wa13ZWHGHHvFY31xDUwyRD4yUzQ5LrHPdhmM58k0tq_Gg2ppiPki8px2IjS9A/exec';
////////////////////////////////////////////////////
/////////////////////////////////////////////////////
window.token = localStorage.getItem('token') || false;
let turnON = document.querySelector('.turnONN');
let info   = document.querySelector('#plase');

// for init new user  or update it 
window.setupUser = (action )=>{ 
      var x= JSON.stringify([window.NAME , window.ID , window.token ])

        fetch( window.GASurl+`?y=${action}&x=${x}`)
            .then(response => response.json())
            .then(data => {data.status=='false'?localStorage.setItem('token',false):true;})
            .catch(err => {
            console.log(err);
          });
  }

//////////////////////////////


 async function initSW(){
        if(!window.navigator.onLine) return;
        const re = await navigator.serviceWorker.getRegistration();
        if(re){ 
            var data= await fetch('/check-cache');
            var test = await data.json();
                if( test.missing ) {
                    console.log('missing');await re.unregister(); window.location.reload();
                }else{ 
                  window.sw =  re;
                  notifINIT()
                }
        }else{
              if('serviceWorker' in navigator){ 
                 navigator.serviceWorker.register('sw.js').then(registration=>{
                 window.sw = registration; 
                 notifINIT()
                  }).catch(e=>{console.log(e)});
               }
          }
}

 async function notif(){
         let sw = await navigator.serviceWorker.ready;
           firebase.initializeApp(fbConfig);
       
      const messaging = firebase.messaging();
           // Replace with your Public VAPID key from Step 1
      const publicVapidKey = 'BFjb5Hz9DHFRIWslwn0FJ89P_y-zNE2jHU4sc_wK79g6YulvSkEAjPfJmRidZiqlgxgxzD9VisP9ygQKo5wIPd4';
  
          messaging.getToken({
            vapidKey: publicVapidKey,
            serviceWorkerRegistration: sw 
          }).then((currentToken) => {
     
             if(window.token && window.token == currentToken) return;
              localStorage.setItem('token',currentToken);
              window.token = currentToken;

              window.setupUser('update');
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


 
  
}      

 async function notifINIT(){

        if (Notification.permission == 'granted' && 'Notification' in window  && window.sw) {
            info.textContent='notifications is on';
            turnON.style.display = 'none';
            notif();
            return;
          
        }else if(Notification.permission == 'denied'){
           info.textContent = 'you have to reset the website notification permission.!';
           turnON.style.display = 'none';

        }else if(window.sw){
            turnON.style.display = 'flex';
            turnON.addEventListener('click', ()=>{
                Notification.requestPermission().then(permission => {
                    if(permission === 'granted'){
                        info.textContent='notification is on';
                        turnON.style.display='none';
                        notif();
                        return;
                      } 
                        })
                  })
        }else{
          setTimeout(notifINIT(), 2000)
        }

    }

  




initSW();





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















