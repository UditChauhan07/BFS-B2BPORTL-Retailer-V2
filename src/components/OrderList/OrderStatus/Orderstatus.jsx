import React, { useEffect, useMemo, useState } from 'react';
import Styles from './Style.module.css'

function Orderstatus({ data }) {
    const [Viewmore, setviewmore] = useState(false);

    useEffect(() => { }, [data])

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
    var size = 1;
    let date = new Date(data.CreatedDate);
    let cdate = `${currentDate.getDate()} ${months[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`;
    return (
        <div>
            <section>
                <div className={Styles.mainTop}>
                    <h2>Order Status </h2>
                    <div className={Styles.mainControl}>
                        <div className={Styles.ProtuctInnerBox}>
                            <div className={Styles.BoxBlack}>
                                <div className={Styles.Boxwhite}>
                                    <h1>{data?.ProductCount}</h1>
                                </div>
                            </div>
                        </div>

                        <div className={Styles.ProtuctInnerBoxPara}>
                            <div className={Styles.ProtuctInnerBoxInner}>
                                <h4>
                                    {
                                        data?.OpportunityLineItems?.records.slice(0, size).map((ele) => {
                                            return (
                                                <>

                                                    {Viewmore
                                                        ? ele.Name
                                                        : `${ele.Name.slice(0, 31)}...`}

                                                </>
                                            )
                                        })
                                    }


                                </h4>
                                <p><span className={Styles.Span1}>PO Number :</span>   <span className={Styles.Span2}>{data.PO_Number__c}</span></p>
                                <p><span className={Styles.Span1}>Brand :</span>   <span className={Styles.Span2}>{data.ManufacturerName__c}</span></p>
                                <p><span className={Styles.Span1}>Order Placed :</span>   <span className={Styles.Span2}>{cdate}</span></p>
                                <p><span className={Styles.Span1}>Order Type :</span>   <span className={Styles.Span2}>{data.Season__c}</span></p>


                            </div>

                        </div>
                    </div>
                    <div className={Styles.ShippedBar}>
                        <h3>Order Status :  <span>{data.Status__c ? data.Status__c : "Order Released"}</span></h3>
                        <div className={Styles.BtnGroup}>
                            <button type="submit" data-bs-dismiss="modal" >CANCEL</button>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Orderstatus;
