import React from "react";
import Loading from "../Loading";
import styles from "./table.module.css";
const ComparisonReportTable = ({ comparisonData }) => {
  const formentAcmount =(amount,totalorderPrice,monthTotalAmount)=>{
    return `${Number(amount,totalorderPrice,monthTotalAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }
  return (
    <>
      {comparisonData ? (
        <>
          <div className={`d-flex p-3 ${styles.tableBoundary} mb-5 mt-3`}>
            <div className="table-responsive overflow-scroll position-relative" style={{ maxHeight: "73vh", minHeight: "40vh", width: "100vw",  }}>
              <table id="salesReportTable" className="table table-responsive">
                <thead>
                  <tr>
                    <th className={`${styles.th} ${styles.stickyFirstColumnHeading} `} style={{ minWidth: "200px" }}>
                     Brand
                    </th>
                    <th className={`${styles.th}  ${styles.stickyMonth}`} style={{ minWidth: "200px" }}>
                      Estee Lauder Number
                    </th>
                    <th className={`${styles.th} ${styles.stickyMonth}`}> Sales Rep</th>
                    <th className={`${styles.th} ${styles.stickyMonth} `}>Retail Revenue</th>
                    <th className={`${styles.th} ${styles.stickyMonth} `}>Wholesale Amount</th>
                    <th className={`${styles.th} `}></th>
                  </tr>
                </thead>
                {comparisonData?.data?.length ? (
                  <tbody>
                    <>
                      {comparisonData?.data?.map((ele, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td className={`${styles.td} ${styles.stickyFirstColumn}`}>{ele.ManufacturerName__c}</td>
                              <td className={`${styles.td}`}>{ele.Estee_Lauder_Number__c??'NA'} </td>
                              <td className={`${styles.td}`}>{ele.Sales_Rep__c}</td>
                              <td className={`${styles.td}`}>{ele.retail_revenue__c?"$"+formentAcmount(Number(ele.retail_revenue__c).toFixed(2)):'NA'}</td>
                              <td className={`${styles.td}`}>${formentAcmount(Number(ele.Whole_Sales_Amount).toFixed(2))}</td>
                            </tr>
                          </>
                        );
                      })}
                    </>
                  </tbody>
                ) : (
                  <div className="d-flex justify-content-center align-items-center position-absolute top-50 start-50">
                    No data found
                  </div>
                )}
              </table>
            </div>
          </div>
        </>
      ) : (
        <Loading height={"70vh"} />
      )}
    </>
  );
};

export default ComparisonReportTable;
