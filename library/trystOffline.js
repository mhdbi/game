export const createRoom = (onPeerJoin) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Basic help for finding local IPs
  });

  const channel = pc.createDataChannel('game-data');
 
  // Handle incoming data
  channel.onmessage = (e) => window.onMessage(JSON.parse(e.data));
  channel.onopen = () => onPeerJoin();

  // Handle incoming peers (for the joiner)
  pc.ondatachannel = (e) => {
    const remoteChannel = e.channel;
    remoteChannel.onmessage = (msg) => window.onMessage(JSON.parse(msg.data));
    window.sendData = (data) => remoteChannel.send(JSON.stringify(data));
  };

  window.sendData = (data) => channel.send(JSON.stringify(data));

  return {
    // 1. Host creates this
    makeOffer: async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      return btoa(JSON.stringify(pc.localDescription)); // Encode to small string
    },
    // 2. Joiner accepts offer and makes answer
    acceptOffer: async (offerStr) => {
      const offer = JSON.parse(atob(offerStr));
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      return btoa(JSON.stringify(pc.localDescription));
    },
    // 3. Host finishes the link
    finishHandshake: async (answerStr) => {
      const answer = JSON.parse(atob(answerStr));
      await pc.setRemoteDescription(answer);
    }
  };
};

























  // import { createRoom } from './network.js';

  // const room = createRoom(() => {
  //   console.log("Connected! You can now move your 3D meshes.");
  // });

  // // Receive data from the other phone
  // window.onMessage = (data) => {
  //   if (data.type === 'move') {
  //     opponentMesh.position.set(data.x, data.y, data.z);
  //   }
  // };

  // // --- BUTTON LOGIC ---
 
  // // Player 1 (Host) clicks this:
  // async function startHosting() {
  //   const offer = await room.makeOffer();
  //   console.log("Show this QR Code:", offer);
  //   // Use qrcode.js to show 'offer'
  // }

  // // Player 2 (Joiner) clicks this after scanning:
  // async function joinGame(scannedOffer) {
  //   const answer = await room.acceptOffer(scannedOffer);
  //   console.log("Show this Answer QR back to Host:", answer);
  // }

  // // Player 1 (Host) scans the answer:
  // async function finalize(scannedAnswer) {
  //   await room.finishHandshake(scannedAnswer);
  // }














  