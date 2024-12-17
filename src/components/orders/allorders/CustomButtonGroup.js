import React, { useContext, useRef } from "react";
import Button from "@material-ui/core/Button";
import { AppContext } from "../../../context/Context";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { beyazitTagsData, isLabelStore } from "../../../helper/Constants";

const NON_SKU = process.env.REACT_APP_NON_SKU === "true";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
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
    marginTop: "0.8rem",
  },
  btnGroup: {
    // marginBottom: theme.spacing(1),
    marginTop: "1rem",
  },
  header: {
    fontSize: "1.5rem",
  },
  textField: {
    marginTop: "0.6rem",
  },
}));

const CustomButtonGroup = ({
  selectedTag,
  handleTagChange,
  tagsData,
  nonAdminTagsData,
  searchHandler,
  loading,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const myInputRef = useRef(null);
  const mobileView = useMediaQuery("(max-width:1024px)");

  const { isAdmin } = useContext(AppContext);

  console.log("isAdmin", isAdmin);
  const isBeyazit =
    (localStorage.getItem("localRole") === "workshop_manager" ||
      !localStorage.getItem("localRole") ||
      localStorage.getItem("localRole") === "null") &&
    !["asya", "umraniye"].includes(localStorage.getItem("workshop")?.toLowerCase());
  let statusTags = isBeyazit ? beyazitTagsData : isAdmin ? [...tagsData] : [...nonAdminTagsData];

  if (!isBeyazit && isLabelStore && isAdmin && !statusTags.includes("label")) statusTags.splice(3, 0, "label");
  else if (!isBeyazit && isLabelStore && !isAdmin && !statusTags.includes("label"))
    statusTags.splice(2, 0, "label");

  let localRole = localStorage.getItem("localRole");

  if (localRole === "workshop_designer" || localRole === "workshop_designer2") {
    return null;
  }

  return (
    <div
      className={classes.btnGroup}
      style={{
        marginTop: mobileView ? "3rem" : "1rem",
      }}
    >
      {statusTags.map(tag => (
        <Button
          className={classes.btn}
          id={tag}
          key={tag}
          checked={selectedTag?.indexOf(tag) > -1}
          disabled={loading || selectedTag === tag}
          onClick={e => handleTagChange(e)}
          variant="contained"
          style={{
            backgroundColor: selectedTag === tag ? (tag === "label" ? "#eb6223" : "#3F51B5") : null,
            color: selectedTag === tag ? "white" : null,
          }}
        >
          <FormattedMessage
            id={tag?.replace("_", " ") === "awaiting" ? "approved" : tag?.replace("_", " ")}
            defaultMessage={
              tag?.replace("_", " ") === "awaiting" ? "approved" : tag?.replace("_", " ")
            }
          />
        </Button>
      ))}
      {/* {NON_SKU && (
        <Button
          className={classes.btn}
          disabled={loading}
          id="all_orders"
          checked={selectedTag?.indexOf("all_orders") > -1}
          onClick={(e) => {
            handleTagChange(e);
          }}
          variant="contained"
          style={{
            backgroundColor: selectedTag === undefined ? "#3F51B5" : null,
            color: selectedTag === undefined ? "white" : null,
          }}
        >
          <FormattedMessage id={"allorders"} defaultMessage={"All Orders"} />
        </Button>
      )} */}
    </div>
  );
};

export default CustomButtonGroup;
