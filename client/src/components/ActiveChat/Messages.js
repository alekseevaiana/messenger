import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { last } from "cheerio/lib/api/traversing";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const lastMessageId = React.useMemo(
    () =>
      messages.reduce((prev, current) =>
        new Date(prev.createdAt) > new Date(current.createdAt)
          ? prev.id
          : current.id
      ),
    [messages]
  );

  return (
    <Box>
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
