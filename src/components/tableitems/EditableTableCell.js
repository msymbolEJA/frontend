import React, { useState, useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import ContentEditable from "react-contenteditable";
import FontPreview from "./FontPreview";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 0,
    width: "100px",

    //minWidth: "100px",
    maxWidth: "100px",
    borderRight: "0.5px solid #E0E0E0",
  },
  input: {
    width: "100px",
    minHeight: "100px",
    background: "transparent",
    resize: "none",
    border: "none",
    wordWrap: "break-word",
  },
  explanationTableCell: {
    padding: 0,
    width: "100px",
    // minHeight: "100px",
    borderRight: "0.5px solid #E0E0E0",
    maxWidth: "300px",
  },
  explanationInput: {
    fontSize: "1rem",
    maxHeight: "100%",
    width: "100%",
    minWidth: "190px",
    maxWidth: "190px",
    //wordWrap: "break-word"
  },
  editable: {
    minHeight: "109px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  allOrdersTableCell: {},
}));

/* <TextareaAutosize aria-label="empty textarea" placeholder="Empty" />
 */

const EditableTableCell = ({ row, name, onChange, from }) => {
  const classes = useStyles();
  const [content, setContent] = useState(
    name === "variation_1_value"
      ? row[name]
          ?.replace(" US women&#039;s letter", "")
          ?.replace(" US women's letter", "") === "2X"
        ? "2XL"
        : row[name]
            ?.replace(" US women&#039;s letter", "")
            ?.replace(" US women's letter", "")
      : row[name]
      ? row[name]
      : ""
  );

  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const handleBlur = useCallback(
    (e) => {
      onChange(e, row.id, name);
    },
    // eslint-disable-next-line
    [onChange, row]
  );

  let expTableCell;

  if (from === "all-orders") {
    expTableCell = classes.allOrdersTableCell;
  } else if (name === "explanation") {
    expTableCell = classes.explanationTableCell;
  } else {
    expTableCell = classes.tableCell;
  }

  const isDanger =
    name === "supplier" ||
    name === "variation_1_name" ||
    name === "variation_2_name" ||
    name === "variation_1_value" ||
    name === "variation_2_value";

  return (
    <TableCell
      align="center"
      className={expTableCell}
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor:
          isDanger &&
          (row[name] === " " || row[name] === "" || row[name] === null)
            ? "#FF9494"
            : null,
      }}
    >
      {name === "qty" && content.includes("FONT") ? (
        <>
          <FontPreview
            id={row.id}
            font={content}
            text={row["personalization"]}
          />
        </>
      ) : null}
      <ContentEditable
        className={classes.editable}
        html={content || ""} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={handleContentChange} // handle innerHTML change
        onBlur={handleBlur} // handle innerHTML change
      />
      {/*   {true ? (
        <TextareaAutosize
          defaultValue={row[name] ? row[name] : ""} // first : value={row[name]} // i've changed
          name={name}
          // onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]?.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")
      )} */}
    </TableCell>
  );
};

export default EditableTableCell;
