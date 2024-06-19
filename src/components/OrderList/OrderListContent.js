import React, { useEffect, useMemo, useState } from "react";
import Styles from "./style.module.css";
import TrackingStatus from "./TrackingStatus/TrackingStatus";
import Orderstatus from "./OrderStatus/Orderstatus";
import { Link } from "react-router-dom";
import { GetAuthData, supportShare } from "../../lib/store";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../../pages/productDetails";
function OrderListContent({ data,hideDetailedShow=false }) {
  const navigate = useNavigate();
  const [Viewmore, setviewmore] = useState(false);
  const [modalData, setModalData] = useState({});
  const [productDetailId, setProductDetailId] = useState(null)
  const [accountId, setAccountId] = useState();
  const [manufacturerId, setManufacturerId] = useState();
  const currentDate = new Date();
  const months = [
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
  let size = 3;
  const MyBagId = (id) => {
    localStorage.setItem("OpportunityId", JSON.stringify(id));
  };

  const generateSuportHandler = ({ data, value }) => {
    GetAuthData().then((user) => {
      if (user.status == 200) {
        let beg = {
          orderStatusForm: {
            salesRepId: data.OwnerId,
            reason: value,
            contactId: user.data.retailerId,
            accountId: data.AccountId,
            orderNumber: data?.Order_Number__c ?? "Not Available",
            poNumber: data.PO_Number__c,
            manufacturerId: data.ManufacturerId__c,
            invoiceNumber: data.Wholesale_Invoice__c ? data.Wholesale_Invoice__c ?? "Not Available" : "Not Available",
            desc: null,
            opportunityId: data.Id,
            priority: "Medium",
            sendEmail: true,
          },
        };
        // console.log("beg", beg);
        let statusOfSupport = supportShare(beg)
          .then((response) => {
            if (response) navigate("/orderStatusForm");
          })
          .catch((error) => {
            console.error({ error });
          });
      }
    }).catch((userErr) => {
      console.error({ userErr });
    })
  };

  return (
    <>
      {/* TRACKING MODAL */}

      <div
        className="modal fade"
        id="exampleModal1"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-lg">
          <div className={`${Styles.modalContrlWidth} modal-content`}>
            <div className="modal-body  ">
              <TrackingStatus data={modalData} />
            </div>
          </div>
        </div>
      </div>

      {/* ORDER STATUS MODAL */}

      <div
        className="modal fade"
        id="exampleModal2"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-lg">
          <div className={`${Styles.modalContrlWidth} modal-content`}>
            {/* <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div> */}
            <div className="modal-body ">
              <Orderstatus data={modalData} />
            </div>
          </div>
        </div>
      </div>

      {data?.length ? (
        data?.map((item, index) => {
          let date = new Date(item.CreatedDate);
          let cdate = `${date.getDate()} ${months[date.getMonth()]
            } ${date.getFullYear()}`;

          return (
            <div className={` ${Styles.orderStatement}`} key={index}>
              <div>
                <div className={Styles.poNumber}>
                  <div className={Styles.poNumb1}>
                    <h3>PO Number</h3>
                    <p>{item.PO_Number__c}</p>
                  </div>

                  <div className={Styles.poNumb1}>
                    <h3>Brand</h3>
                    <p>{item.ManufacturerName__c}</p>
                  </div>

                  <div className={Styles.PoOrderLast}>
                    <h3>Ship To </h3>
                    <p>{item.AccountName}</p>
                  </div>
                </div>

                <div className={Styles.productDetail}>
                  <div className={Styles.Prod1}>
                    <div className={Styles.ProtuctInnerBox}>
                      <div className={Styles.BoxBlack}>
                        <div className={Styles.Boxwhite}>
                          <h1>
                            {item.ProductCount} <span>Products</span>
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div className={Styles.ProtuctInnerBox1}>
                      <ul>
                        {item.OpportunityLineItems?.records.length > 0 ? (
                          item.OpportunityLineItems?.records
                            .slice(0, size)
                            .map((ele, index) => {
                              return (
                                <>
                                  <li key={index} onClick={() => { setProductDetailId(ele.Product2Id); setAccountId(item.AccountId); setManufacturerId(item.ManufacturerId__c) }} style={{cursor:'pointer'}}>
                                    {Viewmore
                                      ? ele.Name.split(item.AccountName)[1]
                                      : ele.Name.split(item.AccountName)
                                        .length > 1
                                        ? ele.Name.split(item.AccountName)[1]
                                          .length >= 31
                                          ? `${ele.Name.split(
                                            item.AccountName
                                          )[1].substring(0, 28)}...`
                                          : `${ele.Name.split(
                                            item.AccountName
                                          )[1].substring(0, 31)}`
                                        : ele.Name.split(item.AccountName)[0]
                                          .length >= 31
                                          ? `${ele.Name.split(
                                            item.AccountName
                                          )[0].substring(0, 28)}...`
                                          : `${ele.Name.split(
                                            item.AccountName
                                          )[0].substring(0, 31)}`}
                                  </li>
                                </>
                              );
                            })
                        ) : (
                          <p className={Styles.noProductLabel}>No Product</p>
                        )}
                      </ul>
                      <span>
                        <Link to="/orderDetails" className="linkStyling">
                          <button onClick={() => MyBagId(item.Id)}>
                            {item.OpportunityLineItems?.records?.length &&
                              item.OpportunityLineItems?.records?.length > 3 &&
                              `+${item.OpportunityLineItems?.totalSize - 3} More`}
                          </button>
                        </Link>
                      </span>
                    </div>
                  </div>

                  <div className={Styles.totalProductPrice}>
                    <div className={Styles.Margitotal}>
                      <h3>Total</h3>
                      {/* <p>${Number(item.Amount).toFixed(2) - Number(item.Credit_Allocation_Amount__c ? item.Credit_Allocation_Amount__c : 0).toFixed(2)}</p> */}
                      <p>${Number((item.Amount) - (item.Credit_Allocation_Amount__c ? item.Credit_Allocation_Amount__c : 0)).toFixed(2)}</p>
                    </div>
                    <div className={Styles.TicketWidth} style={hideDetailedShow?{display:'none'}:null}>
                      {/* <button className="me-4">View Ticket</button> */}
                      <Link to="/orderDetails">
                        <button onClick={() => MyBagId(item.Id)}>
                          View Order Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={Styles.StatusOrder}>
                  <div className={Styles.Status1}>
                    {/* <h2
                      onClick={(e) =>
                        generateSuportHandler({
                          data: item,
                          value: "Charges",
                        })
                      }
                    >
                      Charges
                    </h2> */}
                    <h3
                      onClick={(e) =>
                        generateSuportHandler({
                          data: item,
                          value: "Status of Order",
                        })
                      }
                    >
                      {" "}
                      Status of Order
                    </h3>
                    <h4
                      onClick={(e) =>
                        generateSuportHandler({
                          data: item,
                          value: "Invoice",
                        })
                      }
                    >
                      Invoice{" "}
                    </h4>
                    <h4
                      onClick={(e) =>
                        generateSuportHandler({
                          data: item,
                          value: "Tracking Status",
                        })
                      }
                    >
                      Tracking Status{" "}
                    </h4>
                  </div>

                  <div className={Styles.Status2}>
                    <h6>
                      Order Placed <span>: {cdate}</span>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">
          No data found
        </div>
      )}
      <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} AccountId={accountId} ManufacturerId={manufacturerId} />
    </>
  );
}

export default OrderListContent;
