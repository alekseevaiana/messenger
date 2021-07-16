import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  messagesContainer: {
    height: "70vh",
    overflow: "auto",
  },
  messageBubble: {
    marginBottom: theme.spacing(),
  },
}));

function isNewer(date1, date2) {
  return new Date(date1) - new Date(date2) > 0;
}

function getLastReadMessageId(messages) {
  if (messages.length === 0) {
    return null;
  }

  let lastReadMsg = null;

  for (let index = 0; index < messages.length; index++) {
    const msg = messages[index];

    if (msg.read) {
      if (lastReadMsg && isNewer(msg.createdAt, lastReadMsg.createdAt)) {
        lastReadMsg = msg;
      } else {
        lastReadMsg = msg;
      }
    }
  }

  return lastReadMsg?.id;
}

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;
  const lastReadMessageId = useMemo(
    () => getLastReadMessageId(messages),
    [messages]
  );

  return (
    <Box className={classes.messagesContainer}>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        const lastReadMessage = message.id === lastReadMessageId;
        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            unread={!message.read}
            lastReadMessage={lastReadMessage}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            className={classes.messageBubble}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
