import React, { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import Loading from "../../components/Loading";
import ComparisonReportTable from "../../components/comparison report table/ComparisonReportTable";
import { useComparisonReport } from "../../api/useComparisonReport";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { FilterItem } from "../../components/FilterItem";
import { MdOutlineDownload } from "react-icons/md";
import ModalPage from "../../components/Modal UI";
import styles from "../../components/Modal UI/Styles.module.css";
import { CloseButton, SearchIcon } from "../../lib/svg";
import { GetAuthData, getRetailerBrands, sortArrayHandler } from "../../lib/store";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
const date = new Date();
const ComparisonReport = () => {
  const [exportToExcelState, setExportToExcelState] = useState(false);

  const initialValues = {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    AccountId__c: null
  };
  const [filter, setFilter] = useState(initialValues);
  const originalApiData = useComparisonReport();
  const [apiData, setApiData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [userData,setUserData] = useState({});
  sortArrayHandler(apiData?.data||[],g=>g.ManufacturerName__c)
  //csv Data
  let csvData = [];
  if (apiData?.data?.length) {
    apiData?.data?.map((ele) => {
      return csvData.push({
        Brand: ele.ManufacturerName__c,
        "Estee Lauder Number": ele.Estee_Lauder_Number__c,
        "Sales Rep": ele.Sales_Rep__c,
        "Retail Revenue": `$${Number(ele.retail_revenue__c).toFixed(2)}`,
        "Wholesale Amount": `$${Number(ele.Whole_Sales_Amount).toFixed(2)}`,
      });
    });
  }
  useEffect(() => {
    GetAuthData().then((user) => {
      setUserData(user)
      filter.AccountId__c = user.data.accountId
      sendApiCall();
    }).catch((userErr) => {
      console.log({ userErr });
    })
  }, []);

  const handleExportToExcel = () => {
    setExportToExcelState(true);
  };
  const exportToExcel = () => {
    setExportToExcelState(false);
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `Comparison Report ${new Date().toDateString()}` + fileExtension);
  };
  const resetFilter = async () => {
    setIsLoading(true);
      initialValues.AccountId__c = userData?.data?.accountId
      const result = await originalApiData.fetchComparisonReportAPI(initialValues);
    setApiData(result);
    setFilter(() => initialValues);
    setIsLoading(false);
  };
  const sendApiCall = async () => {
    setIsLoading(true);
    const result = await originalApiData.fetchComparisonReportAPI(filter);
    setApiData(result);
    setIsLoading(false);
  };
  return (
    <AppLayout
      filterNodes={
        <>
          {/* <FilterItem
            minWidth="220px"
            label="All Manufacturers"
            name="All-Manufacturers"
            value={filter.ManufacturerId__c}
            options={manufacturers?.map((manufacturer) => ({
              label: manufacturer.Name,
              value: manufacturer.Id,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, ManufacturerId__c: value }))}
          /> */}
          <FilterItem
            minWidth="220px"
            label="Months"
            name="Months"
            value={filter.month}
            options={apiData?.date?.monthList?.map((month) => ({
              label: month?.name,
              value: month.value,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, month: value }))}
          />
          <FilterItem
            minWidth="220px"
            label="Year"
            name="Year"
            value={filter.year}
            options={apiData?.date?.yearList?.map((year) => ({
              label: year?.name,
              value: year.value,
            }))}
            onChange={(value) => setFilter((prev) => ({ ...prev, year: value }))}
          />
          <div className="d-flex gap-3">
            <button className="border px-2 d-grid py-1 leading-tight" onClick={sendApiCall}>
              <SearchIcon fill="#fff" width={20} height={20} />
              <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>search</small>
            </button>
            <button className="border px-2 d-grid py-1 leading-tight" onClick={resetFilter}>
              <CloseButton crossFill={'#fff'} height={20} width={20} />
              <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>clear</small>
            </button>
          </div>
          <button className="border px-2 d-grid py-1 leading-tight d-grid" onClick={handleExportToExcel}>
            <MdOutlineDownload size={16} className="m-auto" />
            <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>export</small>
          </button>
        </>
      }
    >
      {exportToExcelState && (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "380px" }}>
                <h1 className={`fs-5 ${styles.ModalHeader}`}>Warning</h1>
                <p className={` ${styles.ModalContent}`}>Do you want to download Comparison Report?</p>
                <div className="d-flex justify-content-center gap-3 ">
                  <button className={`${styles.modalButton}`} onClick={exportToExcel}>
                    OK
                  </button>
                  <button className={`${styles.modalButton}`} onClick={() => setExportToExcelState(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => {
            setExportToExcelState(false);
          }}
        />
      )}
      {!isLoading ? <ComparisonReportTable comparisonData={apiData} /> : <Loading height={"70vh"} />}
    </AppLayout>
  );
};

export default ComparisonReport;
