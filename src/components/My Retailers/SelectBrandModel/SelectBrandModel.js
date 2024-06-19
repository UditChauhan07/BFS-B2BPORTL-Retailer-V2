import React, { useState } from "react";
import Styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import { CloseButton } from "../../../lib/svg";

const SelectBrandModel = ({ brands, onClose }) => {
  // const [selectedBrandAccountId, setSelectedBrandAccountId] = useState();
  const [selectedBrandManufacturer, setSelectedBrandManufacturer] = useState(false);
  // const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <>
      <div className="px-[68px] pb-[67px] pt-[40px] max-w-[900px]">
        <section>
          <div className="d-flex align-items-center justify-content-end gap-5">
          <button type="button" onClick={onClose}>
              <CloseButton />
            </button>
          </div>
          <h1 className="font-[Montserrat-500] text-[22px] tracking-[2.20px] mb-[20px]">Choose the Manufacturer</h1>
          
          <div className={Styles.BrandInRadio}>
            <div className={Styles.ModalResponsive}>
              {brands?.map((brand, index) => (
                <div className={Styles.BrandName} key={index}>
                  <input
                    type="radio"
                    name="brand_names"
                    // checked={selectedBrandAccountId === brand.AccountId__c}
                    onChange={() => {
                      // setSelectedBrandAccountId(brand.AccountId__c);
                      setSelectedBrandManufacturer(true);
                      localStorage.setItem("manufacturer", brand.ManufacturerName__c|| brand.Name);
                      localStorage.setItem("ManufacturerId__c", brand.ManufacturerId__c||  brand.Id);
                      // if (selectedBrandManufacturer) {
                        navigate(`/product`);
                      // } 
                    }}
                    id={brand.ManufacturerName__c||brand.Name}
                  />
                  <label htmlFor={brand.ManufacturerName__c||brand.Name}>{brand.ManufacturerName__c||brand.Name}</label>
                </div>
              ))}
            </div>

            {/* <div className={Styles.BrandButton}> */}
              {/* <button className={Styles.Button1} onClick={onClose}>
                CANCEL
              </button> */}
              {/* <button
                className={Styles.Button2}
                onClick={() => {
                  if (selectedBrandManufacturer) {
                    navigate(`/product`);
                  } else {
                    setModalOpen(true);
                  }
                }}
              >
                SUBMIT
              </button> */}
            {/* </div> */}
          </div>
        </section>
      </div>
    </>
  );
};

export default SelectBrandModel;
