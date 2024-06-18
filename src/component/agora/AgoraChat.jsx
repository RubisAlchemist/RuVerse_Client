import { Box, TextField, Typography } from "@mui/material";

import React, { useEffect, useMemo, useState } from "react";
import AC from "agora-chat";

const chatAppId = process.env.REACT_APP_AGORA_CHAT_APP_ID_KEY;

const AgoraChat = ({ config }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const conn = useMemo(
    () => new AC.connection({ appKey: chatAppId }),
    [config]
  );

  useEffect(() => {
    conn &&
      conn
        .open({
          user: config.uid,
          accessToken:
            "007eJxTYNBc/b12NmOcruTp2OqvXP3yZ8QyHzu9C22XjRMt8brz/6QCg5llSlJimmGqQXKqkYmZsWViUrKRiUVSmqVhqmWqpalh6V6jNAE+BobUKCVGRgZWBkYgBPFVGFIMk03SDE0MdA3M01J0DQ1T03STDA0sdc0N01LMktNME80TkwDenyV5",
        })
        .then();
  }, [config.uid]);

  const handleSendMessage = () => {
    let option = {
      chatType: "chatRoom",
      type: "txt",
      to: "userID",
      msg: message,
    };
    let msg = AC.message.create(option);
    conn
      .send(msg)
      .then(() => {
        console.log(`send private text Success ${msg}`);
      })
      .catch((e) => {
        console.log(e);
        console.log("Send private text error");
      });
  };

  // const messages = [
  //   { name: "me", message: "world" },
  //   { name: "you", message: "world2" },
  //   { name: "you", message: "world2" },
  //   { name: "you", message: "world2" },
  //   { name: "you", message: "world2" },
  //   { name: "you", message: "world2" },
  //   { name: "you", message: "world2" },
  //   { name: "you", message: "world2" },
  // ];

  return (
    <Box display="flex" height="100%" flexDirection="column">
      <Box
        display="flex"
        height="100%"
        flexDirection="column"
        sx={{
          overflowX: "hidden",
          overflowY: "scroll",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "lightgray",
        }}
      >
        {messages.map((data, index) => (
          <Box key={index} display="flex" padding={1}>
            <Typography
              marginRight={1}
              fontWeight="bold"
            >{`[임시]`}</Typography>
            <Typography fontWeight={4}>{data}</Typography>
          </Box>
        ))}
      </Box>
      <TextField
        fullWidth
        multiline
        onChange={(e) => setMessage(e.target.value)}
        placeholder="chat hear"
        minRows={2}
        maxRows={2}
      />
    </Box>
  );
};

export default AgoraChat;
