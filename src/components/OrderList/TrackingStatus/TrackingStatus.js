import React, { useEffect, useMemo, useState } from 'react'
import Styles from './Styles.module.css'

function TrackingStatus({ data}) {
    var size = 1;
    const [Viewmore, setviewmore] = useState(false);
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
    let cdate = `${currentDate.getDate()} ${months[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;
    useEffect(() => { }, [data])
    return (
        <div>
            <section>
                <div className={Styles.mainTop}>
                    <h2>Tracking Status </h2>
                    <div className={Styles.mainControl}>

                        <div className={Styles.ProtuctInnerBox}>
                            <div className={Styles.BoxBlack}>
                                <div className={Styles.Boxwhite}>
                                    <h1>{data?.ProductCount} <span>Products</span></h1>
                                </div>
                            </div>
                        </div>


                        <div className={Styles.ProtuctInnerBoxPara}>
                            <div className={Styles.ProtuctInnerBoxInner}>
                                <h3> {
                                        data?.OpportunityLineItems?.records.slice(0, size).map((ele) => {
                                            return (
                                                <>

                                                    {Viewmore
                                                        ? ele.Name
                                                        : `${ele.Name.slice(0, 31)}...`}

                                                </>
                                            )
                                        })
                                    }</h3>
                                <p><span className={Styles.Span1}>PO Number :</span>   <span className={Styles.Span2}>{data.PO_Number__c}</span></p>
                                <p><span className={Styles.Span1}>Brand :</span>   <span className={Styles.Span2}>{data.ManufacturerName__c}</span></p>
                                <p><span className={Styles.Span1}>Order Placed :</span>   <span className={Styles.Span2}>{cdate}</span></p>
                                <p><span className={Styles.Span1}>Tracking Id :</span>   <span className={Styles.Span2}>{data.Tracking__c}</span></p>
                                <p><span className={Styles.Span1}>Shipment Method :</span>   <span className={Styles.Span2}>{data.Shipping_method__c}</span></p>

                            </div>

                        </div>

                    </div>

                    <div className={Styles.ShippedBar}>
                        <h3>Tracking Status :  <span>{data.Status__c?data.Status__c: 'Not Shipped'}</span></h3>
                        <div className={Styles.BtnGroup}>
                        {/* button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            <button type="submit" data-bs-dismiss="modal">CANCEL</button>
                            <button>SUBMIT TRACKING STATUS REQUEST </button>

                        </div>

                    </div>


                </div>
            </section>
        </div>


    )
}

export default TrackingStatus