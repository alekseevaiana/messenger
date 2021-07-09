import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  messagesContainer: {
    height: "70vh",
    overflow: "auto",
  },
  messageBubble: {
    marginBottom: "10px",
  },
}));

function getLastReadMessageId(messages) {
  const readMessages = messages.filter((message) => message.read);
  console.log(readMessages);
  if (readMessages.length > 0) {
    console.log("READ MESSAGES HERE");
    return readMessages.reduce((prev, current) =>
      new Date(prev.createdAt) > new Date(current.createdAt)
        ? prev.id
        : current.id
    );
  } else {
    return null;
  }
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
