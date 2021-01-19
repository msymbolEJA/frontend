import React, {useEffect} from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import DATA from '../../helper/Data'
import { putData, getData } from '../../helper/PostData'
import TableContainer from "@material-ui/core/TableContainer";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    container: {
        maxHeight: "83vh",
    },
    table: {
        minWidth: 650
    },
    selectTableCell: {
        width: 60
    },
    tableCell: {
        width: 130,
        height: 40
    },
    input: {
        width: 100,
        height: 40
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles();
    const { isEditMode } = row;
    return (
        <TableCell align="center" className={classes.tableCell}>
            {isEditMode ? (
                <Input
                    value={row[name] ? row[name] : ""}  // first : value={row[name]} // i've changed
                    name={name}
                    onChange={e => onChange(e, row)}
                    className={classes.input}
                />
            ) : (
                    row[name]
                )}
        </TableCell>
    );
};

function App() {
    const [rows, setRows] = React.useState(DATA);
    const [previous, setPrevious] = React.useState({});
    const classes = useStyles();

    useEffect(() => {
       console.log("test")
       let data = ""
       getData("http://144.202.67.136:8080/etsy/mapping/?limit=10&offset=0", data).then((response) => {
           console.log(response.data.results)
           setRows(response.data.results)
       })
    }, [])

    const onChange = (e, row) => {
        if (!previous[row.id]) {
            setPrevious(state => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = row;
        const newRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setRows(newRows);
    };

    const handleRowClick = (id) => {
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    return { ...row, isEditMode: true };
                }
                return row;
            });
        });
    }

    const handleRowChange = (id) => {
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    console.log(row)
                    putData(`http://144.202.67.136:8080/etsy/mapping/${id}/`, row).then((response) => {
                        console.log(response)
                    }).catch((error) => {
                        console.log(error)
                    })
                    return { ...row, isEditMode: false };
                }
                return row;
            });
        });
    }

    const handleRowKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleRowChange(id)
        }
    }

    const handleRowBlur = (id) => {
        handleRowChange(id)
    }

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table className={classes.table} stickyHeader aria-label="caption table">
                    <caption>A barbone structure table example with a caption</caption>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Recept</StyledTableCell>
                            <StyledTableCell align="center">Id</StyledTableCell>
                            <StyledTableCell align="center">Last Updated</StyledTableCell>
                            <StyledTableCell align="center">Item Index</StyledTableCell>
                            <StyledTableCell align="center">Created Date</StyledTableCell>
                            <StyledTableCell align="center">Buyer</StyledTableCell>
                            <StyledTableCell align="center">Supplier</StyledTableCell>
                            <StyledTableCell align="center">Type</StyledTableCell>
                            <StyledTableCell align="center">Length</StyledTableCell>
                            <StyledTableCell align="center">Color</StyledTableCell>
                            <StyledTableCell align="center">Quantity</StyledTableCell>
                            <StyledTableCell align="center">Size</StyledTableCell>
                            <StyledTableCell align="center">Start</StyledTableCell>
                            <StyledTableCell align="center">Space</StyledTableCell>
                            <StyledTableCell align="center">Explanation</StyledTableCell>
                            <StyledTableCell align="center">Note</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.id} id={row.id}
                                onClick={(e) => handleRowClick(row.id)}
                                onBlur={(e) => handleRowBlur(row.id)}
                                onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                            >
                                <CustomTableCell {...{ row, name: "receipt", onChange }} />
                                <CustomTableCell {...{ row, name: "id", onChange }} />
                                <CustomTableCell {...{ row, name: "last_updated", onChange }} />
                                <CustomTableCell {...{ row, name: "item_index", onChange }} />
                                <CustomTableCell {...{ row, name: "created_date", onChange }} />
                                <CustomTableCell {...{ row, name: "buyer", onChange }} />
                                <CustomTableCell {...{ row, name: "supplier", onChange }} />
                                <CustomTableCell {...{ row, name: "type", onChange }} />
                                <CustomTableCell {...{ row, name: "length", onChange }} />
                                <CustomTableCell {...{ row, name: "color", onChange }} />
                                <CustomTableCell {...{ row, name: "qty", onChange }} />
                                <CustomTableCell {...{ row, name: "size", onChange }} />
                                <CustomTableCell {...{ row, name: "start", onChange }} />
                                <CustomTableCell {...{ row, name: "space", onChange }} />
                                <CustomTableCell {...{ row, name: "explanation", onChange }} />
                                <CustomTableCell {...{ row, name: "note", onChange }} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default App
