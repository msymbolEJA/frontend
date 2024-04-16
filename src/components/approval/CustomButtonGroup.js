import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  container: {
    // maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
  },
  btn: {
    margin: theme.spacing(0.5),
  },
  btnGroup: {
    marginBottom: theme.spacing(1),
  },
  header: {
    fontSize: "1.5rem",
  },
}));

const CustomButtonGroup = ({ selectedTag, handleTagChange, tagsData, searchHandler, loading }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const myInputRef = useRef(null);
  const mobileView = useMediaQuery("(max-width:1024px)");

  return (
    <div>
      <div
        className={classes.btnGroup}
        style={{
          marginTop: mobileView ? "3rem" : "1rem",
        }}
      >
        {tagsData.map(tag => (
          <Button
            className={classes.btn}
            id={tag}
            key={tag}
            checked={selectedTag?.indexOf(tag) > -1}
            disabled={loading || selectedTag === tag}
            onClick={e => handleTagChange(e)}
            variant="contained"
            style={{
              backgroundColor: selectedTag === tag ? "#3F51B5" : null,
              color: selectedTag === tag ? "white" : null,
            }}
          >
            <FormattedMessage
              id={tag?.replace("_", " ") === "awaiting" ? "approved" : tag?.replace("_", " ")}
              defaultMessage={
                tag?.replace("_", " ") === "awaiting" ? "APPROVED" : tag?.replace("_", " ")
              }
            />
          </Button>
        ))}
      </div>
      <div>
        <Button
          className={classes.btn}
          id="all_orders"
          key="all_orders"
          onClick={e => handleTagChange(e)}
          checked={selectedTag === "all_orders"}
          disabled={loading || selectedTag === "all_orders"}
          variant="contained"
          style={{
            backgroundColor: selectedTag === "all_orders" ? "#3F51B5" : null,
            color: selectedTag === "all_orders" ? "white" : null,
          }}
        >
          <FormattedMessage id="all_orders" defaultMessage="ALL ORDERS" />
        </Button>
        <Button
          className={classes.btn}
          id="repeat"
          key="repeat"
          onClick={e => handleTagChange(e)}
          checked={selectedTag === "repeat"}
          disabled={loading || selectedTag === "repeat"}
          variant="contained"
          style={{
            backgroundColor: selectedTag === "repeat" ? "#3F51B5" : null,
            color: selectedTag === "repeat" ? "white" : null,
          }}
        >
          <FormattedMessage id="repeat" defaultMessage="REPEAT" />
        </Button>
      </div>
    </div>
  );
};

export default CustomButtonGroup;
