import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { green } from "@material-ui/core/colors";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DownloadFile from "@material-ui/icons/GetApp";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/Context";
import { getData, putData } from "../../helper/PostData";
import api from "../../helper/api";
import ConfirmDialog from "../otheritems/ConfirmModal";
import { toastErrorNotify, toastSuccessNotify } from "../otheritems/ToastNotify";
import EditableTableCell from "./EditableTableCell";
import { getQueryParams } from "../../helper/getQueryParams";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "rgb(100, 149, 237)",
    color: theme.palette.common.black,
    fontWeight: "bold",
    fontFamily: "Courier New",
  },
  body: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Courier New",
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      cursor: "pointer",
      //boxShadow: "1px 2px",
      backgroundColor: "#add8e6",
    },
  },
}))(TableRow);

const ColorButton = withStyles(theme => ({
  root: {
    backgroundColor: green[500],
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: green[700],
    },
  },
}))(Button);

const useStyles = makeStyles({
  table: {
    //width: "500px",
  },
  root: {
    margin: "1rem",
    minWidth: "500px",
    width: "98%",
    minHeight: "250px",
  },
  header: {
    marginBottom: "1rem",
  },
  btn: {
    margin: "0.3rem",
  },
  spanHref: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default function CustomizedTables() {
  const isBeyazit =
    (localStorage.getItem("localRole") === "workshop_manager" ||
      !localStorage.getItem("localRole") ||
      localStorage.getItem("localRole") === "null") &&
    !["asya", "umraniye"].includes(localStorage.getItem("workshop")?.toLowerCase());
  const classes = useStyles();
  const [cargoList, setCargoList] = useState([]);
  const history = useHistory();
  const [getSupplier, setGetSupplier] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const { isAdmin, user } = useContext(AppContext);
  const [page, setPage] = useState(0);

  let localRole = localStorage.getItem("localRole");

  const userRole = user?.role || localRole;
  const filters = getQueryParams();

  const [lastResponse, setLastResponse] = useState(null);
  const [isMore, setIsMore] = useState(true);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolledToBottom) {
        const scrollThreshold = 0.7; // Set your threshold (70% in this example)

        const scrollPosition = window.innerHeight + window.scrollY;
        const scrollableHeight = document.body.offsetHeight;
        const scrollableThreshold = scrollableHeight * scrollThreshold;

        if (scrollPosition >= scrollableThreshold && lastResponse?.next && isMore) {
          setHasScrolledToBottom(true);
          getListFunc(lastResponse?.next);

          // Set the flag to true to ensure it only triggers once
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolledToBottom, lastResponse]);

  const getListFunc = link => {
    getData(
      link ||
        `${BASE_URL}etsy/shipment_content_view/?limit=${filters?.limit || 0}&offset=${
          filters?.offset
        }`,
    ).then(response => {
      let dataObj = response?.data?.results;
      const formattedData = dataObj
        ? Object.keys(dataObj).flatMap(key => {
            const shipmentData = dataObj[key];
            return {
              ...shipmentData,
              refNumber: key,
            };
          })
        : [];

      const clist = cargoList || [];

      // Remove duplicates based on the "id" property

      const l = Object.keys(dataObj)?.length;

      if (l) {
        const test = clist.concat([...formattedData]);

        setCargoList(test);
        setLastResponse(response?.data);
        setHasScrolledToBottom(false);
      }
      if (l !== 10) setIsMore(false);
    });
  };
  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, [getSupplier]);

  const tnFunc = (tn, carrier) => {
    if (carrier.toUpperCase().includes("DHL")) {
      return `https://www.dhl.com/en/express/tracking.html?AWB=${tn}&brand=DHL`;
    } else if (carrier.toUpperCase().includes("UPS")) {
      return `https://www.ups.com/track?tracknum=${tn}`;
    } else if (carrier.toUpperCase().includes("TNT")) {
      return `https://www.tnt.com/express/en_gc/site/shipping-tools/track.html?searchType=con&cons=${tn}`;
    } else if (carrier.toUpperCase().includes("FEDEX")) {
      return `https://www.fedex.com/fedextrack/no-results-found?trknbr=${tn}`;
    } else {
      return tn;
    }
  };

  const handleRowClick = id => {
    history.push(`/cargo-content/${id}`);
  };

  const handleSupplier = e => {
    if (e.currentTarget.id) {
      setGetSupplier(`?supplier=${e.currentTarget.id}`);
    } else {
      setGetSupplier("");
    }
  };

  const handleRowChange = useCallback(
    (id, data) => {
      if (!data) return;
      putData(`${BASE_URL}etsy/shipments/${id}/`, data)
        .then(response => {
          // console.log(response);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => getListFunc());
    },
    [getListFunc],
  );

  const onChange = (e, id, name) => {
    handleRowChange(id, { [name]: e.target.innerText });
  };

  const handleConfirm = () => {
    const url =
      selectedItem.action === "undo"
        ? `/etsy/undoCargo/${selectedItem?.id}/`
        : selectedItem?.action === "delete"
        ? `/etsy/cancelCargo/${selectedItem?.id}/`
        : selectedItem?.action === "to_ship"
        ? `/etsy/to_ship/${selectedItem?.id}/`
        : null;
    api(url, "get")
      .then(response => {
        toastSuccessNotify(response?.data?.message || response.data);
        getListFunc();
      })
      .catch(error => {
        toastErrorNotify(error?.response?.data?.message || error?.message);
      })
      .finally(() => setSelectedItem(null));
  };

  const printHandler = (id, cargoType) => {
    if (id) {
      if (cargoType === "DHL") {
        getData(`${BASE_URL}dhl/createdhlBulkLabel_cargo/${id}/`)
          .then(response => {
            window?.location.reload(false);
          })
          .catch(({ response }) => {
            console.log(response.data.Failed);
          })
          .finally(() => {});
      } else if (cargoType === "USPS") {
        getData(`${BASE_URL}usps/createuspsBulkLabel_cargo/${id}/`)
          .then(response => {
            window?.location.reload(false);
          })
          .catch(({ response }) => {
            console.log(response.data.Failed);
          })
          .finally(() => {});
      }
    }
  };

  const handleConfirmModal = (e, id, action) => {
    setSelectedItem({ ...selectedItem, id, action });
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.root}>
        {/* {isAdmin ? (
          <div>
            <Button
              variant="contained"
              color="secondary"
              id=""
              onClick={handleSupplier}
              className={classes.btn}
            >
              <FormattedMessage id="all" defaultMessage="ALL" />
            </Button>
            <Button
              className={classes.btn}
              color="secondary"
              variant="contained"
              id="asya"
              onClick={handleSupplier}
            >
              ASYA
            </Button>
            <Button
              color="secondary"
              className={classes.btn}
              variant="contained"
              id="beyazit"
              onClick={handleSupplier}
            >
              Beyazit
            </Button>
          </div>
        ) : null} */}
        <Typography className={classes.header} variant="h3">
          <FormattedMessage id="cargoList" defaultMessage="Cargo List" />
        </Typography>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                <FormattedMessage id="id" defaultMessage="Id" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="referenceNumber" defaultMessage="Reference Number" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="description" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="carrier" defaultMessage="Carrier" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="content" defaultMessage="Content" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="count" defaultMessage="Count" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="shipmentDate" defaultMessage="Log Date" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="trackingNumber" defaultMessage="Tracking Number" />
              </StyledTableCell>
              {process.env.REACT_APP_IS_DHL_ENABLED === "true" &&
              (userRole === "admin" ||
                userRole === "shop_manager" ||
                userRole === "shop_packer") ? (
                <StyledTableCell align="center">
                  <FormattedMessage id="download" defaultMessage="Download" />
                </StyledTableCell>
              ) : null}
              {!isBeyazit && (
                <StyledTableCell align="center">
                  <FormattedMessage id="action" defaultMessage="Action" />
                </StyledTableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {cargoList === undefined ? null : cargoList?.length === 0 ? (
              <tr>
                <td colSpan="50">No Item!</td>
              </tr>
            ) : (
              cargoList.map((row, i) => {
                return (
                  <StyledTableRow key={i} onClick={() => handleRowClick(row.id)}>
                    <StyledTableCell align="center">
                      {row.id}
                      <br />({row.supplier})
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row?.refNumber.split("**")[0]}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row?.refNumber.split("**")[1]}
                    </StyledTableCell>
                    <EditableTableCell
                      align="center"
                      {...{
                        row,
                        name: "carrier",
                        onChange,
                      }}
                    />
                    <StyledTableCell align="center" className={classes.spanHref}>
                      {row?.content?.map((key, i) => (
                        <span
                          key={i}
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        >
                          <a
                            href={`/order-details/${key?.toString().split(",")[0]}/`}
                            key={i}
                            onClick={e => {
                              e.stopPropagation();
                            }}
                            style={{
                              color:
                                key?.toString()?.split(",")?.[2]?.trim() === "True"
                                  ? "#ffc000"
                                  : !key ||
                                    key?.toString().split(",")?.[1].includes("None") ||
                                    key?.toString().split(",")?.[1] === " 209" ||
                                    key?.toString().split(",")?.[1] === " US"
                                  ? "black"
                                  : "red",
                            }}
                          >
                            {key?.toString()?.split(",")[0]}
                          </a>
                          {row?.content?.length === i + 1 ? "" : <span>&nbsp; {"|"} &nbsp;</span>}
                        </span>
                      ))}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row?.content.length}</StyledTableCell>
                    <StyledTableCell align="center">
                      {moment.utc(row.shipment_date).local().format("MM-DD-YY HH:mm")}
                    </StyledTableCell>
                    <EditableTableCell
                      align="center"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      {...{
                        row,
                        name: "tracking_number",
                        onChange,
                        trackingNumber: tnFunc(row.tracking_number, row.carrier),
                      }}
                    />
                    {process.env.REACT_APP_IS_DHL_ENABLED === "true" &&
                    (userRole === "admin" ||
                      userRole === "shop_manager" ||
                      userRole === "shop_packer") ? (
                      <StyledTableCell align="center" onClick={e => e.stopPropagation()}>
                        {!row?.is_label ? (
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.print}
                            onClick={() =>
                              printHandler(
                                row.id,
                                process.env.REACT_APP_STORE_NAME === "Yildiz Serisi"
                                  ? "USPS"
                                  : "DHL",
                              )
                            }
                          >
                            <FormattedMessage
                              id="getLabel"
                              defaultMessage={`Get Label ${
                                process.env.REACT_APP_STORE_NAME === "Yildiz Serisi"
                                  ? "USPS"
                                  : "DHL"
                              }`}
                            />
                          </Button>
                        ) : (
                          <a
                            href={`${BASE_URL}media/${
                              process.env.REACT_APP_STORE_NAME === "Yildiz Serisi" ? "usps" : "dhl"
                            }/${row.id}.zip`}
                          >
                            <DownloadFile />
                          </a>
                        )}
                      </StyledTableCell>
                    ) : null}

                    {!isBeyazit && (
                      <StyledTableCell align="center" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={e => handleConfirmModal(e, row.id, "undo")}
                        >
                          <FormattedMessage id="undo" defaultMessage="Undo" />
                        </Button>
                        <br />
                        <br />
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={e => handleConfirmModal(e, row.id, "delete")}
                        >
                          <FormattedMessage id="delete" defaultMessage="Delete" />
                        </Button>
                        <br />
                        <br />
                        <ColorButton
                          variant="contained"
                          size="small"
                          onClick={e => handleConfirmModal(e, row.id, "to_ship")}
                          color="primary"
                        >
                          <FormattedMessage id="to_ship" defaultMessage="to_ship" />
                        </ColorButton>
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        handleConfirm={handleConfirm}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </>
  );
}
