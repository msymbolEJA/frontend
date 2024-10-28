export const isStoreTextile = process.env.REACT_APP_NON_SKU === "true";

export const tagsDataOther = [
  "pending",
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
  "warehouse",
  "followup",
  "shipped",
];

export const tagsDataLinen = [...tagsDataOther.slice(0, 1), "figma", ...tagsDataOther.slice(1)];

export const tagsData = isStoreTextile ? tagsDataLinen : tagsDataOther;

export const nonAdminTagsData = [
  "awaiting",
  "in_progress",
  "label",
  "ready",
  "in_transit",
  "cancelled",
  "shipped",
];
export const beyazitTagsData = ["awaiting", "in_progress", "ready"];

export const statusDataOther = [
  "pending",
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
  "warehouse",
  "followup",
  "shipped",
];

export const statusDataLinen = [
  ...statusDataOther.slice(0, 1),
  "figma",
  ...statusDataOther.slice(1),
];

export const statusData = isStoreTextile ? statusDataLinen : statusDataOther;

export const USER_TYPE = {
  ADMIN: "admin",
  SHOP_MANAGER: "shop_manager",
  SHOP_PACKER: "shop_packer",
  WORKSHOP_MANAGER: "workshop_manager",
  WORKSHOP_PACKER: "workshop_packer",
};

export const sortingArrayAdminOther = [
  "PENDING",
  "AWAITING",
  "IN PROGRESS",
  "LABEL",
  "READY",
  "IN TRANSIT",
  "WAREHOUSE",
  "FOLLOWUP",
  "SHIPPED",
  "CANCELLED",
];

export const sortingArrayAdminLinen = [
  ...sortingArrayAdminOther.slice(0, 1),
  "FIGMA",
  ...sortingArrayAdminOther.slice(1),
];

export const sortingArrayAdmin = isStoreTextile ? sortingArrayAdminLinen : sortingArrayAdminOther;

export const sortingArrayUser = [
  "PENDING",
  "AWAITING",
  "IN PROGRESS",
  "LABEL",
  "READY",
  "IN TRANSIT",
  "CANCELLED",
  "WAREHOUSE",
  "FOLLOWUP",
];

export const repeatReasons = {
  LETTER_PATTERN_IS_WRONG: "HARF DİZİLİMİ YANLIŞ",
  WRONG_COLOR: "YANLIŞ RENK",
  NEW_COLOR: "YENİ RENK",
  STONE_FALL: "TAŞI DÜŞMÜŞ",
  DIFFERENT_PRODUCT: "FARKLI ÜRÜN",
  NEW_LINE_UP: "YENİ DİZİLİŞ",
  LONG_CHAIN: "ZİNCİR UZUN",
  SHORT_CHAIN: "ZİNCİR KISA",
  DIFFERENT_FONT: "FARKLI FONT",
  DISCOLORATION: "RENK ATMA",
  BREAK_OFF: "KOPMA",
  BROKEN_LOCK: "KİLİT BOZUK",
  LOST_IN_MAIL: "POSTADA KAYIP",
  SECOND: "DİĞER",
};

export const repeatReasonsLinen = {
  SEWING_MISTAKE: "DIKIS HATASI",
  CUSTOMER_SOURCED: "MUSTERI KAYNAKLI",
  MISSING_CUSTOMIZATION: "YANLIS OZELLESTIRME",
  MISSING_INFO: "HATALI BILGI",
  WRONG_COLOR: "HATALI RENK",
  DIFFERENT_PRODUCT: "YANLIS ÜRÜN",
  DISCOLORATION: "RENK ATMA",
  LOST_IN_MAIL: "POSTADA KAYIP",
  SECOND: "DİĞER",
};

export const repeatReasonsMenuItemsLinenia = [
  { id: "SEWING_MISTAKE", name: "SEWING MISTAKE", value: "DIKIS HATASI" },
  {
    id: "CUSTOMER_SOURCED",
    name: "CUSTOMER SOURCED",
    value: "MUSTERI KAYNAKLI",
  },
  {
    id: "MISSING_CUSTOMIZATION",
    name: "MISSING CUSTOMIZATION",
    value: "YANLIS OZELLESTIRME",
  },
  { id: "MISSING_INFO", name: "MISSING INFO", value: "HATALI BILGI" },
  { id: "WRONG_COLOR", name: "WRONG COLOR", value: "HATALI RENK" },
  {
    id: "DIFFERENT_PRODUCT",
    name: "DIFFERENT PRODUCT",
    value: "YANLIS ÜRÜN",
  },
  { id: "DISCOLORATION", name: "DISCOLORATION", value: "RENK ATMA" },
  { id: "LOST_IN_MAIL", name: "LOST IN MAIL", value: "POSTADA KAYIP" },
  { id: "SECOND", name: "SECOND", value: "DİĞER" },
];

export const STORE_BASE_URLS = {
  BELKY: "http://45.76.57.100:8080/",
  SHINY: "http://144.202.67.136:8080/",
  SILVERISTIC: "http://45.32.195.132:8080/",
  SILVERBYSWAN: "http://209.250.229.146:8080/",
  LALYN: "http://37.148.213.60:8080/",
  LILLIAN: "http://185.15.198.109:8080/",
  NEW_SHINY: "http://149.28.251.24:8080/",
  NEW_LALYN: "http://31.169.92.203:8080/",
  LINENIA: "http://155.138.255.69:8080/",
  CHLOE: "http://149.28.100.118:8080/",
};

export const STORE_SERIES = {
  BELKY: "Kalpli Serisi",
  SHINY: "Güneş Serisi",
  SILVERISTIC: "Hilal Serisi",
  SILVERBYSWAN: "Papyon Serisi",
  LALYN: "Ankara Serisi",
  LILLIAN: "Manisa Serisi",
  LINENIA: "Linen Serisi",
  CHLOE: "Anamur Serisi",
};

export const FONTS = {
  Shiny: {
    FONT1: "Hello Honey",
    FONT2: "Alex Brush", //OK
    FONT3: "Blackjack", //OK
    FONT4: "Dynalight", //OK
    FONT5: "",
    FONT6: "Originality Script", //OK
    FONT7: "",
    FONT8: "",
    FONT9: "Auteur Script", //OK
    FONT10: "",
    FONT11: "Fineday", //OK
    FONT12: "Above the Beyond Script", //OK
    FONT13: "Supa Mega Fantastic",
    FONT14: "Notera",
    FONT15: "Great Day",
    FONT16: "Old English Text",
  },
  Silveristic: {
    FONT1: "Alex Brush", //OK
    FONT2: "Brush Script MT", //OK
    FONT3: "Commercial Script MT", //OK
    FONT4: "Elaine Hanks Bold",
    FONT5: "Fabfelt Script Bold", //OK
    FONT6: "Harlow Solid", //OK
    FONT7: "Sofia", //OK
    FONT8: "Old English Text MT", //OK
    FONT9: "Harmonie Script",
    FONT10: "Love Hewits", //OK
  },
  SilverBySwan: {
    FONT1: "Marketing Script", //OK
    FONT2: "Scriptina", //OK
    FONT3: "Pasifico", //OK
  },
};

export const bestSellerColumns = [
  { id: 1, name: "Type", objKey: "type", translate: "type" },
  {
    id: 2,
    name: "Order Count",
    objKey: "order_count",
    translate: "orderCount",
  },
];

export const colorNumberColumns = [
  { id: 1, name: "Type", objKey: "color", translate: "type" },
  {
    id: 2,
    name: "Color Count",
    objKey: "color_count",
    translate: "colorCount",
  },
];

export const updateDetailsMappingTable = [
  { id: 1, name: "Orders Id", objKey: "orders_id", type: "number" },
  // { id: 2, name: "Receipt Id", objKey: "receipt_id", type: "number" },
  { id: 3, name: "Name", objKey: "name", type: "editable" },
  { id: 4, name: "Email", objKey: "buyer_email", type: "editable" },
  { id: 5, name: "First Line", objKey: "first_line" },
  { id: 5, name: "Second Line", objKey: "second_line" },
  { id: 5, name: "City", objKey: "city" },
  { id: 5, name: "State", objKey: "state" },
  { id: 5, name: "Zip", objKey: "zip" },
  { id: 5, name: "Country Id", objKey: "country_id", type: "number" },
  {
    id: 5,
    name: "Shipping Method",
    objKey: "shipping_method",
    type: "dropdown",
    values: [
      { id: 1, name: "Standard", value: "Standard" },
      { id: 2, name: "USPS First-Class Mail", value: "USPS First-Class Mail" },
      { id: 3, name: "Standard Shipping", value: "Standard Shipping" },
      { id: 5, name: "USPS Priority Mail", value: "USPS Priority Mail" },
      { id: 6, name: "Priority", value: "Priority" },
      { id: 7, name: "FirstPackage", value: "FirstPackage" },
      {
        id: 8,
        name: "USPS Priority Mail Express",
        value: "USPS Priority Mail Express",
      },
      { id: 9, name: "GND", value: "GND" },
      { id: 10, name: "EXP", value: "EXP" },
      { id: 11, name: "MAX", value: "MAX" },
      { id: 12, name: "PLT", value: "PLT" },
    ],
  },
  { id: 5, name: "Tracking Code", objKey: "tracking_code", type: "editable" },
  { id: 5, name: "Tracking Url", objKey: "tracking_url", type: "url" },
  { id: 5, name: "Carrier Name", objKey: "carrier_name", type: "text" },
];
