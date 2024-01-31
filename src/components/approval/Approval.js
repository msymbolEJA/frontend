import React, { useEffect, useState, useCallback, useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  TableContainer,
  Checkbox,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemText,
  Box,
} from "@material-ui/core";
import {
  Flag as FlagIcon,
  Repeat as RepeatIcon,
  // ThumbUpAlt as ThumbUpAltIcon,
} from "@material-ui/icons";
import {
  repeatReasonsLinen,
  repeatReasonsMenuItemsLinenia,
  statusData,
} from "../../helper/Constants";

import { putData, getData, globalSearch } from "../../helper/PostData";
import TablePaginationActions from "../tableitems/TablePaginationActions";
import OrderStatus from "../tableitems/CustomSelectCell";
import UploadFile from "../tableitems/UploadFile";
import { putImage, postData, removeImage } from "../../helper/PostData";
import { getQueryParams } from "../../helper/getQueryParams";
import { toastErrorNotify, toastSuccessNotify, toastWarnNotify } from "../otheritems/ToastNotify";
import ConstantTableCell from "../tableitems/ConstantTableCell";
import FlagAndFavCell from "./FlagAndFavCell";
import EditableTableCell from "../tableitems/EditableTableCell";
import SortableTableCell from "./SortableTableCell";
import CustomButtonGroup from "./CustomButtonGroup";
import { tagsData, repeatReasons } from "../../helper/Constants";
import { FormattedMessage } from "react-intl";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import { AppContext } from "../../context/Context";

const BASE_URL = process.env.REACT_APP_BASE_URL;
// const BASE_URL_MAPPING = process.env.REACT_APP_BASE_URL_MAPPING;
const NON_SKU = process.env.REACT_APP_NON_SKU === "true" || false;
const PAGE_ROW_NUMBER = process.env.REACT_APP_PAGE_ROW_NUMBER || 50;
const STORE_ORJ = process.env.REACT_APP_STORE_NAME_ORJ;

const StyledMenu = withStyles({})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    maxHeight: "83vh",
    overflowX: "initial",
  },
  table: {
    // height: "500px",
    marginTop: "1rem",
  },
  disabled: {
    marginTop: "1rem",
    pointerEvents: "none",
  },
  selectTableCell: {
    width: 60,
  },
  approveButton: {
    margin: "5px auto 0",
    padding: "5px 2px",
    lineHeight: 1,
    fontSize: "small",
  },
  package: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    paddingRight: 20,
    background: "#fff",
    position: "fixed",
    width: "100%",
    bottom: 0,
    fontSize: 20,
  },
}));

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "rgb(100, 149, 237)",
    color: theme.palette.common.black,
    fontWeight: "bold",
    fontFamily: "Courier New",
  },
  body: {
    fontFamily: "Courier New",
    fontSize: 14,
  },
}))(TableCell);

const localStoragePrefix = process.env.REACT_APP_STORE_NAME_ORJ;

function App({ history }) {
  const [rows, setRows] = useState([]);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [orderBy, setOrderBy] = useState("created_date");
  const [order, setOrder] = useState("asc");
  const [selectedRowId, setSelectedRowId] = useState();

  const [selected, setSelected] = useState([]);
  const [selectedForPackage, setSelectedForPackage] = useState([]);

  const filters = getQueryParams();
  const [selectedTag, setSelectedTag] = useState(filters?.status || "pending");
  const [repeatAnchorEl, setRepeatAnchorEl] = useState();
  const [rowIdToRepeat, setRowIdToRepeat] = useState();
  const [loading, setloading] = useState(false);
  const [repeatMenuData, setRepeatMenuData] = useState({});
  const [refreshTable, setRefreshTable] = useState(false);
  const { user } = useContext(AppContext);

  const [lastResponse, setLastResponse] = useState(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolledToBottom) {
        const scrollThreshold = 0.7; // Set your threshold (70% in this example)

        const scrollPosition = window.innerHeight + window.scrollY;
        const scrollableHeight = document.body.offsetHeight;
        const scrollableThreshold = scrollableHeight * scrollThreshold;

        if (scrollPosition >= scrollableThreshold && lastResponse?.next) {
          setHasScrolledToBottom(true);
          getListFunc(lastResponse.next);

          // Set the flag to true to ensure it only triggers once
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolledToBottom, lastResponse]);

  const getListFunc = (link, limit, offset) => {
    setloading(true);
    getData(
      link ||
        `${BASE_URL}etsy/mapping/?${filters?.status ? `status=${filters?.status}` : ""}&is_repeat=${
          filters?.is_repeat
        }&ordering=${filters?.ordering || "-id"}&limit=${limit || filters?.limit || 0}&offset=${
          offset || filters?.offset
        }`,
    )
      .then(response => {
        const t = response?.data?.results?.length ? response?.data?.results : [];
        localStorage.setItem(
          `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}`,
          JSON.stringify(t),
        );
        localStorage.setItem(
          `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`,
          response?.data?.count || 0,
        );
        setRows([...rows, ...t]);
        setLastResponse(response?.data);

        setHasScrolledToBottom(false);
      })
      .catch(error => {
        localStorage.setItem(
          `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`,
          null,
        );
        console.log("error", error);
      })
      .finally(() => setloading(false));
  };

  const getLastUpdateDate = () => {
    if (!filters?.search) getListFunc();
    // getData(`${BASE_URL}etsy/get_mapping_update_date/`)
    //   .then((response) => {
    //     const l = localStorage.getItem(
    //       `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`
    //     );
    //     if (response.data.last_updated !== l) {
    //       localStorage.setItem(
    //         `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`,
    //         response.data.last_updated
    //       );
    //       if (!filters?.search) getListFunc();
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   })
    //   .finally(() => {});
  };

  useEffect(() => {
    if (filters?.search) return;
    getLastUpdateDate();
    let tmp;
    try {
      tmp =
        JSON.parse(
          localStorage.getItem(
            `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}`,
          ),
        ) ?? [];
    } catch (error) {
      tmp = [];
    }
    if (!tmp) {
      getListFunc();
    }
    if (tmp?.length) {
      setRows(tmp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.ordering,
    filters.status,
    filters.is_repeat,
    filters.limit,
    filters.offset,
    filters.search,
    count,
    selectedTag,
  ]);

  useEffect(() => {
    setSelectedTag(filters?.status);
  }, [filters?.status]);

  const handleRequestSort = (event, property) => {
    const isAsc = order === "asc";
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("ordering", `${isAsc ? "" : "-"}${property}`);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onChange = (e, id, name) => {
    if (!rows.length || !name) return;
    if (rows?.filter(item => item.id === id)?.[0]?.[name] === e.target.innerText) return;
    handleRowChange(id, { [name]: e.target.innerText });
  };

  const handleChangePage = (event, newPage) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("offset", newPage * filters?.limit || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    let rpp = +event.target.value;
    setPage(0);
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("limit", rpp || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
  };

  const handleRowChange = (id, data) => {
    if (!Object.keys(data)[0]) return;
    if (
      rows?.filter(item => item.id === id)?.[0]?.[Object.keys(data)[0]] === Object.values(data)[0]
    )
      return;
    setloading(true);
    putData(`${BASE_URL}etsy/mapping/${id}/`, data)
      .then(response => {
        toastSuccessNotify("Success");
      })
      .catch(error => {
        console.log(error);
        alert("An error occurred. Please try again");
        toastErrorNotify("Failed");
      })
      .finally(() => {
        if (filters?.search) {
          history.push(`/approval?search=${filters?.search}&limit=${50}&offset=${0}`);
        } else {
          // getListFunc();
        }
        setloading(false);
        // setRefreshTable(!refreshTable);
      });
  };

  const onSelectChange = (e, row) => {
    e.preventDefault();
    const a = statusData?.indexOf(row["status"]);
    const b = statusData?.indexOf(e.target.value);
    if (b - a > 1) {
      const resp = window?.confirm(
        `Beklenmedik durum değişikliği tespit edildi. 
      \n ${row["status"]} --> ${e.target.value}
      \nDevam etmek isteğinize emin misiniz `,
      );
      if (resp !== true) return;
    }

    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    if ((name === "status") & (value === "pending") & (row.is_repeat === true)) {
      let data = { [name]: value, is_repeat: false };
      handleRowChange(id, data);
    }
    if ((name === "status") & (value === "pending") & (row.approved === true)) {
      let data = { [name]: value, approved: false };
      handleRowChange(id, data);
    } else if ((name === "status") & (value === "awaiting") & (row.approved === false)) {
      let data = { [name]: value, approved: true };
      handleRowChange(id, data);
    } else {
      let data = { [name]: value };
      handleRowChange(id, data);
    }
  };

  const uploadFile = (e, id, imgFile) => {
    e.stopPropagation();
    try {
      // let path = `${BASE_URL_MAPPING}${id}/`;
      let path = `${BASE_URL}etsy/mapping/${id}/`;
      putImage(path, imgFile, "image.png")
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          getListFunc();
        });
    } catch (error) {
      console.log("error", error);
      toastWarnNotify("Select Image!");
    }
  };

  const removeFile = (e, id) => {
    e.stopPropagation();
    try {
      // let path = `${BASE_URL_MAPPING}${id}/`;
      let path = `${BASE_URL}etsy/mapping/${id}/destroy_image/`;
      removeImage(path)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          getListFunc();
        });
    } catch (error) {
      console.log("error", error);
      toastWarnNotify("Image couldn't be removed!");
    }
  };

  const fileSelectedHandler = (e, id) => {
    e.stopPropagation();
    let imgFile = e.target.files[0];

    var fr = new FileReader();
    if (fr.readAsDataURL) {
      fr.readAsDataURL(imgFile);
    } else if (fr.readAsDataurl) {
      fr.readAsDataurl(imgFile);
    }
    var img = new Image();
    fr.onload = function (e) {
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");

        canvas.id = "imageUploadCanvas";
        canvas.width = img.naturalWidth < 150 ? 200 : img.naturalWidth + 20;
        canvas.height = img.naturalHeight + 50;
        canvas.style.border = "2px solid black";

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height + 40);
        ctx.drawImage(img, 10, 40);
        ctx.font = "16px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("order no: " + id, canvas.width / 2, 30);
        canvas.toBlob(function (blob) {
          uploadFile(e, selectedRowId, blob);
        });
      };
    };
  };

  const selectId = (event, id) => {
    event.stopPropagation();
    setSelectedRowId(id);
  };

  const handleApproveSelected = () => {
    // postData(`${BASE_URL}etsy/approved_all/`, { ids: selected })
    postData(`${BASE_URL}etsy/approved_all/`, { ids: selected })
      .then(res => {
        toastWarnNotify("Selected 'PENDING' orders are approved");
        if (filters?.search) {
          history.push(`/approval?search=${filters?.search}&limit=${50}&offset=${0}`);
        } else getListFunc();
        setSelected([]);
      })
      .catch(({ response }) => {
        toastWarnNotify(response?.data?.detail);
      });
  };

  const handlePackage = () => {
    postData(`${BASE_URL}usps/create_multi_cargo/`, { ids: selectedForPackage })
      .then(res => {
        window.open(res?.data?.url, "_self");
        setSelectedForPackage([]);
      })
      .catch(({ response }) => {
        toastWarnNotify(response?.data?.detail);
      });
  };

  const handleTagChange = e => {
    if (e.currentTarget.id === filters?.status) return;
    setRows([]);
    const statu = e.currentTarget.id;
    setSelected([]);
    setSelectedTag(statu);
    let newUrl = "";
    switch (statu) {
      case "all_orders":
        newUrl += `limit=${50}&offset=${0}`;
        break;
      case "repeat":
        newUrl += `is_repeat=true&ordering=-last_updated&limit=${
          PAGE_ROW_NUMBER || 50
        }&offset=${0}`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
        break;
      case "shipped":
        newUrl += `status=${statu}&limit=${50}&offset=${0}`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
        break;
      default: //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
        newUrl += `status=${statu}&limit=${PAGE_ROW_NUMBER || 50}&offset=${0}`;
        break;
    }
    history.push(`/approval?&${newUrl}`);
    setPage(0);
  };

  const handlerFlagRepeatChange = (id, name, value) => {
    if (name === "is_repeat" && value === false) {
      let data = { [name]: !value, status: "awaiting" };
      handleRowChange(id, data);
    } else if (name === "approved" && value === false) {
      let data = { [name]: !value, status: "awaiting" };
      handleRowChange(id, data);
    } else {
      let data = { [name]: !value };
      handleRowChange(id, data);
    }
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows?.map(row => {
        if (NON_SKU) {
          if (
            !(
              (
                !!row?.variation_1_value?.replace(/\s/g, "") &&
                !!row?.variation_2_value?.replace(/\s/g, "")
              )
              // &&
              // !!row?.variation_1_name?.replace(/\s/g, "") &&
              // !!row?.variation_2_name?.replace(/\s/g, "")
            )
          ) {
            return null;
          }
        } else {
          if (
            !(
              !!row.supplier?.replace(/\s/g, "") &&
              !!row.type?.replace(/\s/g, "") &&
              !!row.color?.replace(/\s/g, "") &&
              !!row.length?.replace(/\s/g, "")
            )
          ) {
            return null;
          }
        }
        return row?.id;
      });
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectAllClickForPackage = event => {
    if (event.target.checked) {
      const newSelecteds = rows?.slice(0, 20).map(row => row?.id);
      setSelectedForPackage(newSelecteds);
      return;
    }
    setSelectedForPackage([]);
  };

  const handleCheckBoxClickForPackage = (event, id, row) => {
    const selectedIndex = selectedForPackage?.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = selectedForPackage.slice().concat(id);

      if (newSelected.length > 20) {
        newSelected.shift();
      }
    } else {
      newSelected = selectedForPackage
        .slice(0, selectedIndex)
        .concat(selectedForPackage.slice(selectedIndex + 1));
    }

    setSelectedForPackage(newSelected);
  };

  const handleCheckBoxClick = (event, id, row) => {
    const selectedIndex = selected?.indexOf(id);
    let newSelected = [];
    if (NON_SKU) {
      if (
        !(
          (
            !!row?.variation_1_value?.replace(/\s/g, "") &&
            !!row?.variation_2_value?.replace(/\s/g, "")
          )
          // &&
          // !!row?.variation_1_name?.replace(/\s/g, "") &&
          // !!row?.variation_2_name?.replace(/\s/g, "")
        )
      )
        return;
    } else {
      if (
        !(
          !!row.supplier?.replace(/\s/g, "") &&
          !!row.type?.replace(/\s/g, "") &&
          !!row.color?.replace(/\s/g, "") &&
          !!row.length?.replace(/\s/g, "") &&
          !(
            row["type"]?.toLowerCase()?.includes("kolye") &&
            row["type"]?.toLowerCase()?.includes("imza") &&
            !row["image"]
          )
        )
      )
        return;
    }

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  useEffect(() => {
    if (filters?.search) {
      globalSearch(
        // `${BASE_URL_MAPPING}?search=${filters?.search}&limit=${50}&offset=${
        `${BASE_URL}etsy/mapping/?search=${filters?.search}&limit=${50}&offset=${page * 50}`,
      )
        .then(response => {
          setRows(response.data.results);
          setCount(response?.data?.count || 0);
        })
        .catch(error => {
          console.log(error);
          setRows([]);
        });
    }
  }, [filters?.search, refreshTable]);

  const searchHandler = (value, keyCode) => {
    if (keyCode === 13 && value) {
      history.push(`/approval?search=${value}&limit=${50}&offset=${0}`);
    }
  };

  const handlerRepeatChange = (e, id, is_repeat) => {
    if (is_repeat) {
      let data = { is_repeat: false };
      handleRowChange(id, data);
    } else {
      setRowIdToRepeat(id);
      setRepeatAnchorEl(e.currentTarget);
    }
  };

  const handleRepeatMenuClose = useCallback(() => {
    setRepeatAnchorEl(null);
    setRepeatMenuData({});
  }, []);

  const handleRepeatMenuConfirm = useCallback(() => {
    if (repeatMenuData.rowId) {
      handleRowChange(repeatMenuData.rowId, repeatMenuData);
    }
    handleRepeatMenuClose();
  }, [repeatMenuData, handleRepeatMenuClose]);

  const handleRepeatMenuItemClick = useCallback(
    (row, reason) => () => {
      const data = {
        rowId: row.id,
        is_repeat: true,
        approved: true,
        status: "awaiting",
        explanation: "**REPEAT: " + reason + "** " + row?.explanation,
      };
      setRepeatMenuData(data);
    },
    [],
  );

  // console.log("NON_SKU", NON_SKU);

  const repeatMenu = useCallback(
    row => {
      return (
        <>
          <StyledMenu
            id="customized-menu"
            anchorEl={repeatAnchorEl}
            keepMounted
            open={Boolean(repeatAnchorEl)}
            onClose={handleRepeatMenuClose}
          >
            {/* <hr/> */}
            <span />
            {STORE_ORJ === "Linenia" ||
            STORE_ORJ === "DALLAS" ||
            STORE_ORJ === "LinenByMN" ||
            STORE_ORJ === "ShinyCustomized" ? (
              <div>
                {repeatReasonsMenuItemsLinenia.map(reason => (
                  <StyledMenuItem key={reason.id}>
                    <ListItemText
                      primary={reason.value}
                      id={reason.value}
                      onClick={handleRepeatMenuItemClick(row, repeatReasonsLinen[reason.id])}
                    />
                  </StyledMenuItem>
                ))}
              </div>
            ) : (
              <div>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.LETTER_PATTERN_IS_WRONG}
                    id="Letter Pattern Is Wrong"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.LETTER_PATTERN_IS_WRONG)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.WRONG_COLOR}
                    id="Wrong Color"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.WRONG_COLOR)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.NEW_COLOR}
                    id="Wrong Color"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.NEW_COLOR)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.STONE_FALL}
                    id="Stone Fall"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.STONE_FALL)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.DIFFERENT_PRODUCT}
                    id="Different Product"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.DIFFERENT_PRODUCT)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.NEW_LINE_UP}
                    id="Different Product"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.NEW_LINE_UP)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.LONG_CHAIN}
                    id="Long Chain"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.LONG_CHAIN)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.SHORT_CHAIN}
                    id="Short Chain"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.SHORT_CHAIN)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.DIFFERENT_FONT}
                    id="Different Font"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.DIFFERENT_FONT)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.DISCOLORATION}
                    id="discoloration"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.DISCOLORATION)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.BREAK_OFF}
                    id="break off"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.BREAK_OFF)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.BROKEN_LOCK}
                    id="break off"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.BROKEN_LOCK)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.LOST_IN_MAIL}
                    id="lost in mail"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.LOST_IN_MAIL)}
                  />
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText
                    primary={repeatReasons.SECOND}
                    id="Second"
                    onClick={handleRepeatMenuItemClick(row, repeatReasons.SECOND)}
                  />
                </StyledMenuItem>
              </div>
            )}
            <StyledMenuItem style={{ justifyContent: "space-around" }}>
              <Button color="primary" variant="contained" onClick={handleRepeatMenuClose}>
                Cancel
              </Button>
              <Button color="secondary" variant="contained" onClick={handleRepeatMenuConfirm}>
                OK
              </Button>
            </StyledMenuItem>
          </StyledMenu>
        </>
      );
    },
    [handleRepeatMenuClose, handleRepeatMenuConfirm, handleRepeatMenuItemClick, repeatAnchorEl],
  );

  return (
    <Paper className={classes.root}>
      <CustomButtonGroup
        selectedTag={selectedTag}
        handleTagChange={handleTagChange}
        tagsData={tagsData}
        searchHandler={searchHandler}
        loading={loading}
      />
      <div
        style={{
          display: "flex",
          color: "#001A33",
          marginBottom: 16,
          fontSize: "2rem",
          marginLeft: 16,
        }}
      >
        {loading ? (
          <FormattedMessage id="updating" />
        ) : (
          <>
            {filters?.search ? (
              <>
                <FormattedMessage id="searchResult" />
              </>
            ) : (
              <>
                <FormattedMessage id="total" defaultMessage="Total" />{" "}
                <FormattedMessage id={filters?.status || "result"} />
              </>
            )}{" "}
            :{" "}
            {rows.length ===
            Number(
              localStorage.getItem(
                `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`,
              ),
            )
              ? localStorage.getItem(
                  `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`,
                ) ?? 0
              : `${rows.length} 
              ${
                selectedTag
                  ? ` /${
                      localStorage.getItem(
                        `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`,
                      ) ?? 0
                    }`
                  : ""
              }
                `}
          </>
        )}
      </div>
      <TableContainer className={NON_SKU ? classes.container : ""}>
        <Table
          className={loading ? classes.disabled : classes.table}
          stickyHeader
          aria-label="caption table"
        >
          <TableHead>
            <TableRow>
              <SortableTableCell
                property="id"
                property2="receipt"
                property3="index"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="id"
                setOrderBy={setOrderBy}
              />
              {process.env.REACT_APP_STORE_NAME_ORJ === "AmazonHandmade" && (
                <StyledTableCell
                  align="center"
                  style={{
                    padding: 10,
                    borderRight: "0.5px solid #E0E0E0",
                  }}
                >
                  <FormattedMessage id="package" defaultMessage="Package" />

                  <br />
                  <Checkbox
                    indeterminate={
                      selectedForPackage?.length > 0 && selectedForPackage?.length < 20
                    }
                    checked={rows?.length > 0 && selectedForPackage?.length === 20}
                    color="primary"
                    onChange={handleSelectAllClickForPackage}
                    inputProps={{ "aria-label": "select all" }}
                  />
                </StyledTableCell>
              )}
              <SortableTableCell
                property="status"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="status"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="created_date"
                property3="buyer"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="createdDate"
                setOrderBy={setOrderBy}
              />
              {process.env.REACT_APP_STORE_NAME_ORJ === "Silveristic" ? (
                <SortableTableCell
                  property="supplier"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="supplier"
                  setOrderBy={setOrderBy}
                />
              ) : null}
              {process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
              process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
              process.env.REACT_APP_STORE_NAME === "Mina" ||
              process.env.REACT_APP_STORE_NAME === "Güneş Tekstil" ? (
                <SortableTableCell
                  property="sku"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="type"
                  setOrderBy={setOrderBy}
                />
              ) : null}
              {NON_SKU ? (
                <>
                  <SortableTableCell
                    property="variation_1_value"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="Size"
                    setOrderBy={setOrderBy}
                  />
                  <SortableTableCell
                    property="variation_2_value"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="Color"
                    setOrderBy={setOrderBy}
                  />
                </>
              ) : (
                <>
                  <SortableTableCell
                    property="type"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="type"
                    setOrderBy={setOrderBy}
                  />
                  <SortableTableCell
                    property="length"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="var1"
                    setOrderBy={setOrderBy}
                  />
                  <SortableTableCell
                    property="color"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="var2"
                    setOrderBy={setOrderBy}
                  />
                  <SortableTableCell
                    property="qty"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="var3"
                    setOrderBy={setOrderBy}
                  />
                  <SortableTableCell
                    property="size"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="var4"
                    setOrderBy={setOrderBy}
                  />
                  <SortableTableCell
                    property="start"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="var5"
                    setOrderBy={setOrderBy}
                  />
                  <SortableTableCell
                    property="space"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="var6"
                    setOrderBy={setOrderBy}
                  />
                </>
              )}
              <SortableTableCell
                property="explanation"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="explanation"
                setOrderBy={setOrderBy}
              />
              <StyledTableCell
                align="center"
                style={{
                  padding: 10,
                  pointerEvents: selectedTag === "pending" ? "auto" : "none",
                  borderRight: "0.5px solid #E0E0E0",
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleApproveSelected}
                  className={classes.approveButton}
                  disabled={!selected?.length}
                >
                  <FormattedMessage id="approve" defaultMessage="Approve" /> (
                  {
                    selected.filter(function (el) {
                      return el != null;
                    })?.length
                  }
                  )
                </Button>
                <br />
                <Checkbox
                  indeterminate={selected?.length > 0 && selected?.length < rows?.length}
                  checked={rows?.length > 0 && selected?.length === rows?.length}
                  color="primary"
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all" }}
                />
              </StyledTableCell>
              <SortableTableCell
                property="personalization"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="personalization"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="message_from_buyer"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="customerNote"
                setOrderBy={setOrderBy}
              />
              {user !== "DrMel" &&
              process.env.REACT_APP_STORE_NAME !== "Mina" &&
              process.env.REACT_APP_STORE_NAME !== "Linen Serisi" ? (
                <SortableTableCell
                  property="gift_message"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="giftMessage"
                  setOrderBy={setOrderBy}
                />
              ) : null}
              <SortableTableCell
                property="note"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="internalNote"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="image"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="uploadFile"
                setOrderBy={setOrderBy}
              />
            </TableRow>
          </TableHead>
          {rows.length ? (
            <TableBody>
              {rows?.map((row, index) => {
                const isItemSelected = selected?.indexOf(row.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow
                    key={row.id}
                    id={row.id}
                    //onBlur={(e) => handleRowBlur(e, row.id)}
                    //onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                    style={{
                      pointerEvents:
                        loading &&
                        process.env.REACT_APP_STORE_NAME !== "Kalpli Serisi" &&
                        process.env.REACT_APP_STORE_NAME_ORJ !== "Silveristic" &&
                        !NON_SKU
                          ? "none"
                          : "auto",
                      backgroundColor:
                        !isNaN(row?.qty?.split(" ")?.[0]) && Number(row?.qty?.split(" ")?.[0]) >= 4
                          ? "#ee6363"
                          : (row.status !== "pending") & (row.approved === false)
                          ? "#FF9494"
                          : row["type"]?.includes("14K") || row["explanation"]?.includes("14K")
                          ? "#ffef8a"
                          : null,
                    }}
                  >
                    <FlagAndFavCell
                      {...{
                        row,
                        name: "id",
                        name2: "receipt",
                        name3: "item_index",
                        name5: "is_repeat",
                        handlerFlagRepeatChange,
                      }}
                    />

                    {process.env.REACT_APP_STORE_NAME_ORJ === "AmazonHandmade" && (
                      <td
                        style={{
                          padding: 10,
                          minWidth: 90,
                          pointerEvents: "auto",
                          background: row?.tracking_code_orders ? "#00ee00" : "",
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleCheckBoxClickForPackage(e, row.id, row);
                        }}
                        onBlur={e => {
                          e.stopPropagation();
                        }}
                        onChange={e => {
                          e.stopPropagation();
                        }}
                      >
                        <Checkbox
                          checked={selectedForPackage?.indexOf(row.id) !== -1}
                          color="primary"
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </td>
                    )}

                    <td
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      onBlur={e => {
                        e.stopPropagation();
                      }}
                      style={{
                        padding: 5,
                      }}
                    >
                      {row?.shop === "Shopify" ? <ShoppingBasketIcon color="secondary" /> : null}
                      <br />
                      {(row["status"] === "in_progress" || row["status"] === "ready") &&
                      process.env.REACT_APP_STORE_NAME !== "Kalpli Serisi" &&
                      process.env.REACT_APP_STORE_NAME_ORJ !== "Silveristic" ? null : (
                        <>
                          <RepeatIcon
                            style={{
                              color: row["is_repeat"] ? "red" : "grey",
                              cursor: "pointer",
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              handlerRepeatChange(e, row.id, row.is_repeat);
                            }}
                          />
                          {Boolean(repeatAnchorEl) && row.id === rowIdToRepeat
                            ? repeatMenu(row)
                            : null}
                        </>
                      )}
                      {/* <ThumbUpAltIcon
                        style={{
                          color: row["approved"] ? "red" : "grey",
                          cursor: "pointer",
                          pointerEvents:
                            row.status === "pending" ? "auto" : "none",
                        }}
                        onClick={() =>
                          handlerFlagRepeatChange(
                            row.id,
                            "approved",
                            row["approved"]
                          )
                        }
                      /> */}
                      <OrderStatus {...{ row, name: "status", onSelectChange }} />
                    </td>
                    <ConstantTableCell {...{ row, name: "created_date", name3: "buyer" }} />
                    {process.env.REACT_APP_STORE_NAME_ORJ === "Silveristic" ? (
                      <EditableTableCell
                        {...{
                          row,
                          name: "supplier",
                          onChange,
                        }}
                      />
                    ) : null}
                    {process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
                    process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
                    process.env.REACT_APP_STORE_NAME === "Mina" ||
                    process.env.REACT_APP_STORE_NAME === "Güneş Tekstil" ? (
                      <EditableTableCell
                        style={{ fontWeight: "bold" }}
                        {...{
                          row,
                          name: "sku",
                          onChange,
                        }}
                      />
                    ) : null}
                    {NON_SKU ? (
                      <>
                        <EditableTableCell
                          style={{ fontWeight: "bold" }}
                          {...{
                            row,
                            name:
                              row["sku"] === "Linen_Pillow"
                                ? "variation_2_value"
                                : "variation_1_value",
                            onChange,
                          }}
                        />
                        <EditableTableCell
                          style={{ fontWeight: "bold" }}
                          {...{
                            row,
                            name:
                              row["sku"] === "Linen_Pillow"
                                ? "variation_1_value"
                                : "variation_2_value",
                            onChange,
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <EditableTableCell
                          {...{
                            row,
                            name: "type",
                            onChange,
                          }}
                        />
                        <EditableTableCell
                          // var1
                          {...{
                            row,
                            name: "length",
                            onChange,
                          }}
                        />
                        <EditableTableCell
                          // var2
                          {...{
                            row,
                            name: "color",
                            onChange,
                            minWidth: 60,
                          }}
                        />
                        <EditableTableCell
                          {...{
                            row,
                            name: "qty",
                            onChange,
                            minWidth: 70,
                          }}
                        />
                        <EditableTableCell
                          {...{
                            row,
                            name: "size",
                            onChange,
                          }}
                        />
                        <EditableTableCell
                          {...{
                            row,
                            name: "start",
                            onChange,
                            minWidth: 80,
                          }}
                        />
                        <EditableTableCell
                          {...{
                            row,
                            name: "space",
                            onChange,
                            minWidth: 80,
                          }}
                        />
                      </>
                    )}
                    <EditableTableCell
                      {...{
                        row,
                        name: "explanation",
                        onChange,
                        minWidth:
                          process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
                          process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
                          process.env.REACT_APP_STORE_NAME === "Mina" ||
                          process.env.REACT_APP_STORE_NAME === "Güneş Tekstil"
                            ? 250
                            : 0,
                      }}
                    />
                    <td
                      style={{
                        padding: 10,
                        pointerEvents:
                          process.env.REACT_APP_STORE_NAME_ORJ === "Silveristic"
                            ? "auto"
                            : row.status === "pending"
                            ? "auto"
                            : "none",
                        minWidth: 90,
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        handleCheckBoxClick(e, row.id, row);
                      }}
                      onBlur={e => {
                        e.stopPropagation();
                      }}
                      onChange={e => {
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        checked={isItemSelected}
                        disabled={
                          NON_SKU
                            ? !(
                                (
                                  !!row?.variation_1_value?.replace(/\s/g, "") &&
                                  !!row?.variation_2_value?.replace(/\s/g, "")
                                )
                                // &&
                                // !!row?.variation_1_name?.replace(/\s/g, "") &&
                                // !!row?.variation_2_name?.replace(/\s/g, "")
                              )
                            : !(
                                !!row.supplier?.replace(/\s/g, "") &&
                                !!row.type?.replace(/\s/g, "") &&
                                !!row.color?.replace(/\s/g, "") &&
                                !!row.length?.replace(/\s/g, "") &&
                                !(
                                  row["type"]?.toLowerCase()?.includes("kolye") &&
                                  row["type"]?.toLowerCase()?.includes("imza") &&
                                  !row["image"]
                                )
                              )
                        }
                        color="primary"
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </td>
                    <ConstantTableCell
                      {...{
                        row,
                        name: "personalization",
                        onChange,
                        minWidth:
                          process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
                          process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
                          process.env.REACT_APP_STORE_NAME === "Mina" ||
                          process.env.REACT_APP_STORE_NAME === "Güneş Tekstil"
                            ? 250
                            : 0,
                      }}
                    />
                    <ConstantTableCell
                      {...{
                        row,
                        name: "message_from_buyer",
                        onChange,
                        minWidth:
                          process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
                          process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
                          process.env.REACT_APP_STORE_NAME === "Mina" ||
                          process.env.REACT_APP_STORE_NAME === "Güneş Tekstil"
                            ? 150
                            : 0,
                      }}
                    />
                    {user !== "DrMel" &&
                    process.env.REACT_APP_STORE_NAME !== "Mina" &&
                    process.env.REACT_APP_STORE_NAME !== "Linen Serisi" ? (
                      <EditableTableCell {...{ row, name: "gift_message", onChange }} />
                    ) : null}
                    <EditableTableCell {...{ row, name: "note", onChange }} />
                    <td
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      style={{ padding: 10 }}
                    >
                      <UploadFile
                        {...{
                          row,
                          name: "image",
                          uploadFile,
                          fileSelectedHandler,
                          selectId,
                          selectedRowId,
                          removeFile,
                        }}
                      />
                    </td>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          ) : null}
          <TableFooter>
            <TableRow>
              <td>
                <FormattedMessage id="totalRecord" defaultMessage="Total Record" />:
              </td>
              <td>
                {localStorage.getItem(
                  `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`,
                ) || 0}
              </td>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 250, 500, 2500]}
                colSpan={22}
                count={Number(
                  localStorage.getItem(
                    `${localStoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`,
                  ) ?? 0,
                )}
                rowsPerPage={Number(filters.limit)}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <ToastContainer style={{ color: "black" }} />
      {selectedForPackage?.length ? (
        <Box component={Paper} elevation={2} className={classes.package}>
          {selectedForPackage?.length} Items will be packaged{" "}
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ marginLeft: 20 }}
            onClick={handlePackage}
          >
            Package
          </Button>
        </Box>
      ) : null}
    </Paper>
  );
}

export default App;
