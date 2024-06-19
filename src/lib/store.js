// export const originAPi = "https://b2b.beautyfashionsales.com"
// export const originAPi = "https://dev.beautyfashionsales.com"
// export const originAPi = "http://localhost:3001"

export const originAPi = "https://www.uditchauhan.com"
// export const originAPi = "http://localhost:8010"

let url = `${originAPi}/retailer/`
const orderKey = "orders"
const accountIdKey = "AccountId__c"
const brandIdKey = "ManufacturerId__c"
const brandKey = "Account"
const accountKey = "manufacturer"
const POCount = "woX5MkCSIOlHXkT"
const support = "AP0HBuNwbNnuhKR"
const shareKey = "3a16FWFtoPA5FMC"
// export const originAPi = "https://dev.beautyfashionsales.com"

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ShareDrive(data, remove = false) {
  if (remove) {
    localStorage.removeItem(shareKey);
    return true;
  }
  if (data) {
    localStorage.setItem(shareKey, JSON.stringify(data))
    return true;
  } else {
    let strData = localStorage.getItem(shareKey);
    return JSON.parse(strData);
  }
}

export async function AuthCheck() {
  console.log({ aa: JSON.parse(localStorage.getItem("jAuNW7c6jdi6mg7")) });
  if (JSON.parse(localStorage.getItem("jAuNW7c6jdi6mg7"))) {
    return true
  } else {
    DestoryAuth()
    return false
  }
}

export function formatNumber(num) {
  if (num >= 0 && num < 1000000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M';
  } else if (num < 0) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num;
  }
}

export const sortArrayHandler = (arr, getter, order = 'asc') =>
  arr.sort(
    order === 'desc'
      ? (a, b) => getter(b).localeCompare(getter(a))
      : (a, b) => getter(a).localeCompare(getter(b))
  );

export function POGenerator() {
  let count = parseInt(localStorage.getItem(POCount)) || 1;
  if (count == "NaN") {
    localStorage.setItem(POCount, 1);
    count = 1;
  }
  let date = new Date();
  let currentMonth = padNumber(date.getMonth() + 1, true);
  let currentDate = padNumber(date.getDate(), true);
  let beg = fetchBeg();
  let AcCode = getStrCode(beg?.Account?.name);
  let MaCode = getStrCode(beg?.Manufacturer?.name);

  let orderCount = padNumber(count);
  if (beg?.orderList?.[0]?.productType === "pre-order") return `PRE-${AcCode + MaCode}${currentDate + currentMonth}-${orderCount}`;
  else return `${AcCode + MaCode}${currentDate + currentMonth}-${orderCount}`;
}

export function getStrCode(str) {
  if (!str) return null;
  let codeLength = str.split(" ");
  if (codeLength.length >= 2) {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[1].charAt(0).toUpperCase()}`;
  } else {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[0].charAt(codeLength[0].length - 1).toUpperCase()}`;
  }
}
function padNumber(n, isTwoDigit) {
  if (isTwoDigit) {
    if (n < 10) {
      return "0" + n;
    } else {
      return n;
    }
  } else {
    if (n < 10) {
      return "000" + n;
    } else if (n < 100) {
      return "00" + n;
    } else if (n < 1000) {
      return "0" + n;
    } else {
      return n;
    }
  }
}
export function supportDriveBeg() {
  let supportList = localStorage.getItem(support);
  return JSON.parse(supportList);
}
export async function supportShare(data) {
  localStorage.setItem(support, JSON.stringify(data));
  return true;
}
export function supportClear() {
  localStorage.removeItem(support);
  if (localStorage.getItem(support)) {
    return false;
  } else {
    return true;
  }
}

export function fetchBeg() {
  let orderStr = localStorage.getItem(orderKey);
  let orderDetails = {
    orderList: {},
    Account: {
      name: null,
      id: null,
      address: null,
      shippingMethod: null
    },
    Manufacturer: {
      name: null,
      id: null,
    },
  };
  if (orderStr) {
    let orderList = Object.values(JSON.parse(orderStr));
    if (orderList.length > 0) {
      orderDetails.Account.id = orderList?.[0].account.id;
      orderDetails.Account.name = orderList?.[0].account.name;
      orderDetails.Account.address = JSON.parse(orderList?.[0]?.account?.address);
      orderDetails.Account.shippingMethod = orderList?.[0].account.shippingMethod;
      orderDetails.Manufacturer.id = orderList?.[0].manufacturer.id;
      orderDetails.Manufacturer.name = orderList?.[0].manufacturer.name;
      orderDetails.orderList = orderList;
    }
  }
  return orderDetails;
}


export async function DestoryAuth() {
  localStorage.clear();
  window.location.href = window.location.origin;
  return true;
}

export async function GetAuthData() {
  if (!AuthCheck) {
    DestoryAuth();
  } else {
    return JSON.parse(localStorage.getItem("jAuNW7c6jdi6mg7"))?.data;
  }
}


export async function getOrderofSalesRep({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("salesRepId", user.Sales_Rep__c);

  let response = await fetch(url + "v3/8QUZQtEILKLsFeE", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailsBasedId({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "0DS68FOD7s", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailsInvoice({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "yDJTccwNd7sgrTr", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return { data: data.data, attachment: data.attachedmenetdata };
  }
}


export async function getSupportFormRaw({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("AccountId", rawData.AccountId);

  let response = await fetch(url + "v3/HX0RbhJ3jppDwQX", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getAllAccount({ user }) {
  console.log({ user });
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let body = {
    key: user.x_access_token,
    salesRepId: user.Sales_Rep__c,
  };
  let response = await fetch(originAPi + "v3/fmJJCh9HaL33Iqp", {
    method: "POST",
    headers: headersList,
    body: JSON.stringify(body),
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth()
  } else {
    return data.data;
  }
}

export async function postSupport({ rawData }) {
  console.log({ rawData });
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "jO39qP1LpsBFM5B", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}
export async function uploadFileSupport({ key, supportId, files }) {
  if (files.length) {

    let headersList = {
      "Accept": "*/*", key, supportId
    }
    console.log({ headersList });
    let bodyContent = new FormData();
    files.map((file) => {
      bodyContent.append("files", file.file);
    })
    let response = await fetch(originAPi + "/unCb9Coo4FFqCtG/w72MrdYNHfsSsqe", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    let data = JSON.parse(await response.text());
    if (data) {
      return data.data
    }
  }
}
//retailer
export async function getRetailerBrands({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(originAPi + "/retailer/GQGpen0kmGHGPtx", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({lllllllllllhhhhhh:data})
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getRetailerBrandsNew(rawData) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(originAPi + "/retailer/GQGpen0kmGHGPtx", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  })

  console.log({response})
  
  let res = await response.text()
  let data = JSON.parse(res)
  
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data;
  }
}

export async function getOrderProduct({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/retailer/NDgzTcdHqMCCRFd", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function OrderPlaced({ order }) {
  let orderinit = {
    info: order,
  };
  let headersList = {
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/retailer/XXwo3xQF5CwslB9", {
    method: "POST",
    body: JSON.stringify(orderinit),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 200) {
    localStorage.removeItem(orderKey);
    localStorage.removeItem(accountIdKey);
    localStorage.removeItem(brandIdKey);
    localStorage.removeItem(brandKey);
    localStorage.removeItem(accountKey);
    let lastCount = localStorage.getItem(POCount) || 1;
    localStorage.setItem(POCount, parseInt(+lastCount + 1));
    return data.order;
  } else if (data.status == 300) {
    DestoryAuth();
  } else {
    if (data?.data) {
      return data.data
    } else {
      return false;
    }
  }
}

export async function getOrderList({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("AccountId", user.accountId);
  bodyContent.append("month", month === "last-6-months" ? "" : month);

  let response = await fetch(originAPi + "/retailer/sWNZ2zjgP0prhlI", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderCustomerSupport({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("AccountId", user.accountId);
  bodyContent.append("month", month === "last-6-months" ? "" : month);
  let response = await fetch(originAPi + "/retailer/7Zcldl3YmUOrhmF", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailId({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.opportunity_id);

  let response = await fetch(originAPi + "/retailer/rrIWkEGMzSBJzBg", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}
export async function getDashboardata({ user }) {
  let headersList = {};
  if (user.headers) {
    headersList = user.headers || {};
  } else {
    headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
  }

  let bodyContent = new FormData();
  bodyContent.append("key", user.data.x_access_token);
  bodyContent.append("accountId", user.data.accountId);

  let response = await fetch(url + "38Akka0hdLL8Kyo", {
    // let response = await fetch(url + "v3/3kMMguJj62cyyf0", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportList({ user }) {
  let headersList = {
    Accept: "*/*",
  };
  let bodyContent = new FormData();
  bodyContent.append("key", user?.data?.x_access_token);
  bodyContent.append("accountId", user?.data?.accountId);

  let response = await fetch(url + "XIj26x1E4d2kMKg", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("caseId", rawData.caseId);

  let response = await fetch(url + "DJ2ITqAxnaCY1BA", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getTargetReportAll({ user, year, preOrder }) {
  console.log({ user });
  if (user) {
    let headersList = {
      Accept: "*/*",
    };
    let bodyContent = new FormData();
    bodyContent.append("key", user?.data?.x_access_token);
    bodyContent.append("accountId", user?.data?.accountId);
    if (year) {
      bodyContent.append('year', year);
    }
    if (preOrder) {
      bodyContent.append('preorder', preOrder);
    }
    // console.log({bodyRaw});
    let response = await fetch(originAPi + "/uBUAQkaqEISRPAv/K2uJd7bnERtviUv", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });
    let data = JSON.parse(await response.text());
    console.log({ data });
    if (data.status == 300) {
      DestoryAuth();
    } else {
      let rawRes = { ownerPermission: false, list: data.data }
      return rawRes;
    }
  } else {
    return false
  }
}

export async function postSupportComment({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "fZY7ItyXCLWH4iO", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function postSupportAny({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "pu5OWqfUCR7Onj2", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductImage({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "fdhaszAFw5XNltP", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.url;
  }
}

export async function getProductImageAll({ rawData }) {
  console.log({ rawData });
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  // let response = await fetch(url + "v3/Ftr7xyLKqgFo5MO", {
  let response = await fetch(url + "hm8CnzTBfdfjXLZ", {

    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "dLobBeDavajtlNa", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getProductList({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "NDgzTcdHqMCCRFd", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function topProduct({ month, manufacturerId, accountId }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "IParlpz6lDE6kfU", {
    method: "POST",
    body: JSON.stringify({ month, manufacturerId, accountId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getSessionStatus({ key, retailerId }) {

  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  console.log({ key, retailerId })
  let response = await fetch(url + "v3/VQzxx7VoZqQrVKe", {
    method: "POST",
    body: JSON.stringify({ key, retailerId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function getMarketingCalendar({ key, manufacturerId }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/beauty/v3/eVC3IaiEEz3x7ym", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data;
  }
}

export async function getOrderDetailsPdf({ key, opportunity_id }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/0DS68FOD7s", {
    method: "POST",
    body: JSON.stringify({ key, opportunity_id }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDF({ key, manufacturerId, month, manufacturerStr }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/Finmh4OvrI0Yc46", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month, manufacturerStr }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDFV2({ key, manufacturerId, month, manufacturerStr }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/Y6C9n4OZMqRdhvr", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month, manufacturerStr }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({ data });
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getMarketingCalendarPDFV3({ key, manufacturerId, month, manufacturerStr }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(originAPi + "/mIRX7B9FlQjmOaf/H893PuzIaG1miIo", {
    method: "POST",
    body: JSON.stringify({ key, manufacturerId, month, manufacturerStr }),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.file || false;
  }
}

export async function getCreditNotes(key, retailer, manufacturer) {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    key : key
  }

  let response = await fetch(originAPi + "/test/applyCreditNotes", {
    method: "POST",
    body: JSON.stringify({ retailer, manufacturer }),
    headers: headersList,
  })
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth()
  } else {
    console.log({dataResult : data?.result})
    return data?.result
  }
}

export async function getCreditNotesList(key, retailer='', manufacturer='') {
  console.log({key, retailer, manufacturer})
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    key : key
  }

  let response = await fetch(originAPi + "/test/creditNotes", {
    method: "POST",
    body: JSON.stringify({ retailer: retailer, manufacturer: manufacturer }),
    headers: headersList,
  })

  let data = JSON.parse(await response.text())

  if (data.status == 300) {
    DestoryAuth()
  } else {
    console.log({ dataResult : data?.data?.records })
    return data?.data?.records
  }
}

export const hexabrand = {
  a0O3b00000hym7GEAQ: "#38A3A5",
  a0O3b00000fQrZyEAK: "#9EC1DA",
  a0O1O00000XYBvQUAX: "#f6b6ad",
  a0O3b00000pY2vqEAC: "#ffe3d5",
  a0O3b00000p80IJEAY: "#fff9ed",
  a0O3b00000lCFmREAW: "#a6a0d4",
  a0ORb000000BQ0nMAG: "#206BA1",
  a0O3b00000p7zqKEAQ: "#BEE6DC",
  a0O3b00000ffNzbEAE: "#A66C98",
  a0O3b00000p4F4DEAU: "#6D597A",
  a0O3b00000p4F4CEAU: "#CBA188",
  a0ORb0000000uwfMAA: "#EFD6B1",
  a0O3b00000p4F4HEAU: "#D9D9D9",
  a0ORb000000QzsfMAC: "#B7C8B3",
  a0O1O00000XYBvkUAH: "#6D243E",
  a0O1O00000XYBvaUAH: "#4B95DD",
  a0ORb000000nDfFMAU: "#073763",
  a0ORb000000nDIiMAM: "#7f6000"
};

export const hexabrandText = {
  a0O3b00000hym7GEAQ: "#ffffff",
  a0O3b00000fQrZyEAK: "#2a516d",
  a0O1O00000XYBvQUAX: "#972111",
  a0O3b00000pY2vqEAC: "#bb3e00",
  a0O3b00000p80IJEAY: "#c58300",
  a0O3b00000lCFmREAW: "#352e66",
  a0ORb000000BQ0nMAG: "#0d2b40",
  a0O3b00000p7zqKEAQ: "#2f7967",
  a0O3b00000ffNzbEAE: "#EEDD82",
  a0O3b00000p4F4DEAU: "#ffffff",
  a0O3b00000p4F4CEAU: "#5e3d29",
  a0ORb0000000uwfMAA: "#8a5e1c",
  a0O3b00000p4F4HEAU: "#575757",
  a0ORb000000QzsfMAC: "#445840",
  a0O1O00000XYBvkUAH: "#ffffff",
  a0O1O00000XYBvaUAH: "#ffffff",
  a0ORb000000nDfFMAU: "#deb887",
  a0ORb000000nDIiMAM: "#deb887"
};


export function DateConvert(dateString) {
  if (dateString) {
    const [year, month, day] = dateString.split(/[-/]/);
    if (day && month && year) {
      let parsedDate = new Date(`${month}/${day}/${year}`);
      if (!isNaN(parsedDate.getTime())) {
        const options = { day: "numeric", month: "short", year: "numeric" };
        let launchDateFormattedDate = new Intl.DateTimeFormat("en-US", options).format(new Date(parsedDate));
        return launchDateFormattedDate;
      }
    }
    // throw new Error("Invalid date string");
  }
}
