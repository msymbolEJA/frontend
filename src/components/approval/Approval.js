import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { putData, getData } from "../../helper/PostData";
import TableContainer from "@material-ui/core/TableContainer";
import TablePaginationActions from "../tableitems/TablePaginationActions";
import CustomCheckbox from "../tableitems/CustomCheckbox";
import OrderStatus from "../tableitems/CustomSelectCell";
import UploadFile from "../tableitems/UploadFile";
import { putImage } from "../../helper/PostData";
import { ToastContainer } from "react-toastify";
import { toastWarnNotify } from "../otheritems/ToastNotify";
import ConstantTableCell from "../tableitems/ConstantTableCell";
import EditableTableCell from "../tableitems/EditableTableCell";
import SortableTableCell from "./SortableTableCell";
import CustomButtonGroup from "./CustomButtonGroup";
import { tagsData } from "../../helper/Constants";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  btnStyle: {
    backgroundColor: "orange",
    borderRadius: "5px",
    width: "6rem",
    cursor: "pointer",
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#f5f5dc",
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function App() {
  const [rows, setRows] = React.useState([]);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = useState(0);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = React.useState("desc");
  const [selectedTag, setSelectedTag] = useState("all orders");
  const [selectedRowId, setSelectedRowId] = useState();
  const [globStatu, setglobStatu] = useState("");
  const [url, setUrl] = useState(
    `http://144.202.67.136:8080/etsy/mapping/?limit=${rowsPerPage}&offset=${
      page * rowsPerPage
    }`
  );

  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, [url, page, rowsPerPage]);

  const getListFunc = () => {
    getData(url)
      .then((response) => {
        setRows(response.data.results);
        setCount(response.data.count);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = order === "asc";
    if (isAsc) {
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }&ordering=${property}`
      );
    } else if (!isAsc) {
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }&ordering=-${property}`
      );
    }
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleChangePage = (event, newPage) => {
    console.log({ order });
    if (order === "asc") {
      console.log("order-desc-newpage");
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          newPage * rowsPerPage
        }&ordering=-${orderBy}`
      );
    } else if (order === "desc") {
      console.log("asc-newpage");
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          newPage * rowsPerPage
        }&ordering=${orderBy}`
      );
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    let rpp = +event.target.value;
    setPage(0);
    setUrl(
      `http://144.202.67.136:8080/etsy/orders/?status=${globStatu}&limit=${rpp}&offset=${
        0 * rpp
      }`
    );
  };

  const handleRowClick = (id) => {
    const currentRow = rows.find((row) => row.id === id);
    if (currentRow) {
      if (!currentRow.isEditMode) {
        const newRows = rows.map((row) => {
          return { ...row, isEditMode: row.id === id };
        });
        setRows(newRows);
      }
    }
  };

  const handleRowChange = (id, data) => {
    putData(`http://144.202.67.136:8080/etsy/mapping/${id}/`, data)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      })
      .finally(() => getListFunc());
  };

  const handleRowKeyDown = (e, id) => {
    if (e.key === "Enter") {
      let data = { [e.target.name]: e.target.defaultValue };
      handleRowChange(id, data);
    }
  };

  const handleRowBlur = (e, id) => {
    let data = { [e.target.name]: e.target.defaultValue };
    handleRowChange(id, data);
  };

  const onCheckboxChange = (e, row) => {
    e.stopPropagation();
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.checked;
    const name = e.target.name;
    const { id } = row;

    if ((name === "approved") & (value === true) & (row.status === "pending")) {
      let data = { [name]: value, status: "awaiting" };
      handleRowChange(id, data);
      getListFunc();
    } else if (
      (name === "approved") &
      (value === false) &
      (row.status === "awaiting")
    ) {
      let data = { [name]: value, status: "pending" };
      handleRowChange(id, data);
      getListFunc();
    } else {
      let data = { [name]: value };
      handleRowChange(id, data);
      getListFunc();
      data = {};
    }

    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onSelectChange = (e, row) => {
    e.preventDefault();
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    if ((name === "status") & (value === "pending") & (row.approved === true)) {
      let data = { [name]: value, approved: false };
      handleRowChange(id, data);
    } else if (
      (name === "status") &
      (value === "awaiting") &
      (row.approved === false)
    ) {
      let data = { [name]: value, approved: true };
      handleRowChange(id, data);
    } else {
      let data = { [name]: value };
      handleRowChange(id, data);
    }
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
    getListFunc();
  };

  const uploadFile = (e, id, imgFile) => {
    e.stopPropagation();
    try {
      let path = `http://144.202.67.136:8080/etsy/mapping/${id}/`;
      putImage(path, imgFile, imgFile.name)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          getListFunc();
        });
    } catch (error) {
      toastWarnNotify("Select Image!");
    }
  };

  const fileSelectedHandler = (e, id) => {
    e.stopPropagation();
    let imgFile = e.target.files[0];
    uploadFile(e, selectedRowId, imgFile);
  };
  const selectId = (event, id) => {
    event.stopPropagation();
    setSelectedRowId(id);
  };

  const approveAll = () => {
    console.log("Approve all");
    getData("http://144.202.67.136:8080/etsy/approved_all/")
      .then((res) => {
        console.log(res);
        toastWarnNotify(res.data.Success);
        getListFunc();
      })
      .catch(({ response }) => {
        console.log(response.data.Failed);
        toastWarnNotify(response.data.Failed);
      });
  };

  const handleTagChange = (e) => {
    const statu = e.currentTarget.id;
    setSelectedTag(statu);
    if (statu === "all orders") {
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`
      );
      setglobStatu("");
    } else {
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&status=${statu}&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`
      );
      setglobStatu(statu);
    }
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <CustomButtonGroup
        selectedTag={selectedTag}
        handleTagChange={handleTagChange}
        tagsData={tagsData}
      />
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="caption table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                Approved
                <button className={classes.btnStyle} onClick={approveAll}>
                  Approve All
                </button>
              </StyledTableCell>
              <SortableTableCell
                property="status"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Status"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="receipt"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Receipt"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="id"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Id"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="last_updated"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Last Updated"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="item_index"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Item Index"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="created_date"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Created Date"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="buyer"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Buyer"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="supplier"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Supplier"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="type"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Type"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="length"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Length"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="color"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Color"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="qty"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Quantity"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="size"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Size"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="start"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Start"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="space"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Space"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="image"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Upload File"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="explanation"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Explanation"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="note"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Note"
                setOrderBy={setOrderBy}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.id}
                id={row.id}
                onClick={(e) => handleRowClick(row.id)}
                onBlur={(e) => handleRowBlur(e, row.id)}
                onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                style={{
                  backgroundColor:
                    (row.status !== "pending") & (row.approved === false)
                      ? "#FF9494"
                      : null,
                }}
              >
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <CustomCheckbox
                    {...{ row, name: "approved", onCheckboxChange }}
                  />
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <OrderStatus {...{ row, name: "status", onSelectChange }} />
                </td>
                <ConstantTableCell {...{ row, name: "receipt" }} />
                <ConstantTableCell {...{ row, name: "id" }} />
                <ConstantTableCell {...{ row, name: "last_updated" }} />
                <ConstantTableCell {...{ row, name: "item_index", onChange }} />
                <ConstantTableCell {...{ row, name: "created_date" }} />
                <ConstantTableCell {...{ row, name: "buyer", onChange }} />
                <EditableTableCell {...{ row, name: "supplier", onChange }} />
                <EditableTableCell {...{ row, name: "type", onChange }} />
                <EditableTableCell {...{ row, name: "length", onChange }} />
                <EditableTableCell {...{ row, name: "color", onChange }} />
                <EditableTableCell {...{ row, name: "qty", onChange }} />
                <EditableTableCell {...{ row, name: "size", onChange }} />
                <EditableTableCell {...{ row, name: "start", onChange }} />
                <EditableTableCell {...{ row, name: "space", onChange }} />
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <UploadFile
                    {...{
                      row,
                      name: "image",
                      uploadFile,
                      fileSelectedHandler,
                      selectId,
                      selectedRowId,
                    }}
                  />
                </td>
                <EditableTableCell
                  {...{ row, name: "explanation", onChange }}
                />
                <EditableTableCell {...{ row, name: "note", onChange }} />
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <td>Total Record :</td>
              <td>{count || 0}</td>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                colSpan={22}
                count={count}
                rowsPerPage={rowsPerPage}
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
    </Paper>
  );
}

export default App;
