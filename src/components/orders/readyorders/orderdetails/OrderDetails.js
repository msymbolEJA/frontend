import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import CustomTableCell from "../CustomTableCell";
import Typography from "@material-ui/core/Typography";
import DATA from "../../../../helper/Data";
import { Button } from "@material-ui/core";
import { getOnePdf, getData } from "../../../../helper/PostData";
import CargoPage from "../../../otheritems/CargoPage";
//import data from "../../../../helper/Data";
import moment from "moment";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  rootBottom: {
    backgroundColor: "lightgrey",
    minHeight: "10vh",
    margin: "5vw",
  },
  container: {
    maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
  },
  table2: {
    maxWidth: 650,
    margin: "auto",
  },
  selectTableCell: {
    width: 60,
  },
  buttonGroup: {
    marginBottom: theme.spacing(1),
  },
  header: {
    fontSize: "1.5rem",
  },
  sub: {
    fontSize: "1rem",
  },
  printSubmit: {
    marginTop: theme.spacing(5),
  },
}));

const OrderDetails = ({ match }) => {
  const [rows, setRows] = useState(DATA);
  const [logs, setLogs] = useState([]);
  const classes = useStyles();

  const getPdf = () => {
    let data = rows.id;
    getOnePdf("http://144.202.67.136:8080/etsy/print_one/", data)
      .then((res) => {
        //console.log(res.data.url);
        const link = document.createElement("a");
        link.href = `${res.data.url}`;
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        //console.log(rows[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let data = "";
    let url = `http://144.202.67.136:8080/etsy/mapping/${match.params.id}/`;
    let urlLogs = `http://144.202.67.136:8080/etsy/dateLogs/${match.params.id}/`;
    //console.log(url)
    getData(url, data)
      .then((res) => {
        //console.log(res.data)
        setRows([res.data]);
      })
      .then(() => {
        getData(urlLogs).then((res) => {
          console.log("res logs:", res);
          setLogs(res.data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [match.params.id]);

  const changeDateFormat = (date) => {
    var date = moment(date);
    var dateComponent = date.utc().format("YYYY-MM-DD");
    var timeComponent = date.utc().format("HH:mm:ss");
    console.log(dateComponent + " " + timeComponent);
    return dateComponent + " " + timeComponent;
  };

  return (
    <div>
      <Paper className={classes.root}>
        <Typography className={classes.header}>Order Details</Typography>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            stickyHeader
            aria-label="sticky table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Receipt Id</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Statu</StyledTableCell>
                <StyledTableCell align="center">System Date</StyledTableCell>
                <StyledTableCell align="center">Buyer</StyledTableCell>
                <StyledTableCell align="center">Supplier</StyledTableCell>
                <StyledTableCell align="center">Type</StyledTableCell>
                <StyledTableCell align="center">length</StyledTableCell>
                <StyledTableCell align="center">Color</StyledTableCell>
                <StyledTableCell align="center">Qty</StyledTableCell>
                <StyledTableCell align="center">size</StyledTableCell>
                <StyledTableCell align="center">start</StyledTableCell>
                <StyledTableCell align="center">explanation</StyledTableCell>
                <StyledTableCell align="center">note</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows ? (
                rows?.map((row) => (
                  <StyledTableRow key={row.id} id={row.id}>
                    <CustomTableCell {...{ row, name: "receipt" }} />
                    <CustomTableCell {...{ row, name: "created_date" }} />
                    <CustomTableCell {...{ row, name: "status" }} />
                    <CustomTableCell {...{ row, name: "creation_tsz" }} />
                    <CustomTableCell {...{ row, name: "buyer" }} />
                    <CustomTableCell {...{ row, name: "supplier" }} />
                    <CustomTableCell {...{ row, name: "type" }} />
                    <CustomTableCell {...{ row, name: "length" }} />
                    <CustomTableCell {...{ row, name: "color" }} />
                    <CustomTableCell {...{ row, name: "qty" }} />
                    <CustomTableCell {...{ row, name: "size" }} />
                    <CustomTableCell {...{ row, name: "start" }} />
                    <CustomTableCell {...{ row, name: "explanation" }} />
                    <CustomTableCell {...{ row, name: "note" }} />
                  </StyledTableRow>
                ))
              ) : (
                <tr>
                  <td colSpan="13" style={{ fontSize: "2rem" }}>
                    "Nothing Found!"
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {rows[0].status === "ready" ? <CargoPage /> : null}
      {rows[0].status === "awaiting" ? (
        <Button
          onClick={getPdf}
          variant="contained"
          color="primary"
          className={classes.printSubmit}
        >
          Print
        </Button>
      ) : null}
      <hr />

      <TableContainer component={Paper}>
        <Table className={classes.table2} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 &&
              logs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {changeDateFormat(log.change_date)}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{`${log.type} => ${log.data}`}</TableCell>
                  <TableCell>{}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderDetails;
