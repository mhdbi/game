
window.token = localStorage.getItem('token') || false;

const swOBJ = {

checkSW :async function(){
        const re = await navigator.serviceWorker.getRegistration();
        if(re){ 
            var data= await fetch('/check-cache');
            var test = await data.json();
                if( test.missing ) {
                    console.log('missing');await re.unregister(); window.location.reload();
                }else{ window.sw = re;}
        }else{
            this.SWinit();
        }
},

SWinit:function(){
   if('serviceWorker' in navigator){ 
     navigator.serviceWorker.register('sw.js').then(registration=>{
     window.sw = registration; 
     
       }).catch(e=>{console.log(e)});
 
    //  navigator.serviceWorker.addEventListener('controllerchange',async()=>{ this.sw = navigator.serviceWorker.controller; })
   }
 

  },


notif:function(callBack){
      
     const fbConfig = {
              apiKey: "AIzaSyCKoCdxnRt497Zq7rP5uP0KFvcA1DPibe0",
              authDomain: "fcm-msg-teleshop.firebaseapp.com",
              projectId: "fcm-msg-teleshop",
              storageBucket: "fcm-msg-teleshop.firebasestorage.app",
              messagingSenderId: "150406104185",
              appId: "1:150406104185:web:8ee667482a917fd4e7c0a8",
              measurementId: "G-GFMQGWJ0KF"
            };

            
      firebase.initializeApp(fbConfig);
      const messaging = firebase.messaging();
           // Replace with your Public VAPID key from Step 1
      const publicVapidKey = 'BFjb5Hz9DHFRIWslwn0FJ89P_y-zNE2jHU4sc_wK79g6YulvSkEAjPfJmRidZiqlgxgxzD9VisP9ygQKo5wIPd4';
        if(!window.sw) {return setTimeout(this.notef,1000);}

          messaging.getToken({
            vapidKey: publicVapidKey,
            serviceWorkerRegistration: window.sw 
          }).then((currentToken) => {

             if(window.token && window.token == currentToken) return;
              localStorage.setItem('token',currentToken);
              window.token = currentToken;
              console.log(window.token)
             callBack();
            })
          .catch((err) => {
            console.error('Error getting token:', err);
            // this.FUNrun=true;
            // this.FUNname= this.notef;
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
         // this.notef();
          // displayInstrution();
          return;
        }else if(Notification.permission == 'denied'){
         //  displayInstrution();

        }else if(window.sw){
            c.style.display='flex'; 
            c.addEventListener('click', ()=>{
                c.style.display='none';
                Notification.requestPermission().then(permission => {
                    if(permission === 'granted'){console.log(23232)} //return this.notef()
                        })
                  })
        }

    },

  

}

//swOBJ.checkSW();










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















