/* eslint-disable array-callback-return */
import React, { useContext, useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SummaryTable from "./SummaryTable";
import { AppContext } from "../../context/Context";
import { useIntl } from "react-intl";
import {
  ListAlt as ListAltIcon,
  LocalShipping as LocalShippingIcon,
  CardGiftcard as CardGiftcardIcon,
} from "@material-ui/icons";

import { getData } from "../../helper/PostData";
import { isLabelStore, sortingArrayAdmin, sortingArrayUser } from "../../helper/Constants";
import FloatingMenu from "./FloatingMenu";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles(() => ({
  root: { marginTop: 20, marginRight: 50, marginLeft: 50 },
  boxes: { flexGrow: 1, position: "relative" },
  icon: { fontSize: 50 },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);
  const { formatMessage } = useIntl();

  const [orderSummary, setOrderSummary] = useState();
  const [workshopDueDates, setWorkshopDueDates] = useState();
  const [shipmentDueDates, setShipmentDueDates] = useState();
  const [lastDateOfOrder, setLastDateOfOrder] = useState();
  const [healthCheck, setHealthCheck] = useState(false);

  const localRole = useMemo(() => localStorage.getItem("localRole"), []);
  const userRole = user?.role || localRole;

  // ------------------------------------------------------
  // ROLE STATUS (useMemo — prevents re-calculation)
  // ------------------------------------------------------
  const newStatu = useMemo(() => {
    if (["admin", "shop_manager", "shop_packer"].includes(localRole)) return "pending";
    if (["workshop_designer", "workshop_designer2"].includes(localRole)) return "in_progress";
    return "awaiting";
  }, [localRole]);

  // ------------------------------------------------------
  // SORTING ARRAY (useMemo — prevents heavy calculations)
  // ------------------------------------------------------
  const currentSortingArray = useMemo(() => {
    const base =
      ["admin", "shop_manager", "shop_packer"].includes(userRole)
        ? [...sortingArrayAdmin]
        : [...sortingArrayUser];

    if (isLabelStore && !base.includes("LABEL")) {
      return [...base.slice(0, 3), "LABEL", ...base.slice(3)];
    }
    return base;
  }, [userRole]);

  // ------------------------------------------------------
  // FETCH ALL DATA IN PARALLEL
  // ------------------------------------------------------
  useEffect(() => {
    Promise.all([
      getData(`${BASE_URL}etsy/summary_order/`),
      getData(`${BASE_URL}etsy/due_dates/`),
      getData(`${BASE_URL}etsy/shipment_due_dates/`),
    ])
      .then(([summary, due, shipment]) => {
        processSummary(summary.data);
        processWorkshop(due.data);
        processShipment(shipment.data);
      })
      .catch(err => console.log("Dashboard load error →", err));
  }, []);

  // ------------------------------------------------------
  // PROCESS SUMMARY ORDER
  // ------------------------------------------------------
  const processSummary = data => {
    if (!data || !Array.isArray(data)) return;

    setLastDateOfOrder(data[2]);

    let etsyCheck = null;
    let shopifyCheck = null;

    // Tek loop → maksimum performans
    for (const item of data) {
      const key = Object.keys(item)[0];
      if (key === "check") etsyCheck = item.check;
      if (key === "check_shopify") shopifyCheck = item.check_shopify;
    }

    // Health check
    if (process.env.REACT_APP_STORE_NAME_ORJ === "Belky") {
      setHealthCheck(etsyCheck);
    } else {
      setHealthCheck(
        shopifyCheck !== null ? shopifyCheck && etsyCheck : etsyCheck
      );
    }

    // Status list
    const statuses = [];

    for (const row of data[0]) {
      statuses.push({
        cell1: row.status.replace("_", " ").replace("-", " ").toUpperCase(),
        cell2: row.status_count,
      });
    }

    // Repeat
    for (const row of data[1]) {
      if (row.is_repeat) statuses.push({ cell1: "REPEAT", cell2: row.status_count });
    }

    // Sorted order
    const sorted = currentSortingArray.map(type => {
      const match = statuses.find(s => s.cell1 === type);
      return match || { cell1: type, cell2: 0 };
    });

    setOrderSummary(sorted.length ? sorted : "noOrders");
  };

  // ------------------------------------------------------
  // PROCESS WORKSHOP DUE DATES
  // ------------------------------------------------------
  const processWorkshop = obj => {
    try {
      const result = [];
      for (const key in obj) {
        if (obj[key].is_late) {
          result.push({ cell1: key, cell2: obj[key].values.length });
        }
      }
      setWorkshopDueDates(result.length ? result : "noOrders");
    } catch {
      setWorkshopDueDates("noOrders");
    }
  };

  // ------------------------------------------------------
  // PROCESS SHIPMENT DUE DATES
  // ------------------------------------------------------
  const processShipment = obj => {
    try {
      const result = [];
      for (const key in obj) {
        if (obj[key].is_late) {
          result.push({ cell1: key, cell2: obj[key].values.length });
        }
      }

      setShipmentDueDates(
        result.length > 10 ? result.slice(-10) : result.length ? result : "noOrders"
      );
    } catch {
      setShipmentDueDates("noOrders");
    }
  };

  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------
  return (
    <div className={classes.root}>
      <div className={classes.boxes}>
        <FloatingMenu lastDateOfOrder={lastDateOfOrder} healthCheck={healthCheck} />

        <Grid container spacing={2} style={{ justifyContent: "center" }}>
          {/* ORDER SUMMARY */}
          <SummaryTable
            title="orders"
            total={0}
            next={`/all-orders?&status=${newStatu}`}
            icon={<ListAltIcon className={classes.icon} color="primary" />}
            header1={formatMessage({ id: "status", defaultMessage: "STATUS" }).toUpperCase()}
            header2={formatMessage({ id: "count", defaultMessage: "COUNT" }).toUpperCase()}
            data={orderSummary}
            lastDateOfOrder={lastDateOfOrder}
          />

          {/* WORKSHOP */}
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

          {/* SHIPMENT — Only managers */}
          {["admin", "shop_manager", "shop_packer"].includes(userRole) && (
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
              data={shipmentDueDates}
            />
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
