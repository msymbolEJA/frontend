import { useState } from "react";
import Table from "./Table";
import Form from "./Form";
import { postFormData } from "../../../helper/PostData";
import useFetch from "../../../helper/useFetch";
import { toastSuccessNotify } from "../../otheritems/ToastNotify";

const STORE_NAME = process.env.REACT_APP_STORE_NAME;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialValue = {
  customer: "",
  supplier:
    STORE_NAME === "Linen Serisi" ||
    STORE_NAME === "Kadife-1" ||
    STORE_NAME === "Mina" ||
    STORE_NAME === "Güneş Tekstil"
      ? "umraniye"
      : "asya",
  type: "",
  length: "",
  color: "",
  qty: "",
  size: "",
  start: "",
  space: "",
  explanation: "",
  shop: "",
};

function NewOrder() {
  const [list, setList] = useState("");
  const [info, setInfo] = useState(initialValue);
  const { response } = useFetch(`etsy/typleList/`);

  const handleSubmit = e => {
    e.preventDefault();

    const infoCopy = { ...info };

    if (STORE_NAME !== "Yildiz Serisi") {
      delete infoCopy.shop;
    }

    postFormData(`${BASE_URL}etsy/manuel_orders/`, infoCopy)
      .then(data => {
        // console.log(data.data.response);
        toastSuccessNotify(data.data.response);
      })
      .catch(error => {
        console.log(error);
      });

    setList([
      ...list,
      {
        temp_id: new Date().getTime(),
        ...info,
      },
    ]);
    setInfo(initialValue);
  };
  const handleChange = e => {
    // console.log(info);
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <div className="App" style={{ marginTop: 40 }}>
      <Form
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        info={info}
        typeOptions={response?.results || []}
      />
      <Table list={list} />
    </div>
  );
}

export default NewOrder;
