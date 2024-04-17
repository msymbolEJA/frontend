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
import { beyazitTagsData } from "../../../helper/Constants";

const useStyles = makeStyles(theme => ({
  btn: {
    margin: theme.spacing(0.5),
  },
}));

const CustomCountryButtonGroup = ({ selectedTag, handleTagChange, tagsData, loading }) => {
  const classes = useStyles();

  return (
    <div>
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
          <FormattedMessage id={tag} defaultMessage={tag} />
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

export default CustomCountryButtonGroup;
