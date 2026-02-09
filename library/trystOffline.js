export const createRoom = (onPeerJoin) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  const channel = pc.createDataChannel('game-data');
  channel.onmessage = (e) => window.onMessage(JSON.parse(e.data));
  channel.onopen = () => onPeerJoin();

  pc.ondatachannel = (e) => {
    const remoteChannel = e.channel;
    remoteChannel.onmessage = (msg) => window.onMessage(JSON.parse(msg.data));
    window.sendData = (data) => remoteChannel.send(JSON.stringify(data));
  };

  return {
    // Return the RAW localDescription so we can compress it
    makeOffer: async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      return pc.localDescription; 
    },
    acceptOffer: async (offerObj) => {
      await pc.setRemoteDescription(offerObj);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      return pc.localDescription;
    },
    finishHandshake: async (answerObj) => {
      await pc.setRemoteDescription(answerObj);
    }
  };
};