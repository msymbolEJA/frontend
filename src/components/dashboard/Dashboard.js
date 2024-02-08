/* eslint-disable array-callback-return */
import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SummaryTable from "./SummaryTable";
import { AppContext } from "../../context/Context";
import { useIntl, FormattedMessage } from "react-intl";
// Icons
import {
  ListAlt as ListAltIcon,
  LocalShipping as LocalShippingIcon,
  CardGiftcard as CardGiftcardIcon,
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";

import { getData } from "../../helper/PostData";
import { sortingArrayAdmin, sortingArrayUser } from "../../helper/Constants";
import FloatingMenu from "./FloatingMenu";
// import CostGetter from "./CostGetter";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PAGE_ROW_NUMBER = process.env.REACT_APP_PAGE_ROW_NUMBER;

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 20,
    marginRight: 50,
    marginLeft: 50,
  },
  boxes: {
    flexGrow: 1,
    position: "relative",
  },
  icon: {
    fontSize: 50,
  },
  button: {
    marginTop: "1rem",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);
  const { formatMessage } = useIntl();
  const [orderSummary, setOrderSummary] = useState();
  const [workshopDueDates, setWorkshopDueDates] = useState();
  const [shipmentDueDates, setShipmentDueDates] = useState();
  const [lastDateOfOrder, setlastDateOfOrder] = useState();
  const [healthCheck, setHealthCheck] = useState(false);

  let localRole = localStorage.getItem("localRole");

  const userRole = user?.role || localRole;

  const getListFunc = () => {
    getData(`${BASE_URL}etsy/summary_order/`).then(response => {
      const newResult = [];
      setlastDateOfOrder(response.data[2]);
      const etsyCheck = response.data.filter(item => Object.keys(item)[0] === "check")?.[0]?.check;

      if (process.env.REACT_APP_STORE_NAME_ORJ === "Belky") {
        setHealthCheck(etsyCheck);
      } else {
        const isShopify = response.data.filter(
          item => Object.keys(item)[0] === "check_shopify",
        )?.length;

        const shopifyCheck = response.data.filter(
          item => Object.keys(item)[0] === "check_shopify",
        )?.[0]?.check_shopify;

        if (isShopify) {
          setHealthCheck(shopifyCheck && etsyCheck);
        } else {
          setHealthCheck(etsyCheck);
        }
      }

      response.data[0].forEach(item => {
        newResult.push({
          cell1: item.status?.replace("_", " ")?.replace("-", " ").toUpperCase(),
          cell2: item.status_count,
        });
      });
      response.data[1].forEach(item => {
        if (item.is_repeat) newResult.push({ cell1: "REPEAT", cell2: item.status_count });
      });

      const currentSortingArray =
        userRole === "admin" || userRole === "shop_manager" || userRole === "shop_packer"
          ? sortingArrayAdmin
          : sortingArrayUser;
      const newResult2 = currentSortingArray.map((object, i) => {
        let currentObject = newResult.find(x => x.cell1 === object);
        if (!currentObject) currentObject = { cell1: object, cell2: 0 };
        return currentObject;
      });
      setOrderSummary(newResult2.length ? newResult2 : "noOrders");
    });
  };

  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getData(`${BASE_URL}etsy/due_dates/`)
      .then(response => {
        const newResult = [];
        const obj = response.data;
        Object.keys(obj).map((key, value) => {
          if (obj[key].is_late) newResult.push({ cell1: key, cell2: obj[key].values.length });
        });
        setWorkshopDueDates(newResult.length ? newResult : "noOrders");
      })
      .catch(err => {
        setWorkshopDueDates("noOrders");
      });
  }, []);

  useEffect(() => {
    getData(`${BASE_URL}etsy/shipment_due_dates/`)
      .then(response => {
        const newResult = [];
        const obj = response.data;
        Object.keys(obj).map((key, value) => {
          if (obj[key].is_late) newResult.push({ cell1: key, cell2: obj[key].values.length });
        });
        setShipmentDueDates(newResult.length ? newResult : "noOrders");
      })
      .catch(err => {
        setShipmentDueDates("noOrders");
      });
  }, []);

  // console.log("localUser", localUser);
  // console.log(localUser === "admin");
  const newStatu =
    localRole === "admin" || localRole === "shop_manager" || localRole === "shop_packer"
      ? "pending"
      : localRole === "workshop_designer" || localRole === "workshop_designer2"
      ? "in_progress"
      : "awaiting";
  // console.log({ localRole });
  // console.log({ newStatu });

  return (
    <div className={classes.root}>
      <div className={classes.boxes}>
        <FloatingMenu lastDateOfOrder={lastDateOfOrder} healthCheck={healthCheck} />
        <Grid container spacing={2} style={{ justifyContent: "center" }}>
          <SummaryTable
            title="orders"
            total={0}
            next={`/all-orders?&status=${newStatu}&limit=${PAGE_ROW_NUMBER}&offset=0`}
            icon={<ListAltIcon className={classes.icon} color="primary" />}
            header1={formatMessage({
              id: "status",
              defaultMessage: "STATUS",
            }).toUpperCase()}
            header2={formatMessage({
              id: "count",
              defaultMessage: "COUNT",
            }).toUpperCase()}
            data={orderSummary}
            lastDateOfOrder={lastDateOfOrder}
          />
          <SummaryTable
            title="behindSchedule"
            total={0}
            next="/workshop-due-dates"
            icon={<LocalShippingIcon className={classes.icon} color="primary" />}
            header1={formatMessage({
              id: "workshopDueDate",
              defaultMessage: "WORKSHOP DUE DATE",
            }).toUpperCase()}
            header2={formatMessage({
              id: "quantity",
              defaultMessage: "QUANTITY",
            }).toUpperCase()}
            data={workshopDueDates}
          />
          {userRole === "admin" || userRole === "shop_manager" || userRole === "shop_packer" ? (
            <SummaryTable
              title="behindOverallSchedule"
              total={0}
              next="/shipment-due-dates"
              icon={<CardGiftcardIcon className={classes.icon} color="primary" />}
              header1={formatMessage({
                id: "shipmentDueDate",
                defaultMessage: "SHIPMENT DUE DATE",
              }).toUpperCase()}
              header2={formatMessage({
                id: "quantity",
                defaultMessage: "QUANTITY",
              }).toUpperCase()}
              data={
                shipmentDueDates?.length > 10
                  ? shipmentDueDates?.slice(Math.max(shipmentDueDates?.length - 10, 0))
                  : shipmentDueDates
              }
            />
          ) : null}
          {/* {userRole === "admin" ? (
            <>
              <CostGetter />
            </>
          ) : null} */}
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
