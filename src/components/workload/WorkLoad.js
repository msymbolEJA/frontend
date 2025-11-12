import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AppContext } from "../../context/Context";
import { getData } from "../../helper/PostData";
import ApexChart from "./ApexChart";
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles(theme => ({
  top: {
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    // marginTop: 39,
    margin: "auto",
    width: "fit-content",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-evenly",
    alignItems: "center",
    // height: 400,
    fontFamily: "Courier New",
    border: "1px solid lightgrey",
    borderRadius: "5px",
  },
  btn: {
    width: "175px",
    margin: "5px",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    margin: "10px",
    flex: 1
  },
  label: {
    margin: "10px",
    fontSize: "1.5rem",
    width: "max-content"
  },
  header: {
    margin: 10,
    marginTop: 75,
    textAlign: "center",
    fontSize: "2rem",
  },
  getBtnDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  missingTable: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flexDirection: "column",
    marginTop: 20,
  },
  platformBtnWrapper: {
    maxWidth: 600,
    display: "flex",
    flexWrap: "wrap",

    gap: 10,
    borderBottom: "2px solid gray",
    width: "100%",
    justifyContent: "center",
    paddingBottom: 10,
  },
  platformCardWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  filterButtonsWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  uploadButton: {
    display: "inline-block",
    cursor: "pointer",
  },
  boldText: {
    fontWeight: "bold",
  },
  darkTableRow: {
    backgroundColor: theme.palette.grey[100],
  },
  tContainer: {
    marginBottom: theme.spacing(2),
    width: "fit-content",
    margin: "0 auto",
  },
  select: {
    width: "200px !important"
  },

  input: {
    flex: 1,
    width: "100%"
  }
}));

const WorkLoad = () => {
  const { user } = useContext(AppContext);
  const mobileView = useMediaQuery("(max-width:1024px)");

  let localRole = localStorage.getItem("localRole");

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log("Selected option:", selectedOption);
  };



  const classes = useStyles();
  const beginnerDateRef = useRef();
  const endDateRef = useRef();
  const [data, setData] = useState({
    list: [],
    graphData: [],
    isLoading: false,
    isFetched: false,
  });

  const [excelFilter, setExcelFilter] = useState({
    station: "",
    user: ""
  })

  console.log("data", data)

  const { formatMessage } = useIntl();


  /* 
    <Select
                  defaultValue={[]}
                  isMulti
                  name="colors"
                  options={options}
                  className={classes.select}
                />

  */
  const getStatistics = () => {
    setData(prevState => ({ ...prevState, isLoading: true }));
    getData(
      `${BASE_URL}etsy/workflow_istatistic/?start_date=${new Date(beginnerDateRef.current.value)
        ?.toISOString()
        ?.slice(0, 19)}&end_date=${new Date(endDateRef.current.value)
          ?.toISOString()
          ?.slice(0, 19)}`,
    )
      .then(({ data: { istatistic, list } }) => {
        const graphData = Object.entries(istatistic ?? {}).map(([key, value]) => {
          return Object.entries(value).map(([key2, value2]) => {
            return { type: key2, count: value2, title: key };
          });
        });
        setData(prevState => ({
          ...prevState,
          graphData,
          list,
        }));
      })
      .catch(() => {
        // setPlatformsInfo({});
      })
      .finally(() => {
        setData(prevState => ({ ...prevState, isLoading: false, isFetched: true }));
      });
  };

  const handleExcel = () => {
    window.open(
      `${BASE_URL}etsy/export-workflow-history/${(process.env.REACT_APP_STORE_NAME === "Uludag" || process.env.REACT_APP_STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Mina") ? (excelFilter?.user || "ALL") : excelFilter?.user}/?start_date=${new Date(beginnerDateRef.current.value)
        ?.toISOString()
        ?.slice(0, 19)}&end_date=${new Date(endDateRef.current.value)
          ?.toISOString()
          ?.slice(0, 19)}`,
      "_blank",
    );
  }

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    beginnerDateRef.current.value = moment().subtract(1, "months").format("YYYY-MM-DD");
  }, []);

  const handleStationChange = (e, data) => {
    setExcelFilter({
      station: e.target.value,
      user: ""
    })
  }

  const handleUserChange = (e, data) => {
    setExcelFilter({
      ...excelFilter,
      user: e.target.value,
    })
  }

  return (
    <div>
      <h2 className={classes.header}>
        <FormattedMessage id="workload" />
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: mobileView ? "center" : "flex-start",
          justifyContent: "center",
          flexDirection: mobileView ? "column" : "row",
        }}
      >
        <div className={classes.top}>
          <Paper className={classes.paper}>
            <div
              style={{
                display: mobileView ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className={classes.inputs}>
                <label htmlFor="beginnerDate" className={classes.label}>
                  <FormattedMessage id="startDate" defaultMessage="Start Date" />:
                </label>
                (<FormattedMessage id="include" defaultMessage="Include" />)
                <input className={classes.input} ref={beginnerDateRef} type="date" />


              </div>
              <div className={classes.inputs}>
                <label htmlFor="endDate" className={classes.label}>
                  <FormattedMessage id="endDate" defaultMessage="End Date" />:
                </label>
                (<FormattedMessage id="exclude" defaultMessage="Exclude" />)

                <input className={classes.input} ref={endDateRef} type="date" />
              </div>
              <div className={classes.getBtnDiv}>
                <Button
                  variant="contained"
                  className={classes.btn}
                  color="primary"
                  onClick={getStatistics}
                  disabled={data.isLoading}
                >
                  <FormattedMessage id="search" defaultMessage="Calculate Cost" />
                </Button>
              </div>
            </div>

            {/* <select value={"station"}>

              <option value="" disabled selected>
                İstasyon
              </option>

              <option value="cutting">
                <FormattedMessage id="cutting" defaultMessage="Cutting" />
              </option>

              <option value="sewing">
                <FormattedMessage id="sewing" defaultMessage="Sewing" />
              </option>

              <option value="package">
                <FormattedMessage id="package" defaultMessage="package" />
              </option>


            </select> */}
            <div
              style={{
                display: mobileView ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
              }}
            >
              <div className={classes.inputs}>
                <label className={classes.label}>
                  <FormattedMessage id="station" defaultMessage="station" />:
                </label>
                <select name="station" className={classes.input} disabled={!data?.graphData?.length} onChange={handleStationChange} value={excelFilter?.station}>
                  <option value="">{formatMessage({
                    id: "station",
                    defaultMessage: "station",
                  }).toUpperCase()} </option>
                  <option value="KESIM"> {formatMessage({
                    id: "cutting",
                    defaultMessage: "cutting",
                  }).toUpperCase()}</option>
                  <option value="DIKIM">{formatMessage({
                    id: "sewing",
                    defaultMessage: "sewing",
                  }).toUpperCase()}</option>
                  <option value="PAKET">{formatMessage({
                    id: "package",
                    defaultMessage: "package",
                  }).toUpperCase()}</option>
                </select>


              </div>
              <div className={classes.inputs}>
                <label htmlFor="endDate" className={classes.label}>
                  <FormattedMessage id="user" defaultMessage="User" />:
                </label>

                <select className={classes.input} disabled={!excelFilter?.station || !data?.graphData?.length} name="user" onChange={handleUserChange} value={excelFilter?.user}>
                  <option value="" selected> {formatMessage({
                    id: "user",
                    defaultMessage: "User",
                  }).toUpperCase()}
                  </option>

                  {data?.graphData?.flat().filter(item => item?.title === excelFilter?.station).map(item => (
                    <option value={item?.type} ket={item?.type}>{item.type?.toUpperCase()}</option>
                  ))}

                </select>
              </div>
              <div className={classes.getBtnDiv}>
                <Button
                  variant="contained"
                  className={classes.btn}
                  color="secondary"
                  onClick={handleExcel}
                  disabled={data.isLoading}
                >
                  Excel
                </Button>
              </div>
            </div>
          </Paper>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: [...Array(data?.graphData?.length).keys()]
            .map(item => "auto")
            .join(" "),
        }}
      >
        {data?.graphData?.map((item, index) => {
          return (
            <div key={index}>
              <ApexChart data={item} title={item?.[0]?.title} />
            </div>
          );
        })}
      </div>


      {data?.graphData?.[1] ? (
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <TableContainer className={classes.tContainer} component={Paper}>
            <h3 style={{ textAlign: "center", marginTop: 10 }}>
              {beginnerDateRef.current?.value &&
                endDateRef.current?.value &&
                `${new Date(beginnerDateRef.current.value).toLocaleDateString()} - ${new Date(endDateRef.current.value).toLocaleDateString()}`}
            </h3>
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.tableCellHeader}>
                  <TableCell className={classes.boldText} align="center">
                    <FormattedMessage id="person" defaultMessage="Person" />
                  </TableCell>

                  <TableCell className={classes.boldText} align="center">
                    <FormattedMessage id="task_details" defaultMessage="Task Details" />
                  </TableCell>

                  <TableCell className={classes.boldText} align="center">
                    <FormattedMessage id="score" defaultMessage="Score" />
                  </TableCell>

                  <TableCell className={classes.boldText} align="center">
                    <FormattedMessage id="error" defaultMessage="Error" />
                  </TableCell>
                  <TableCell className={classes.boldText} align="center">
                    <FormattedMessage id="performance_score" defaultMessage="Performance Score" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.graphData?.[1]?.map((item, index) => {
                  return (
                    <TableRow
                      className={classes.boldText}
                      key={index}
                    >
                      <TableCell align="center" className={classes.boldText}>
                        {item?.type}
                      </TableCell>
                      <TableCell align="center" className={classes.boldText}>
                        {Object.entries(item?.count?.by_type || {}).map(([key, value]) => (
                          <div key={key}>
                            {key}: {value}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="center" className={classes.boldText}>
                        {item?.count?.puan}
                      </TableCell>
                      <TableCell align="center" className={classes.boldText}>
                        {item?.count?.hata}
                      </TableCell>
                      <TableCell align="center" className={classes.boldText}>
                        {item?.count?.performans}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <h3>
          {" "}
          <FormattedMessage id={"noData"} defaultMessage={"No Data"} />
        </h3>
      )}



      {/* {data?.isFetched ? (
        <>
          {data?.list?.length ? (
            <div
              style={{
                marginTop: "50px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TableContainer className={classes.tContainer} component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableCellHeader}>
                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="person" defaultMessage="Person" />
                      </TableCell>

                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="task_details" defaultMessage="Task Details" />
                      </TableCell>

                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="score" defaultMessage="Score" />
                      </TableCell>

                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="error" defaultMessage="Error" />
                      </TableCell>
                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="performance_score" defaultMessage="Performance Score" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.list?.map((item, skuIndex) => {
                      return (
                        <TableRow
                          className={skuIndex % 2 === 1 ? classes.darkTableRow : null}
                          key={skuIndex}
                        >
                          <TableCell align="center" className={classes.boldText}>
                            {item?.mapping_id}
                          </TableCell>

                          <TableCell align="center" className={classes.boldText}>
                            {item?.mapping}
                          </TableCell>
                          <TableCell align="center" className={classes.boldText}>
                            {item?.station_updated}
                          </TableCell>

                          <TableCell align="center" className={classes.boldText}>
                            {moment.utc(item?.timestamp).local().format("MM-DD-YY HH:mm")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <h3>
              {" "}
              <FormattedMessage id={"noData"} defaultMessage={"No Data"} />
            </h3>
          )}
        </>
      ) : null} */}
    </div>
  );
};

export default WorkLoad;
