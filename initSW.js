const fbConfig = {
              apiKey: "AIzaSyCKoCdxnRt497Zq7rP5uP0KFvcA1DPibe0",
              authDomain: "fcm-msg-teleshop.firebaseapp.com",
              projectId: "fcm-msg-teleshop",
              storageBucket: "fcm-msg-teleshop.firebasestorage.app",
              messagingSenderId: "150406104185",
              appId: "1:150406104185:web:8ee667482a917fd4e7c0a8",
              measurementId: "G-GFMQGWJ0KF"
            };
window.GASurl = 'https://script.google.com/macros/s/AKfycby4BOqh8iM729l6z2XiVkQag4YPa23yghQ4KanfQGjHS6uIOOep5p6RU0hM4vDaHGI97w/exec';
////////////////////////////////////////////////////
/////////////////////////////////////////////////////
window.token = localStorage.getItem('token') || false;
let turnON = document.querySelector('.turnONN');
let info   = document.querySelector('#plase');
// for fcm msg opened window
let massaging = document.getElementById('massaging'); 
let mDec = document.getElementById('mDec'); 
let mAcc = document.getElementById('mAcc'); 

// for init new user  or update it 
window.setupUser = (action )=>{ 
      var x= JSON.stringify([window.NAME , window.ID , window.token ])
       //console.log(x)
        fetch( window.GASurl+`?y=${action}&x=${x}`)
            .then(response => response.json())
            .then(data => {console.log(data);data.status=='false'?localStorage.setItem('token',false):true;})
            .catch(err => {
            console.log(err);
          });
  }

//////////////////////////////


 async function initSW(){
     if(!'serviceWorker' in navigator || !window.navigator.onLine) return;
 try{ 
        await navigator.serviceWorker.register('sw.js');
        const re   = await navigator.serviceWorker.ready;    
           window.sw = re; 

        const setup = async ()=>{
          try{
             var data= await fetch('/check-cache');
              if(!data.ok) return await re.update();

                  var test = await data.json();
                  if( test.missing ) {
                    console.log(missing); 
                    return await re.update();
                   }

                notifINIT();
            }catch(e){
              return await re.update();
            }
          }

        if(navigator.serviceWorker.controller){
           setup()
        }else{
            navigator.serviceWorker.addEventListener('controllerchange', setup )  ;     
        }
    

  }catch(e){ console.log(e) }
                
}

 async function notif(){
         let sw = await navigator.serviceWorker.ready;
       //  console.log(sw)
           firebase.initializeApp(fbConfig);
       
      const messaging = firebase.messaging();
           // Replace with your Public VAPID key from Step 1
      const publicVapidKey = 'BFjb5Hz9DHFRIWslwn0FJ89P_y-zNE2jHU4sc_wK79g6YulvSkEAjPfJmRidZiqlgxgxzD9VisP9ygQKo5wIPd4';
          
          messaging.getToken({
            vapidKey: publicVapidKey,
            serviceWorkerRegistration: sw ,
          }).then((currentToken) => {

             if(window.token && window.token == currentToken) return;
              localStorage.setItem('token',currentToken);
              window.token = currentToken;
            //   console.log(window.token)
              window.setupUser('update');
            })
          .catch((err) => {
            console.error(err); // this.FUNrun=true; // this.FUNname= this.notef;
            });
 

      // Handle foreground messages (app open)
       messaging.onMessage((payload) => {
         let roomTime = JSON.parse(payload.data.roomTime);
         let date = new Date();
          if(roomTime.time.H - date.getHours()>-1&& roomTime.time.M - date.getMinutes()> -2){
             let room = roomTime.room;
                 console.log(room)
              massaging.style.display = 'flex';
              mDec.addEventListener('click', ()=>{ massaging.style.display = 'none'; });
              mAcc.addEventListener('click', ()=>{ 
                  window.openNOT(room);
                  massaging.style.display = 'none';
                })
              
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





document.addEventListener('focus',()=>{
    if(window.sw){
      console.log('focused')
       window.sw.update();
       notifINIT();
    }
})







///////////////////////////////////// install prompt/////////////////////////////////////











////////////////////////////////////////////////////////////////
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














//  async function initSW(){
//         if(!window.navigator.onLine) return;
//         const re = await navigator.serviceWorker.getRegistration();
//         if(re ){ 
//              let sw   = await navigator.serviceWorker.ready;
//             if(!navigator.serviceWorker.controller) return setTimeout(()=>{initSW()},5000);

//            var data= await fetch('/check-cache');
//            var test = await data.json();
//                if( test.missing ) {
//                   await re.unregister(); window.location.reload();
//                }else{ 
//                   window.sw =  sw;
//                   notifINIT();
//                 }
//         }else{
//               if('serviceWorker' in navigator){ 
//                  navigator.serviceWorker.register('sw.js').then(registration=>{
//                  window.sw = registration; 
//                  notifINIT()
//                   }).catch(e=>{console.log(e)});
//                }
//           }
// }
