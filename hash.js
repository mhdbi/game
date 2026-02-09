//
 window.onload = () => {   window.location.href=window.location.origin+window.location.pathname+'#/'  };
 console.log(window.location.href)
window.addEventListener('hashchange', router);


async function router(){

  let path= window.location.hash.slice(1) || '/';

  if(path=='/offline'){

    openOffline()

  }else if(path=='/'){
       let e = document.getElementById('offlinePAGE');
        if(e){ 
          e.getElementById('video').srcObject.getTracks().forEach(track => track.stop()); 
          e.remove(); 
        }
       
  }


}

/////////////////////////////////////////////////////////////////////////////////////
let html = `
            <div id="offlinePage">
                    <video  id="video" hidden playsinline muted></video>
                    <div id="qr-gen"></div>

                    <div id="ui">
                         <p id="status">Status: Waiting...</p>
                        <button id="btnHost" class="offlinee">1. Host (Show QR)</button>
                        <button id="btnScan" class="offlinee">2. Scan (Camera)</button>
                        <a   id="offlineX" href='#/'> رجوع </a>
                    </div>
             </div>
`;



function openOffline() {
    let div = document.createElement('div');
    div.id = 'offlinePAGE';
    div.innerHTML = html; // Put only the HTML (video, canvas, buttons) here
    document.body.appendChild(div);

    // Now, manually load the scripts so they actually run
    const scripts = [ './library/QRscan.js',  './library/jsQR.js'];

    scripts.forEach(src => {
        let script = document.createElement('script');
        script.src = src;
      //  script.async = false; // Ensures they load in order
        document.body.appendChild(script);
    });

    // For your module script
    let moduleScript = document.createElement('script');
        moduleScript.type = 'module';
        moduleScript.src = './offlineSETUP.js';
        document.body.appendChild(moduleScript);
}