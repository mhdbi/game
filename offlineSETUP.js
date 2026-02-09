import { createRoom } from './library/trystOffline.js';
const status = document.getElementById('status');
const video = document.getElementById('video');
const qrCanvas = document.getElementById('qr-gen');

const room = createRoom(() => {
    status.innerText = "CONNECTED!";
    if (video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
});

// --- COMPRESSION (Crucial for QR readability) ---
const compress = (desc) => {
    const skinny = {
        t: desc.type,
        s: desc.sdp.split('\r\n').filter(line => 
            !line.startsWith('a=extmap') && 
            !line.startsWith('a=rtcp-fb') && 
            !line.startsWith('a=fmtp')
        ).join('\n')
    };
    return btoa(JSON.stringify(skinny));
};

const decompress = (str) => {
    const data = JSON.parse(atob(str));
    return {
        type: data.t,
        sdp: data.s.split('\n').join('\r\n')
    };
};

// --- HOST ---
document.getElementById('btnHost').onclick = async () => {
    window.isHost = true;
    status.innerText = "Generating... Wait 2s";
    
    await room.makeOffer();
    await new Promise(r => setTimeout(r, 2000)); // Wait for ICE gathering
    
    // We need to get the updated localDescription from the room 
    // Since it's private in your lib, make sure makeOffer returns pc.localDescription
    const offer = await room.makeOffer(); 
    
    qrCanvas.innerHTML = "";
    new QRCode(qrCanvas, {
        text: compress(offer),
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.L // Lower level = bigger pixels = easier scan
    });
    qrCanvas.style.display = 'block';
    status.innerText = "Offer Ready! Scan me.";
};

// --- SCANNER ---
document.getElementById('btnScan').onclick = () => {
    video.style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(tick);
    });
};


// Add these to the top-level of your script (outside any functions)
const canvasElement = document.createElement('canvas');
const canvas = canvasElement.getContext("2d", { willReadFrequently: true });
function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
            handleScannedCode(code.data);
            return;
        }
    }
    requestAnimationFrame(tick);
}

// --- HANDSHAKE ---
async function handleScannedCode(data) {
    try {
        const remoteDesc = decompress(data);
        
        if (!window.isHost) {
            status.innerText = "Offer Scanned. Generating Answer...";
            await room.acceptOffer(remoteDesc);
            await new Promise(r => setTimeout(r, 2000));
            
            const answer = await room.acceptOffer(remoteDesc); // Get updated answer with ICE
            
            qrCanvas.innerHTML = "";
            new QRCode(qrCanvas, {
                text: compress(answer),
                width: 256,
                height: 256,
                correctLevel: QRCode.CorrectLevel.L
            });
            video.style.display = 'none';
            qrCanvas.style.display = 'block';
            status.innerText = "Show this Answer to Host.";
        } else {
            await room.finishHandshake(remoteDesc);
            status.innerText = "Connecting...";
        }
    } catch (e) {
        requestAnimationFrame(tick);
    }
}