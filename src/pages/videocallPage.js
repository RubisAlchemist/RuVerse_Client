import React, { useState, useEffect, useRef, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AC from 'agora-chat';
import EyetrackingContext from "./eyetrackingContext";
import "./VideocallPage.css";

export default function VideocallPage() {
  const { gazeData, isWebgazerInitialized } = useContext(EyetrackingContext);

  // Style for displaying gaze circle based on eye-tracking data
  const gazeCircleStyle = {
    position: "fixed",
    left: `${gazeData.x}px`,
    top: `${gazeData.y}px`,
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "red",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
  };

  // Refs for Agora RTC and Chat clients
  const client = useRef(null);
  const [messages, setMessages] = useState([]);  // State to manage chat messages
  const [chatClient, setChatClient] = useState(null);  // State to manage Chat SDK client
  const [textMessage, setTextMessage] = useState("");  // State to hold the text message being typed
  const [channelName, setChannelName] = useState("");  // State to manage the channel name
  const [uid, setUid] = useState("");  // State to manage the user ID
  const [joinState, setJoinState] = useState(false);  // State to manage the join state
  const [localVideoTrack, setLocalVideoTrack] = useState(null);  // State to manage local video track
  const [localAudioTrack, setLocalAudioTrack] = useState(null);  // State to manage local audio track
  const [participants, setParticipants] = useState([]);  // State to manage participants in the call

  // .env
  const appId = process.env.REACT_APP_AGORA_RTC_APP_ID_KEY;
  const chatAppId = process.env.REACT_APP_AGORA_RTC_CHATAPP_ID_KEY;

  // useEffect hook to handle component initialization and cleanup
  useEffect(() => {
    // Chat SDK client initialization
    const initializeChatClient = () => {
      const chatClient = new AC.connection({
        appKey: chatAppId,
      });
      setChatClient(chatClient);

      return () => {
      };
    };

    // Initialization of Webgazer before setting up Agora RTC and Chat clients
    if (isWebgazerInitialized) {
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      subscribeToEvents();  // Function to subscribe to Agora RTC events
      initializeChatClient();  // Initialize Chat SDK client
      return () => {
        if (localVideoTrack) {
          localVideoTrack.close();
        }
        if (localAudioTrack) {
          localAudioTrack.close();
        }
        client.current && client.current.leave();
      };
    }
  }, [isWebgazerInitialized, chatAppId]);

  // Subscribe to Chat SDK events
  const subscribeToChatEvents = (chatClient) => {
    chatClient.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  };

  // Login to Chat and subscribe to chat events
  const loginAndSubscribeToChat = async () => {
    const options = {
      user: 'userID',
      agoraToken: 'agoraToken',
    };

    try {
      await chatClient.open(options);
      console.log("Chat login successful");
      subscribeToChatEvents(chatClient);
    } catch (err) {
      console.error("Chat login failed", err);
    }
  };

  // useEffect hook to handle Chat login and subscription
  useEffect(() => {
    loginAndSubscribeToChat();

    return () => {
      handleLeave();
    };
  }, [chatAppId]);

  // Handle sending a text message in the chat
  const handleSendMessage = () => {
    if (textMessage.trim() !== "") {
      const option = {
        chatType: 'singleChat',
        type: 'txt',
        to: 'userID',
        msg: textMessage,
      };
      const msg = AC.message.create(option);
      chatClient.send(msg)
        .then(() => {
          setTextMessage("");
        })
        .catch(err => console.error("Send message failed", err));
    }
  };

  // Subscribe to Agora RTC events
  const subscribeToEvents = () => {
    // Event handler for when a user is published (joins the call)
    client.current.on("user-published", async (user, mediaType) => {
      await client.current.subscribe(user, mediaType);
      if (mediaType === "video") {
        setParticipants((prevParticipants) => [...prevParticipants, user]);
        const videoTrack = user.videoTrack;
        const playerContainer = document.createElement("div");
        playerContainer.id = `user-container-${user.uid}`;
        playerContainer.style.width = "320px";
        playerContainer.style.height = "240px";
        document.getElementById("remote-container").append(playerContainer);
        videoTrack.play(playerContainer);
      }
      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    });

    // Event handler for when a user is unpublished (leaves the call)
    const handleUserChange = (user, action) => {
      setParticipants((prevParticipants) => {
        if (action === "add") {
          return [...prevParticipants, user];
        } else if (action === "remove") {
          return prevParticipants.filter((participant) => participant.uid !== user.uid);
        }
        return prevParticipants;
      });
    };

    // Handle events for user-unpublished and user-left events
    client.current.on("user-unpublished", (user, mediaType) => {
      handleUserChange(user, "remove");
    });

    client.current.on("user-left", (user) => {
      handleUserChange(user, "remove");
    });
  };

  // Handle joining the video call
  const handleJoin = async () => {
    if (!client.current) return;

    try {
      await client.current.join(appId, channelName, null, uid || null);
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.current.publish([videoTrack, audioTrack]);
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);
      setJoinState(true);
      setParticipants((prevParticipants) => [...prevParticipants, { uid: "local", videoTrack }]);
    } catch (error) {
      console.error("Error joining channel", error);
    }
  };

  // Handle leaving the video call
  const handleLeave = async () => {
    if (client.current) {
      try {
        cleanupTracks();
        await client.current.leave();
      } catch (error) {
        console.error("Error leaving channel", error);
      } finally {
        setJoinState(false);
        setParticipants([]);
      }
    }
  };

  // Cleanup local video and audio tracks
  const cleanupTracks = () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    setLocalVideoTrack(null);
    setLocalAudioTrack(null);
  };

  // Render video elements for participants
  const renderVideo = (user) => {
    const id = user.uid === "local" ? "local-player" : `user-container-${user.uid}`;
    const videoTrack = user.videoTrack;
    setTimeout(() => {
      videoTrack.play(id);
    }, 0);
    return <div key={id} id={id} className="video-container"></div>;
  };

  // JSX for the VideocallPage component
  return (
    <div className="videocall-page">
      <div>
        <label>Enter Channel Name:</label>
        <input
          type="text"
          placeholder="Enter the channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
      </div>
      <div>
        <label>Enter User ID (Optional):</label>
        <input
          type="text"
          placeholder="Enter the user ID (optional)"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />
      </div>
      <button onClick={handleJoin} disabled={joinState}>
        Join
      </button>
      <button onClick={handleLeave} disabled={!joinState}>
        Leave
      </button>
      <div className="video-grid" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {participants.map((user) => renderVideo(user))}
      </div>
      <div className="chat-section">
        <div className="messages">
          {messages.map((msg, index) => (
            <p key={index}>{msg.text}</p> 
          ))}
        </div>
        <input
          type="text"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}