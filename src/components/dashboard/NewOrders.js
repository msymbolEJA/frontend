import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  icon: {
    fontSize: 50,
  },
}));

export default function NewOrders() {
  const classes = useStyles();

  const handleClick = () => {
    console.log("New Orders");
  };

  return (
    <Grid item xs={12} md={12} onClick={handleClick}>
      <Paper className={classes.paper}>
        <AddCircleIcon className={classes.icon} color="primary" />
        <h1>New Order</h1>
      </Paper>
    </Grid>
  );
}
