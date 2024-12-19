# Duet Karaoke Feature

This document outlines the architecture and implementation plan for a **Duet Karaoke Feature**, allowing two users to sing together in real-time.

---

## **Overview**

The duet karaoke feature enables real-time audio synchronization between two singers. Users can sing along to a shared background track while their audio is captured, mixed, and played back in perfect sync.

---

## **Key Requirements**

1. **Real-time Audio Synchronization**:
   - Ensure both singers hear the combined output in sync.
2. **Backend Integration**:
   - Exchange audio streams and synchronization metadata between clients and the server.
3. **Challenges and Solutions**:
   - Address latency, echo, and bandwidth constraints.

---

## **Architecture**

### **Flow of Data Between App and Backend**

1. **Signaling**:
   - Establish a WebRTC peer-to-peer connection via a signaling server (e.g., **Socket.IO**).
   - Exchange session descriptions (SDPs) and ICE candidates.

2. **Audio Streams**:
   - Clients send their audio streams to a media server.
   - The server mixes the streams in real-time.

3. **Combined Output**:
   - The mixed audio is sent back to both clients for playback.

4. **Metadata**:
   - Synchronization markers (e.g., timestamps) ensure playback alignment on both devices.

---

### **Sequence Diagram**

```plaintext
Client A            Signaling Server           Media Server           Client B
   |                        |                        |                   |
1. Start Session ---------->|                        |                   |
2. Exchange SDPs and ICE    |                        |                   |
   Candidates (via WebRTC)  |                        |                   |
   |------------------------|                        |                   |
3. Send Audio Stream -------------------------------->                   |
   |                                                 |                   |
   |<------------------------- Combined Audio Stream --------------------|
   |                                                 |                   |
4. Receive and Play Audio                                                 |
```

---

## **Key Tools and Libraries**

### **Frontend (App)**
- **WebRTC**: For peer-to-peer audio streaming.
- **Tone.js**: For audio effects and client-side mixing (if needed).
- **React Native Sound**: For background music playback.

### **Backend**
- **Kurento Media Server**: For real-time audio mixing.
- **Janus Gateway**: Lightweight WebRTC server with audio mixing capabilities.
- **Node.js** with **Socket.IO**: For signaling and session management.

---

## **Challenges and Solutions**

### **1. Latency**
- **Problem**: Network delays can cause audio streams to be out of sync.
- **Solution**:
  - Use **RTP (Real-Time Protocol)** with WebRTC for low-latency transmission.
  - Implement buffering and timestamps to align streams on the client side.

### **2. Echo**
- **Problem**: The microphone may pick up the speaker output, creating an echo.
- **Solution**:
  - Enable **echo cancellation** and **noise suppression** in WebRTC.
  - Use high-quality headsets or earbuds.

### **3. Bandwidth Management**
- **Problem**: High-quality audio streams may exceed bandwidth limits.
- **Solution**:
  - Use **adaptive bitrate streaming** in WebRTC to adjust quality based on network conditions.
  - Compress audio using efficient codecs like **Opus**.

### **4. Audio Mixing**
- **Problem**: Combining multiple audio streams in real-time without distortion.
- **Solution**:
  - Use a media server like **Kurento** or **Janus** for audio mixing.
  - Alternatively, perform client-side mixing using libraries like **Tone.js**.

---

## **Implementation Steps**

### **1. Establish WebRTC Connection**
- Use a signaling server to exchange SDP and ICE candidates between clients.
- Establish a peer-to-peer WebRTC connection for audio streaming.

### **2. Audio Capture and Streaming**
- Capture audio from the device microphone using WebRTC APIs.
- Stream audio to the media server for mixing.

### **3. Audio Mixing**
- Mix the audio streams from both clients on the media server (or optionally on the client side).
- Apply effects like pitch correction or reverb if needed.

### **4. Combined Output and Playback**
- Send the mixed audio back to both clients.
- Use synchronization markers (e.g., timestamps) to ensure playback is aligned.

---

## **Summary**

1. **Data Flow**:
   - Real-time audio streams flow from clients to the media server and back.
   - Metadata ensures synchronization.

2. **Tools**:
   - WebRTC, Kurento/Janus, and Socket.IO for real-time collaboration.

3. **Challenges**:
   - Latency, echo, and bandwidth are mitigated with advanced codecs, echo cancellation, and adaptive streaming.

4. **Scalability**:
   - Use media servers like **Kurento** or **Janus** to handle large-scale duet sessions efficiently.

This architecture ensures seamless real-time audio synchronization, providing an engaging duet karaoke experience.
