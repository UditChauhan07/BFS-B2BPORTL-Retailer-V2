import React, { useEffect, useState, useMemo } from "react";
import ProductDetails from "../../pages/productDetails";
import LoaderV2 from "./../loader/v2";
import Styles from "./NewArrivals.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
// import Pagination from "../components/Pagination/Pagination";
import ModalPage from "../Modal UI";
import StylesModal from "../Modal UI/Styles.module.css";
import Pagination from "../Pagination/Pagination";
import Loading from "../Loading";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function NewArrivalsPage({ productList, selectBrand, brand, month, isLoaded, to = null }) {

  const [productDetailId, setProductDetailId] = useState();
  const [modalShow, setModalShow] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadEffect, setEffect] = useState(0)
  // useEffect(() => {
  //   let temp = true;
  //   products.map((month) => {
  //     month.content.map((item) => {
  //       if (!selectBrand || selectBrand == item.brand) {
  //         temp = false;
  //       }
  //     });
  //     setIsEmpty(temp);
  //   });
  // }, [selectBrand]);
  // ...............

  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState([]);
  let PageSize = 10;
  const [pagination, setpagination] = useState([]);

  useEffect(() => {

    if (!filterData || filterData.length === 1) {
      console.error("Product list is empty or undefined.");
      return;
    }

    const startIndex = (currentPage - 1) * PageSize;
    const endIndex = currentPage * PageSize;

    const newValues = filterData?.flatMap((month) => month?.content).slice(startIndex, endIndex);

    setpagination([{ content: newValues }]);

  }, [filterData, PageSize, currentPage]);
  // .................
  useEffect(() => {
    if (loadEffect) setLoaded(true)
    if (!month && !selectBrand) {
      const newValues = productList?.map((months) => {
        const filterData = months.content?.filter((item) => {
          return brand.some((brand) => brand.Name === item.ManufacturerName__c);
        });
        return { ...months, content: filterData, pagination };
      });
      setFilterData(newValues);
      setIsEmpty(false);
    } else {
      let isEmptyFlag = true;
      const newValues = productList?.map((months) => {
        const filterData = months.content?.filter((item) => {
          // let match = item.OCDDate.split("/")
          if (month) {
            if (selectBrand) {
              if (selectBrand == item.ManufacturerName__c) {
                // console.log({aa:item.date.toLowerCase().includes(month.toLowerCase()),})
                return item.date.toLowerCase().includes(month.toLowerCase()) && selectBrand === item.ManufacturerName__c;
              }
            } else {
              return item.date.toLowerCase().includes(month.toLowerCase());
            }
            // return match.includes(month.toUpperCase() )
          } else {
            if (selectBrand) {
              if (selectBrand == item.ManufacturerName__c) {
                return true;
              }
            } else {
              return true;
            }
            // If month is not provided, return all items
          }
        });
        if (filterData?.length > 0) {
          isEmptyFlag = false;
        }
        return { ...months, content: filterData };
      });
      setIsEmpty(isEmptyFlag);
      setFilterData(newValues);
    }
    setEffect(loadEffect + 1)
    setTimeout(() => {
      setLoaded(false)
    }, 500);
  }, [month, selectBrand, productList, brand]);
  // console.log(filterData,"isEmpty")
  // ................
  if (isLoaded) return <Loading height={'70vh'} />
  return (
    <>
      {modalShow ? (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "309px" }}>
                <h1 className={`fs-5 ${StylesModal.ModalHeader}`}>Cart</h1>
                <p className={` ${StylesModal.ModalContent}`}>This product will be available soon. Please check back later</p>
                <div className="d-flex justify-content-center">
                  <button
                    className={`${StylesModal.modalButton}`}
                    onClick={() => {
                      setModalShow(false);
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => {
            setModalShow(false);
          }}
        />
      ) : null}
      <section id="newArrivalsSection">
        <div>
          <div className={Styles.dGrid}>
            {!isEmpty ? (
              pagination?.map((month, index) => {
                if (month.content?.length) {
                  return month.content.map((product) => {
                    if (true) {
                      let listPrice = "$-- . --";
                      if (product?.usdRetail__c) {
                        if (Number(product?.usdRetail__c?.replace("$", ""))) {
                          listPrice = "$" + Number(product?.usdRetail__c?.replace("$", "").replace(",", "")).toFixed(2);
                        } else {
                          listPrice = product?.usdRetail__c
                        }
                      }
                      return (

                        <div className={Styles.cardElement}>
                          {/* {isLoaded ? <img className={Styles.imgHolder} onClick={() => { setProductDetailId(product.Id) }} src={product?.[product.ProductCode]?.ContentDownloadUrl ?? product.image} /> : <LoaderV2 />} */}
                          <div className={` last:mb-0 mb-4 ${Styles.HoverArrow}`}>
                            <div className={` border-[#D0CFCF] flex flex-col gap-4 h-full  ${Styles.ImgHover1}`}>
                              <img src={product.ProductImage ?? "\\assets\\images\\dummy.png"} alt={product.Name} onClick={() => {
                                setProductDetailId(product.Id);
                              }} />
                            </div>
                          </div>
                          <p className={Styles.brandHolder}>{product?.ManufacturerName__c}</p>
                          <p
                            className={Styles.titleHolder}
                            onClick={() => {
                              setProductDetailId(product.Id);
                            }}
                          >
                            {product?.Name?.substring(0, 15)}...
                          </p>
                          <p className={Styles.priceHolder}>{listPrice ?? "-- . --"}</p>
                          {to ? (
                            <Link className={Styles.linkHolder}>
                              <p className={Styles.btnHolder}>
                                add to Cart <small className={Styles.soonHolder}>coming soon</small>
                              </p>
                            </Link>
                          ) : (
                            <div onClick={() => setModalShow(true)} className={Styles.linkHolder}>
                              <p className={Styles.btnHolder}>
                                add to Cart <small className={Styles.soonHolder}>coming soon</small>
                              </p>
                            </div>
                          )}
                        </div>

                      );
                    }
                  });
                }
              })
            ) : (
              <div style={{ fontSize: "20px" }}>No data found</div>
            )}
          </div>
        </div>
        <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} />
      </section>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage || 0}
        totalCount={filterData?.flatMap((month) => month?.content)?.length || 0}
        pageSize={PageSize || 0}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default NewArrivalsPage;