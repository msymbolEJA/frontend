import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { FormattedMessage } from "react-intl";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ApexChart = ({ data, title }) => {
  console.log("ApexChart", data);

  const groupedData = {};
  let totalCount = 0;

  data.forEach(item => {
    const { type, count } = item;

    // Farklı veri yapılarına uyumlu: by_type varsa onu kullan, yoksa count'un kendisini
    const countObject = count?.by_type || count || {};
    const itemTotal = Object.values(countObject).reduce(
      (sum, val) => sum + Number(val || 0),
      0
    );

    groupedData[type] = (groupedData[type] || 0) + itemTotal;
    totalCount += itemTotal;
  });

  const sortedData = Object.entries(groupedData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({
      name: `${type} (${count})`,
      y: ((count / totalCount) * 100).toFixed(2),
    }));

  const options = {
    animationEnabled: true,
    data: [
      {
        type: "pie",
        showInLegend: true,
        indexLabel: "{name} - {y}%",
        yValueFormatString: "#0.##'%'",
        dataPoints: sortedData,
      },
    ],
  };

  return (
    <div style={{ marginTop: 40, marginBottom: 20 }}>
      <FormattedMessage id={title} defaultMessage={title} /> {" "}
      {(process.env.REACT_APP_STORE_NAME === "Güneş Serisi" ||
        process.env.REACT_APP_STORE_NAME === "Uludag" ||
        process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
        process.env.REACT_APP_STORE_NAME === "Mina") && ` (${totalCount})`}
      <CanvasJSChart options={options} />
      <style>{`.canvasjs-chart-credit { display: none; }`}</style>
    </div>
  );
};

export default ApexChart;
