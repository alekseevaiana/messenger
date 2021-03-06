import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: "10px",
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold",
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px",
    marginBottom: "5px",
  },
  userPicture: {
    width: "20px",
    height: "19.35px",
  },
}));

const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text, otherUser, unread, lastReadMessage } = props;

  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      {!unread && lastReadMessage && (
        <Box>
          <Avatar
            src={otherUser.photoUrl}
            alt={otherUser.username}
            className={classes.userPicture}
          />
        </Box>
      )}
    </Box>
  );
};

export default SenderBubble;
