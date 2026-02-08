
import { createRoom } from '/library/trystOffline.js'; // The code I gave you in the last step

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
    
    const offer = await room.makeOffer();
    // Use qrcode.js library to draw onto our canvas
    if(qrCanvas.title) return;

     new QRCode(qrCanvas, {
        text : offer ,
        width: 256,
        height:256,
        colorDark : '#000000',
        colorLight: '#ffffff',
        correctLevel :QRCode.CorrectLevel.H
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
           // console.log("Found code:", code.data);
            handleScannedCode(code.data);
            return; // Stop scanning once found
        }
    }
    requestAnimationFrame(tick);
}

async function handleScannedCode(data) {
    if (!window.isHost) {
        // I am the joiner, I just scanned the Host's offer
        const answer = await room.acceptOffer(data);

              if(answer && typeof answer === 'string' && answer.length>0){
                console.log(answer)
              }
            new QRCode(qrCanvas, {      // Show answer QR to host
                            text : answer,
                            width: 256,
                            height:256,
                            colorDark : '#000000',
                            colorLight: '#ffffff',
                            correctLevel :QRCode.CorrectLevel.H
                        });
        status.innerText = "Scanned! Now show your Answer QR to Host.";
    } else {
        // I am the host, I just scanned the Joiner's answer
        await room.finishHandshake(data);
        status.innerText = "Finalizing Connection...";
    }
}







