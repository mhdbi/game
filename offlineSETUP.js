import { createRoom } from './library/trystOffline.js';

const status = document.getElementById('status');
const video = document.getElementById('video');
const qrCanvas = document.getElementById('qr-gen');

// Initialize the room
const room = createRoom(() => {
    status.innerText = "CONNECTED!";
    // Stop camera once connected
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    qrCanvas.style.display = 'none';
});

// --- HELPERS ---
const compressSDP = (sdp) => {
    if (!sdp || typeof sdp !== 'string') return "";
    return sdp
        .split('\r\n')
        .filter(line => !line.startsWith('a=extmap') && !line.startsWith('a=rtcp-fb') && !line.startsWith('a=fmtp'))
        .join('\n');
};

const decompressSDP = (sdp) => {
    if (!sdp || typeof sdp !== 'string') return "";
    return sdp.split('\n').join('\r\n');
};

// --- HOST LOGIC ---
document.getElementById('btnHost').onclick = async () => {
    window.isHost = true;
    qrCanvas.style.display = 'flex';
    video.style.display = 'none';
    status.innerText = "Generating Offer... (Wait 2s)";

    try {
        // 1. Start making offer
        const offer = await room.makeOffer();
        
        // 2. Wait for internal ICE gathering
        await new Promise(r => setTimeout(r, 2000));

        // 3. Prepare data (using offer object returned by your lib)
        const skinnyOffer = { 
            s: compressSDP(offer.sdp || offer.s), 
            t: offer.type || offer.t 
        };

        qrCanvas.innerHTML = ""; 
        new QRCode(qrCanvas, {
            text: btoa(JSON.stringify(skinnyOffer)),
            width: 256,
            height: 256,
            correctLevel: QRCode.CorrectLevel.M
        });
        status.innerText = "Offer Ready! Scan this on the Joiner device.";
    } catch (err) {
        console.error("Host Error:", err);
        status.innerText = "Failed to create offer.";
    }
};

// --- SCANNER SETUP ---
document.getElementById('btnScan').onclick = () => {
    qrCanvas.style.display = 'none';
    video.style.display = 'flex';

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
        video.srcObject = stream;
        video.setAttribute("playsinline", 'true');
        video.play();
        requestAnimationFrame(tick);
    }).catch(e => {
        alert('Camera failed: ' + e.name);
    });
};

const canvasElement = document.createElement('canvas');
const canvas = canvasElement.getContext("2d", { willReadFrequently: true });

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

        if (code && code.data) {
            handleScannedCode(code.data);
            return; // Stop scan loop
        }
    }
    requestAnimationFrame(tick);
}

// --- HANDSHAKE LOGIC ---
async function handleScannedCode(data) {
    try {
        const decodedString = atob(data.replace(/\s/g, ''));
        const packet = JSON.parse(decodedString);
        
        if (!packet.s) return; // Ignore empty scans

        if (!window.isHost) {
            // I am the JOINER
            status.innerText = "Offer Scanned. Generating Answer...";
            
            const fullOffer = { sdp: decompressSDP(packet.s), type: packet.t };
            const answer = await room.acceptOffer(fullOffer);

            // Wait for internal ICE gathering (since pc is hidden)
            await new Promise(r => setTimeout(r, 2000));

            const skinnyAnswer = { 
                s: compressSDP(answer.sdp || answer.s), 
                t: answer.type || answer.t 
            };

            qrCanvas.innerHTML = "";
            qrCanvas.style.display = 'flex';
            video.style.display = 'none';

            new QRCode(qrCanvas, {
                text: btoa(JSON.stringify(skinnyAnswer)),
                width: 256,
                height: 256,
                correctLevel: QRCode.CorrectLevel.M
            });
            status.innerText = "Answer Ready! Show this to the Host.";
        } else {
            // I am the HOST
            status.innerText = "Answer Scanned. Connecting...";
            const fullAnswer = { sdp: decompressSDP(packet.s), type: packet.t };
            await room.finishHandshake(fullAnswer);
        }
    } catch (e) {
        console.warn("Invalid QR frame, retrying...");
        requestAnimationFrame(tick); // Keep scanning if data was partial
    }
}