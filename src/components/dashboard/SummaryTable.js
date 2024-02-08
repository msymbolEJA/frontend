import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/Context";

import {
  Paper,
  Grid,
  Table,
  // Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";

const PAGE_ROW_NUMBER = process.env.REACT_APP_PAGE_ROW_NUMBER;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 15,
    maxWidth: "330px",
  },
  table: {
    minWidth: 150,
  },
  tableRow: {
    cursor: "pointer",
    "&:nth-of-type(odd)": {
      backgroundColor: "#efefef",
    },
    "&:hover": {
      background: "#e2f1e5",
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    //width: "42rem",
  },
  icon: {
    fontSize: 40,
    display: "inline",
  },
  button: {
    height: "2rem ",
    minWidth: "8rem",
  },
  titleStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#add8e6",
      borderRadius: "0.5rem 0.5rem 0 0",
      fontSize: "1.1rem",
      transition: "0.5s",
    },
    minHeight: "6rem",
  },
}));

export default function SummaryTable({
  title,
  next,
  icon,
  header1,
  header2,
  data,
  lastDateOfOrder,
}) {
  const { user } = useContext(AppContext);
  let localRole = localStorage.getItem("localRole");

  const userRole = user?.role || localRole;
  let total =
    (data !== "noOrders" &&
      data?.length > 0 &&
      data.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.cell2;
      }, 0)) ||
    0;

  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    history.push(next);
  };

  return (
    <Grid item xs={12} md={6} className={classes.root}>
      <Paper className={classes.paper} onClick={title === "orders" ? null : handleClick}>
        <div className={classes.titleStyle} onClick={e => handleClick(e)}>
          {icon}
          <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>
            <FormattedMessage id={title} defaultMessage={title} /> ({total})
          </h3>
        </div>
        <div>
          <Table className={classes.table}>
            <TableHead style={{ backgroundColor: "rgb(100, 149, 237)" }}>
              <TableRow>
                <TableCell align="left" style={{ color: "white" }}>
                  {header1}
                </TableCell>
                <TableCell align="right" style={{ color: "white" }}>
                  {header2}
                </TableCell>
              </TableRow>
            </TableHead>
            {data?.length ? (
              <TableBody>
                {data === "noOrders" ? (
                  <TableRow>
                    <TableCell colSpan="2" align="center" component="th" scope="row">
                      <FormattedMessage
                        id="everythingOnSchedule"
                        defaultMessage="EVERYTHING IS ON SCHEDULE"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow
                      key={index}
                      className={classes.tableRow}
                      onClick={() =>
                        title === "orders"
                          ? history.push(
                              `/all-orders?&status=${item.cell1
                                .toLowerCase()
                                .replace(" ", "_")}&limit=${PAGE_ROW_NUMBER}&offset=0`,
                            )
                          : null
                      }
                    >
                      <TableCell align="left" component="th" scope="row">
                        {title === "orders" ? (
                          <FormattedMessage
                            id={
                              item.cell1.toLowerCase() === "awaiting"
                                ? "approved"
                                : item.cell1.toLowerCase()
                            }
                            defaultMessage={
                              item.cell1.toLowerCase() === "awaiting" ? "APPROVED" : item.cell1
                            }
                          />
                        ) : (
                          item.cell1
                        )}
                      </TableCell>
                      <TableCell align="right">{item.cell2}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="2" style={{ display: "table-cell" }}>
                    <CircularProgress style={{ marginTop: "1rem", marginBottom: "1rem" }} />
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </Paper>
    </Grid>
  );
}
