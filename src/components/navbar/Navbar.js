import React, { useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Tooltip from "@material-ui/core/Tooltip";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import StoreIcon from "@material-ui/icons/Store";
import Menu from "@material-ui/core/Menu";
import { AppContext } from "../../context/Context";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Replay from "@material-ui/icons/Replay";
import {
  ThumbUp as ThumbUpIcon,
  ViewList as ViewListIcon,
  LocalShipping as LocalShippingIcon,
  Notifications as NotificationsIcon,
} from "@material-ui/icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Badge, Drawer } from "@material-ui/core";
import { getData, putData } from "../../helper/PostData";
import Notification from "./Notification";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const NON_SKU = process.env.REACT_APP_NON_SKU === "true";
const STORE_NAME = process.env.REACT_APP_STORE_NAME;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 80,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  rightTitle: {
    // marginLeft: "1rem",
  },
  title: {
    flexGrow: 1,
  },
  hrefStyle: {
    textDecoration: "none",
    color: "#474747",
    fontWeight: "545",
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },
  rightTop: {
    display: "flex",
    flexDirection: "row",
  },
  userRole: {
    fontSize: "0.8rem",
    color: "#d3d3d3",
  },
  userName: {
    fontSize: "1.2rem",
  },
  whiteColor: {
    color: "white",
  },
  button: {
    backgroundColor: "white",
    margin: "0.1rem",
    fontSize: "1rem !important",
    fontWeight: "bold",
    width: "11.5rem",
    "&:hover": {
      color: "white",
      borderColor: "white",
    },
  },
  activeButton: {
    backgroundColor: "rgb(100, 149, 237)",
    color: "black",
    fontWeight: "bold",
    margin: "0.1rem",
    width: "11.5rem",
    borderColor: "white",
    "&:hover": {
      color: "white",
      borderColor: "white",
    },
  },
  button2: {
    backgroundColor: "white",
    margin: "0.1rem",
    fontSize: "1rem !important",
    fontWeight: "bold",
    padding: "2px",
    "&:hover": {
      color: "white",
      borderColor: "white",
    },
  },
  activeShopButton: {
    color: "#3F51B5",
    backgroundColor: "white",
    padding: "2px",
    borderRadius: "50%",
  },
  nonActiveShopButton: {
    backgroundColor: "#3F51B5",
    color: "white",
    padding: 5,
    cursor: "pointer",
  },
  mobileNonActiveShopButton: {
    backgroundColor: "#3F51B5",
    color: "white",
    padding: 5,
    cursor: "pointer",
    fontSize: "1rem",
  },
  mobileActiveButton: {
    color: "#3F51B5",
    backgroundColor: "white",
    padding: "2px",
    borderRadius: "50%",
    fontSize: "1rem",
  },
  textField: {
    width: 150,
    height: 37,
    backgroundColor: "white",
    "& input": {
      marginTop: "-2px",
      fontSize: "11px",
    },
  },
  textFieldMobil: {
    width: 300,
    height: 40,
    backgroundColor: "white",
    "& input": {
      fontSize: "10px",
    },
  },
}));

export default function MenuAppBar() {
  const classes = useStyles(); // eslint-disable-next-line
  const [auth, setAuth] = useState(true);
  const [searchText, setSearchText] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, lang, setLang } = useContext(AppContext);
  const [notification, setNotification] = useState({
    count: 0,
    results: [],
    drawer: false,
  });
  //console.log("user", user);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const mobileView = useMediaQuery("(max-width:1024px)");
  const myInputRef = useRef(null);
  //console.log(user?.role);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleDirClick = e => {
    history.push(`/${e.target.id}`);
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotification = async () => {
    getData(`${BASE_URL}etsy/notification/`).then(response => {
      setNotification(response.data);
    });
  };

  useEffect(() => {
    getNotification();
  }, []);

  let localRole = localStorage.getItem("localRole");
  const localStoragePrefix = process.env.REACT_APP_STORE_NAME_ORJ + "-";
  const handleSearch = e => {
    history.push({
      pathname: "/search",
      state: {
        global: searchText,
      },
    });
  };

  const handleMainPage = () => {
    if (localRole === "workshop_designer" || localRole === "workshop_designer2") {
      return null;
    } else {
      history.push("/");
    }
    setAnchorEl(null);
  };
  // const handleSettingsPage = () => {
  //   history.push("/settings");
  //   setAnchorEl(null);
  // };
  const handleLogout = () => {
    history.push("/");
    setAnchorEl(null);
    localStorage.removeItem(localStoragePrefix + "x-auth-token");
    localStorage.removeItem("localUser");
    localStorage.removeItem("localEmail");
    localStorage.removeItem("localRole");
    localStorage.removeItem("localId");
  };

  const localUser = localStorage.getItem("localUser");
  const isBeyazit =
    (localStorage.getItem("localRole") === "workshop_manager" ||
      !localStorage.getItem("localRole") ||
      localStorage.getItem("localRole") === "null") &&
    !["asya", "umraniye"].includes(localStorage.getItem("workshop")?.toLowerCase());

  const userRole = user?.role || localRole;

  const handleLangChange = e => {
    setLang(e.target.value);
  };

  // console.log("localUser", localUser);
  // console.log(localUser === "admin");

  const newStatu =
    localRole === "admin" || localRole === "shop_manager" || localRole === "shop_packer"
      ? "pending"
      : localRole === "workshop_designer" || localRole === "workshop_designer2"
      ? "in_progress"
      : "awaiting";
  // console.log("Navbar newStatu", newStatu);

  const handleClick = (e, cargoList = false) => {
    // const newStatu = getFirstStatu();
    // console.log("newStatu", newStatu);
    history.push(
      `/${e.currentTarget.id}?status=${newStatu}`,
    );
    setAnchorEl(null);
  };

  const toggleDrawer = open => {
    setNotification({ ...notification, drawer: open });
    !open && getNotification();
  };

  const handleNotification = (e, id, item) => {
    putData(`${BASE_URL}etsy/notification/${id}/`, {
      isRead: e.target.checked,
      mapping_id: item.mapping_id,
    })
      .then(response => {
        console.log("response", response);
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  const manualRefresh = () => {
    let arr = []; // Array to hold the keys includes last_updated
    // Iterate over localStorage and insert the keys that meet the condition into arr
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).includes("last_updated")) {
        arr.push(localStorage.key(i));
      }
    }
    // Iterate over arr and remove the items by key
    for (let i = 0; i < arr.length; i++) {
      localStorage.removeItem(arr[i]);
    }
    window?.location.reload();
    return false;
  };
  return (
    <div className={classes.root}>
      <FormGroup></FormGroup>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleMainPage}
          >
            {/* <StoreIcon /> */}
            {mobileView ? (
              <StoreIcon />
            ) : (
              <Typography variant={"h6"} className={classes.rightTitle}>
                {STORE_NAME}
              </Typography>
            )}
          </IconButton>
          {/* Only can see by workshop users without textfile (NON_SKU) workshop users */}
          {!isBeyazit &&
            localRole !== "workshop_designer" &&
            localRole !== "workshop_designer2" &&
            userRole?.includes("workshop") &&
            !NON_SKU && (
              <>
                <Badge
                  badgeContent={notification?.count}
                  className="cp"
                  color="secondary"
                  children={<NotificationsIcon />}
                  onClick={() => toggleDrawer(true)}
                />
                <Drawer anchor="top" open={notification.drawer} onClose={() => toggleDrawer(false)}>
                  <Notification
                    toggleDrawer={toggleDrawer}
                    notification={notification}
                    handleNotification={handleNotification}
                  />
                </Drawer>
              </>
            )}
          <div className={classes.title}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!mobileView && (
                <Button
                  color="primary"
                  variant="outlined"
                  id="all-orders"
                  disabled={userRole?.includes("workshop") && !isBeyazit && notification?.count}
                  className={
                    mobileView
                      ? classes.button2
                      : window.location.pathname.includes("orders")
                      ? classes.activeButton
                      : classes.button
                  }
                  startIcon={mobileView ? null : <ViewListIcon />}
                  onClick={handleClick}
                >
                  <FormattedMessage id="orders" defaultMessage="Orders" />
                </Button>
              )}
              {!mobileView &&
              (userRole === "admin" ||
                userRole === "shop_manager" ||
                userRole === "shop_packer") ? (
                <>
                  <Button
                    color="primary"
                    variant="outlined"
                    id="approval"
                    className={
                      mobileView
                        ? classes.button2
                        : window.location.pathname.includes("approval")
                        ? classes.activeButton
                        : classes.button
                    }
                    startIcon={mobileView ? null : <ThumbUpIcon />}
                    onClick={() =>
                      history.push(`/approval?&status=pending`)
                    }
                  >
                    <FormattedMessage id="admin" defaultMessage="Admin" />
                  </Button>
                </>
              ) : null}
              {mobileView ||
              localRole === "workshop_designer" ||
              localRole === "workshop_designer2" ? null : (
                <Button
                  color="primary"
                  variant="outlined"
                  id="cargo-list"
                  className={
                    mobileView
                      ? classes.button2
                      : window.location.pathname.includes("cargo")
                      ? classes.activeButton
                      : classes.button
                  }
                  startIcon={mobileView ? null : <LocalShippingIcon />}
                  onClick={e => handleClick(e, true)}
                >
                  <FormattedMessage id="cargoList" defaultMessage="Cargo List" />
                </Button>
              )}
              {!isBeyazit &&
              localRole !== "workshop_designer" &&
              localRole !== "workshop_designer2" &&
              window?.location?.pathname !== "/search" ? (
                <OutlinedInput
                  type="text"
                  defaultValue=""
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={e => e.keyCode === 13 && handleSearch()}
                  ref={myInputRef}
                  className={mobileView ? classes.textFieldMobil : classes.textField}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={55}
                />
              ) : null}
            </div>
          </div>
          <Tooltip title={"Reset All"} placement="bottom-start">
            <Replay style={{ cursor: "pointer", margin: "0 1rem" }} onClick={manualRefresh} />
          </Tooltip>

          {isBeyazit || mobileView ? null : (
            <div style={{ marginRight: "2rem" }}>
              <FormControl className={classes.formControl}>
                <NativeSelect
                  value={lang}
                  onChange={handleLangChange}
                  className={classes.whiteColor}
                  inputProps={{
                    name: "age",
                    id: "age-native-label-placeholder",
                  }}
                >
                  <option value="en" style={{ color: "black" }}>
                    🇺🇸
                  </option>
                  <option value="tr" style={{ color: "black" }}>
                    🇹🇷
                  </option>
                </NativeSelect>
              </FormControl>
            </div>
          )}
          {isBeyazit && auth ? (
            <div className={classes.rightTop}>
              {mobileView ? null : (
                <div className={classes.userInfo}>
                  <div className={classes.userRole}>
                    {user?.role?.toUpperCase() || localRole?.toUpperCase()}
                  </div>
                  <div className={classes.userName}>
                    {localUser || user?.user || user?.username}
                  </div>
                </div>
              )}
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                style={{ marginTop: "3.2rem" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem id="workload" onClick={e => handleDirClick(e)}>
                  <FormattedMessage id="workload" defaultMessage="workload" />
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <FormattedMessage id="logout" defaultMessage="Logout" />
                </MenuItem>
              </Menu>
            </div>
          ) : null}
          {!isBeyazit && auth && (
            <div className={classes.rightTop}>
              {mobileView ? null : (
                <div className={classes.userInfo}>
                  <div className={classes.userRole}>
                    {user?.role?.toUpperCase() || localRole?.toUpperCase()}
                  </div>
                  <div className={classes.userName}>
                    {localUser || user?.user || user?.username}
                  </div>
                </div>
              )}
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                style={{ marginTop: "3.2rem" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                {localRole === "admin" && (
                  <div>
                    <MenuItem>
                      <a
                        className={classes.hrefStyle}
                        href={`/all-orders?status=pending&limit=50&offset=0/`}
                      >
                        Orders
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className={classes.hrefStyle}
                        href={`/approval?status=pending&limit=50&offset=0/`}
                      >
                        Admin
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className={classes.hrefStyle}
                        href={`/cargo-list?status=pending&limit=50&offset=0/`}
                      >
                        Cargo List
                      </a>
                    </MenuItem>
                    <MenuItem id="cost-table" onClick={e => handleDirClick(e)}>
                      <FormattedMessage id="costTable" defaultMessage="Cost Table" />
                    </MenuItem>
                  </div>
                )}

                {localRole !== "workshop_designer" && localRole !== "workshop_designer2" && (
                  <MenuItem id="best-seller" onClick={e => handleDirClick(e)}>
                    <FormattedMessage id="statistics" defaultMessage="Statistics" />
                  </MenuItem>
                )}

                <MenuItem id="workload" onClick={e => handleDirClick(e)}>
                  <FormattedMessage id="workload" defaultMessage="workload" />
                </MenuItem>

                {(userRole === "admin" ||
                  userRole === "shop_manager" ||
                  userRole === "shop_packer") && (
                  <div>
                    <MenuItem id="favourites" onClick={e => handleDirClick(e)}>
                      <FormattedMessage id="favourites" defaultMessage="Favourites" />
                    </MenuItem>
                    <MenuItem id="search" onClick={e => handleDirClick(e)}>
                      <FormattedMessage id="search" defaultMessage="Search" />
                    </MenuItem>
                    <MenuItem id="new-order" onClick={e => handleDirClick(e)}>
                      <FormattedMessage id="new" defaultMessage="New" />
                    </MenuItem>
                    <MenuItem id="stock-list" onClick={e => handleDirClick(e)}>
                      <FormattedMessage id="stockList" defaultMessage="Stock List" />
                    </MenuItem>
                  </div>
                )}
                <MenuItem id="account" onClick={handleDirClick}>
                  <FormattedMessage id="account" defaultMessage="Account" />
                </MenuItem>
                {/*         <MenuItem onClick={handleSettingsPage}>
                  <FormattedMessage id="settings" defaultMessage="Settings" />
                </MenuItem> */}

                <MenuItem onClick={handleLogout}>
                  <FormattedMessage id="logout" defaultMessage="Logout" />
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
