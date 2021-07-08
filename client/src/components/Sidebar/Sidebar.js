import React, { useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
}));

function getLast(arr) {
  return arr[arr.length - 1];
}

function compareConversations(conv1, conv2) {
  const message1 = getLast(conv1.messages);
  const message2 = getLast(conv2.messages);

  const d1 = new Date(message1.createdAt);
  const d2 = new Date(message2.createdAt);

  return d2 - d1;
}

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conversation) =>
        conversation.otherUser.username.includes(searchTerm)
      )
      .sort(compareConversations);
  }, [conversations]);

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {filteredConversations.map((conversation) => {
        return (
          <Chat
            conversation={conversation}
            key={conversation.otherUser.username}
          />
        );
      })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
  };
};

export default connect(mapStateToProps)(Sidebar);
