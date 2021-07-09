import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { clearSearchedUsers } from "../../store/conversations";

const useStyles = makeStyles(() => ({
  messagesContainer: {
    height: "70vh",
    overflow: "auto",
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;
  const lastMessageId = useMemo(
    () =>
      messages.reduce((prev, current) =>
        new Date(prev.createdAt) > new Date(current.createdAt)
          ? prev.id
          : current.id
      ),
    [messages]
  );

  return (
    <Box className={classes.messagesContainer}>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        const lastMessage = message.id === lastMessageId;
        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            unread={!message.read}
            lastMessage={lastMessage}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
