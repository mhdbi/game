
import { createRoom } from './library/trystOffline.js'; // The code I gave you in the last step

const status = document.getElementById('status');
const video = document.getElementById('video');
const qrCanvas = document.getElementById('qr-gen');


const room = createRoom(() => {
    status.innerText = "CONNECTED!";
    video.srcObject.getTracks().forEach(track => track.stop()); // Turn off camera
});


// --- GENERATING THE QR (HOST) ---
document.getElementById('btnHost').onclick = async () => {
    window.isHost = true;
    qrCanvas.style.display = 'flex';
    video.style.display = 'none';
    if(qrCanvas.title) return;
    //////////////////////////
    const offer = await room.makeOffer();
    const skinnyOffer =  {  s: offer.sdp  ,   t: offer.type  }
    const encode = btoa(JSON.stringify(skinnyOffer));

     new QRCode(qrCanvas, {
        text : encode ,
        width: 256,
        height:256,
        colorDark : '#000000',
        colorLight: '#ffffff',
        correctLevel :QRCode.CorrectLevel.L
    });
    
};


// --- SCANNING THE QR (JOINER/HOST) ---
document.getElementById('btnScan').onclick = () => {
    qrCanvas.style.display = 'none';
    video.style.display    = 'flex';

    navigator.mediaDevices.getUserMedia({ video: { facingMode: {ideal:"environment"} } }).then(stream => {
        video.srcObject = stream;
        video.setAttribute("playsinline", 'true');
        video.hidden = false;
        video.muted = true;
        video.play();
        requestAnimationFrame(tick);
    }).catch(e=>{
        alert('camera fialed'+ e.name);
    })
};


// Get the canvas once, outside the tick function
const canvasElement = document.createElement('canvas');
const canvas = canvasElement.getContext("2d", { willReadFrequently: true });

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set dimensions only if they changed
        if (canvasElement.height !== video.videoHeight) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
        }
        // Draw the current video frame to the canvas
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        // Get the image data to scan
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        // Scan the data
        const code = jsQR(imageData.data, imageData.width, imageData.height, {  inversionAttempts: "dontInvert", });

        if (code && code.data) {
            console.log("Found code:", code.data);
            handleScannedCode(code.data);
            return; // Stop scanning once found
        }
    }
    requestAnimationFrame(tick);
}

async function handleScannedCode(data) {
    if (!window.isHost) {
        // I am the joiner, I just scanned your code
         const decode = JSON.parse(atob(data))  
         const fullOffer = { sdp: decode.s , type: decode.t };
         const answer = await room.acceptOffer(fullOffer);
         ///
         const skinnyOffer =  {  s: answer.sdp  ,   t: answer.type  }
         const encode = btoa(JSON.stringify(skinnyOffer));

            new QRCode(qrCanvas, {      // Show answer QR to host
                            text : encode,
                            width: 256,
                            height:256,
                            colorDark : '#000000',
                            colorLight: '#ffffff',
                            correctLevel :QRCode.CorrectLevel.L
                        });
        status.innerText = "Scanned! Now show your Answer QR to Host.";
    } else {
        // I am the host, I just scanned the Joiner's answer
        const decode = JSON.parse(atob(data))  
        const fullOffer = { sdp: decode.s , type: decode.t };
        await room.finishHandshake(fullOffer);
        status.innerText = "Finalizing Connection...";
    }
}







