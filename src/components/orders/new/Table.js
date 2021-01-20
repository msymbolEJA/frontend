import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CustomTableCell from "../CustomTableCell";

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
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
}));

function Orders({ list }) {
  const [rows, setRows] = React.useState(list);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  //console.log("rows", rows)

  const onChange = (e, row) => {
    if (!previous[row.temp_id]) {
      setPrevious((state) => ({ ...state, [row.temp_id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { temp_id } = row;
    const newRows = rows.map((row) => {
      if (row.temp_id === temp_id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  React.useEffect(() => {
    // console.log("list_table", list);
    setRows(list);
  }, [list]);

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="caption table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Customer</StyledTableCell>
            <StyledTableCell align="center">Supplier</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Length</StyledTableCell>
            <StyledTableCell align="center">Color</StyledTableCell>
            <StyledTableCell align="center">Qty</StyledTableCell>
            <StyledTableCell align="center">Size</StyledTableCell>
            <StyledTableCell align="center">Start</StyledTableCell>
            <StyledTableCell align="center">Space</StyledTableCell>
            <StyledTableCell align="center">Explanation</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows ? rows.map((row) => (
              <StyledTableRow key={row.temp_id}>
                <CustomTableCell {...{ row, name: "customer", onChange }} />
                <CustomTableCell
                  {...{ row, name: "supplier", onChange }}
                />
                <CustomTableCell {...{ row, name: "type", onChange }} />
                <CustomTableCell {...{ row, name: "length", onChange }} />
                <CustomTableCell {...{ row, name: "color", onChange }} />
                <CustomTableCell
                  {...{ row, name: "qty", onChange }}
                />
                <CustomTableCell {...{ row, name: "size", onChange }} />
                <CustomTableCell {...{ row, name: "start", onChange }} />
                <CustomTableCell {...{ row, name: "space", onChange }} />
                <CustomTableCell {...{ row, name: "explanation", onChange }} />
              </StyledTableRow>
            )) : null }
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Orders;
