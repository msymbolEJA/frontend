import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { statusData } from "../../helper/Constants";
import { useIntl } from "react-intl";

const NON_SKU = process.env.REACT_APP_NON_SKU === "true";

const useStyles = makeStyles(theme => ({
  opt: {
    fontSize: "0.9rem",
    width: "100px",
    backgroundColor: "transparent",
    borderColor: "#E0E0E0",
  },
}));

const OrderStatus = ({ row, name, onSelectChange }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();

  let localRole = localStorage.getItem("localRole");

  let disabledForReadyNProgress =
    !localRole?.includes("workshop") &&
    process.env.REACT_APP_STORE_NAME !== "Kalpli Serisi" &&
    process.env.REACT_APP_STORE_NAME_ORJ !== "Silveristic" &&
    !NON_SKU &&
    (row[name] === "in_progress" || row[name] === "ready");

  const canShopManagerUpdate = item =>
    localRole === "shop_manager" ? ["pending", "awaiting"].includes(item) : true;

  // console.log("disabledForReadyNProgress", disabledForReadyNProgress)

  return (
    <div>
      <select
        className={classes.opt}
        id={name}
        value={row[name]}
        // disabled={false}
        /*     disabled={
          localRole?.includes("workshop")
            ? true
            : NON_SKU
            ? !(
                (!!row?.variation_1_value && !!row?.variation_2_value)
                // &&
                // !!row?.variation_1_name &&
                // !!row?.variation_2_name
              )
            : !(!!row.supplier && !!row.type && !!row.color && !!row.length)
          //   ||
          // row[name] === "in_progress" ||
          // row[name] === "ready"
        } */
        name={name}
        onChange={e => onSelectChange(e, row)}
        onClick={e => e.stopPropagation()}
      >
        <optgroup>
          {statusData.map((item, index) => (
            <option
              key={`${index}+${item}`}
              value={item}
              disabled={disabledForReadyNProgress || !canShopManagerUpdate(item)}
            >
              {formatMessage({
                id: item === "awaiting" ? "approved" : item,
                defaultMessage: item === "awaiting" ? "APPROVED" : item,
              })}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

export default OrderStatus;
