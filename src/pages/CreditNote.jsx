import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import Style from "../pages/CreditNote.module.css";
import Loading from "../components/Loading";
import LoadingSmall from "../components/LoadingSmall";
import AppLayout from '../components/AppLayout';
import { FilterItem } from '../components/FilterItem';
import { GetAuthData, getRetailerBrandsList, getCreditNotesList, getManufacturarAmount } from "../lib/store"
import ModalPage from '../components/Modal UI'
import Pagination from "../components/Pagination/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalenderIcon } from "../lib/svg";
let PageSize = 10
const CreditNote = () => {
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <div className={Style.componentDatePicker} onClick={onClick} ref={ref} >
            {value || 'Select Date'}
            <CalenderIcon />
        </div>
    ));
  
    const formentAcmount =(amount,totalorderPrice,monthTotalAmount)=>{
        return `${Number(amount,totalorderPrice,monthTotalAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    let colorClasses = [Style.brandLightBlue, Style.brandLightGreen, Style.brandLightPurple, Style.brandLightBrown];

    let img = 'assets/default-image.png'
    const [userData, setUserData] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadedManufacture, setIsLoadedManufacture] = useState(false)
    const [manufacturerFilter, setManufacturerFilter] = useState()
    const [data, setData] = useState([])
    const [brand, setBrand] = useState({})
    const [currentDate, setCurrentDate] = useState('')
    //.....State for filter Search Start...////
    const [selectedOption, setSelectedOption] = useState('Sort By');
    const [showDropdown, setShowDropdown] = useState(false);
    //.....State for filter Search End...////
    const [selectedOption2, setSelectedOption2] = useState('Transaction');
    const [showDropmenu, setShowDropmenu] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [manufacturarAmount, setManufacturarAmount] = useState([])
    const [manufacturers, setManufacturers] = useState([])

    // Component Modal Function start......//
    const openModal = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    }
    
    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    }
    // Component Modal Function End......//

    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    const [searchFilter, setSearchFilter] = useState('')
    const [createdDateFilter, setCreatedDateFilter] = useState('')
    const [recordStatusFilter, setRecordStatusFilter] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    
    useEffect(() => {
        setIsLoading(true)
        setIsLoadedManufacture(true)
        GetAuthData().then((user) => {
            setUserData(user)

            const raw = {
                accountId : user?.data?.accountId, 
                token : user?.data?.x_access_token
            }

            getRetailerBrandsList(raw).then( async (data) => {
                const result = await data
                // console.log({result})
                setBrand(result)
                setIsLoadedManufacture(false)
            })
            .catch((err) => {
                console.log({ err: err.message })
            })
        }).catch((e) => {
            console.log({ e: e.message })
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        GetAuthData().then((user) => {
            getCreditNotesList(user?.data?.x_access_token, user?.data?.accountId, manufacturerFilter).then((data) => {
                setData(data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log({ err: err.message })
                setIsLoading(false)
            })

            // console.log({user})

            getManufacturarAmount(user.x_access_token, user?.data?.accountId, user.Sales_Rep__c)
                .then((amtData) => {
                    setManufacturarAmount(amtData)
                    setManufacturers(amtData)
                    setIsLoadedManufacture(false)
                })
                .catch((amtErr) => {
                    console.log({ amtErr: amtErr.message })
                    setIsLoadedManufacture(false)
                })
        }).catch((e) => {
            console.log({ e: e.message })
            setIsLoading(false)
        })
    }, [manufacturerFilter])

    const filteredData = useMemo(() => {
        const sortedData = data.filter(item => {
            // console.log(
            //     {
            //         createdDateFilter,
            //         CreatedDate: item.CreatedDate
            //     }
            // )

            const manufacturerMatch = manufacturerFilter ? item.Manufacturer__c === manufacturerFilter : true
            const statusMatch = recordStatusFilter ? item.Used_Status__c === recordStatusFilter : true
            const createdDateMatch = createdDateFilter
            ? isSameDate(new Date(item.CreatedDate), new Date(createdDateFilter))
            : true

            const keywords = searchFilter.split(' ').filter(Boolean)
            const keywordMatch = keywords.length > 0 
                ? keywords.some(keyword => {
                    const lowerCaseKeyword = keyword.toLowerCase();

                    const fieldsToSearch = [
                        item.Manufacturer?.toLowerCase(),
                        item.Wallet_Amount__c?.toString().toLowerCase(),
                        item.CreatedDate ? new Date(item.CreatedDate).toISOString().toLowerCase() : null
                    ]
                    const searchResult = fieldsToSearch.some(fieldValue => fieldValue?.includes(lowerCaseKeyword))

                    return searchResult
                }) 
                : true;  

            return manufacturerMatch && statusMatch && createdDateMatch && keywordMatch;
        })

        if (sortOrder === 'A-Z') {
            sortedData.sort((a, b) => a.Manufacturer?.localeCompare(b.Manufacturer))
        } 
        else if (sortOrder === 'Z-A') {
            sortedData.sort((a, b) => b.Manufacturer?.localeCompare(a.Manufacturer))
        }
        else {
            sortedData.sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate))
        }

        setCurrentPage(1)
        return sortedData 
    }, [ data, manufacturerFilter, recordStatusFilter, createdDateFilter, searchFilter, sortOrder ])

    useEffect(() => {
        let date = new Date()
        setCurrentDate(date)
    }, [])

    const btnHandler = ({ manufacturerId }) => {
        // setIsLoadedManufacture(false)
        setManufacturerFilter(manufacturerId)
    }

    const handleDateChange = (event) => {
        let value = new Date(event)
        setCurrentDate(value)
        setCreatedDateFilter(value)
    }

    //............Calender Function End...........//

    ///...........Function for Filter start.....//
    const handleOptionClick = (option) => {
        setSelectedOption(option)
        setShowDropdown(false)
        setSortOrder(option)
    };
    ///...........Function for Filter start.....//

    const handleMenuClick = (option) => {
        setSelectedOption2(option)
        setShowDropmenu(false)
        let status
        if (option === 'USE') {
            status = 'Used'
        } else if (option === 'AVAILABLE') {
            status = null || 'Un-used'
        } else if (option === 'ALL') {
            status = ''
        } else {
            status = ''
        }
        setRecordStatusFilter(status)
    }

    const handleKeywordChange = (event) => {
        let value = event.target.value
        setSearchFilter(value)
    }

    const convertDate = (isoDate) => {
        const date = new Date(isoDate);
        
        // Get formatted components
        const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
        const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
        const year = date.toLocaleDateString('en-GB', { year: 'numeric' });
    
        // Construct the desired format
        return `${month} ${day}, ${year}`;
    };

    const convertDateTime = (isoDate) => {
        const date = new Date(isoDate);
        
        // Get formatted date components
        const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
        const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
        const year = date.toLocaleDateString('en-GB', { year: 'numeric' });
        
        // Get formatted time components
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        // Construct the desired format
        return `${month} ${day}, ${year} ${hours}:${minutes}`;
    };

    //.........DropDowwn2 Function End......///

    const currentTableData = filteredData.slice(
        (currentPage - 1) * PageSize,
        currentPage * PageSize
    );

    const formatDateToCustomFormat = (dateString) => {
        const date = new Date(dateString);
    
        // Format date with day first
        const optionsDate = { day: '2-digit', month: 'short' };
        const formattedDate = date.toLocaleDateString('en-GB', optionsDate).replace(',', '');
    
        // Format time
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedTime = date.toLocaleTimeString('en-US', optionsTime);
    
        return `${formattedDate} ${formattedTime}`;
    }

    // console.log({manufacturers})

    return (
        <AppLayout
            filterNodes={
                <>
                    <FilterItem
                        minWidth="220px"
                        label="All Manufacturer"
                        name="Manufacturer"
                        value={manufacturerFilter}
                        options={
                            brand && Array.isArray(brand) 
                            ? brand.map((manufacturer) => ({
                                label: manufacturer.Name,
                                value: manufacturer.Id,
                            })) 
                            : []
                        }
                        onChange={(value) => btnHandler({ manufacturerId: value })}
                    />

                </>
            }
        >
            <div className="container p-0 ">
                <div className="row p-0 m-0 d-flex flex-column justify-content-around align-items-center col-12">
                    <div className={Style.backTransaction}>
                        <div>
                            {/* <img src='assets/images/Vector.png' alt='ww' /> */}
                        </div>
                        <div><h1>Transactions</h1></div>
                    </div>

                    { !isLoadedManufacture ? 
                        (
                            <div className={Style.BrandGroup}>
                                {Array.isArray(brand) && brand.length > 0 ? (
                                    brand.map((manufacturer, index) => (
                                        <div key={index} className={`${colorClasses[index % colorClasses.length]} ${Style.brandColorCombi}`}>
                                        <h2>{manufacturer.Name}</h2>
                                        <div className={Style.brandPrice}>
                                            <h5>
                                            ${formentAcmount(Number(manufacturer?.amount).toFixed(2))}
                                            <span> Available bal</span>
                                            </h5>
                                        </div>
                                        </div>
                                    ))
                                ) : (
                                ''
                                )}
                            </div> 
                        ) : (<LoadingSmall className={Style.loaderSmall}  height={"5vh"} />)
                    }

                    <div className={Style.filterMain}>
                        <div className={Style.filterDotedDiv}>
                            <div className={Style.bothFilter}>
                            <div className={Style.filterTransaction}>
                                <div className='search-icon'>
                                    <img src='assets/images/Group235.png' alt='nn' />
                                </div>
                                <div className={Style.inputMain}>
                                    <input 
                                        className={Style.searchInput}
                                        type="text"
                                        placeholder="TYPE TO SEARCH FOR A TRANSACTION"
                                        onKeyUp={handleKeywordChange}
                                    />
                                </div>
                            </div>
                            <div className={Style.filterTransaction2}>

                                <div className={Style.Calendardate}>
                                    <form action="/action_page.php">
                                        <DatePicker selected={currentDate} dateFormat="MMM/dd/yyyy" onChange={handleDateChange} customInput={<ExampleCustomInput />} />
                                    </form>
                                </div>
                                <div className={Style.TransactionDiv} onMouseEnter={() => setShowDropmenu(true)} onMouseLeave={() => setShowDropmenu(false)}>
                                    <div className={Style.Transactionimg}>
                                        <img src='assets/images/Vector(4).png' alt='aa' /></div>

                                    <div className={Style.TransactionDropDown}>
                                        <p >{selectedOption2}</p>
                                        {showDropmenu && (
                                            <ul className={Style.dropdownOptions2}>
                                                <li onClick={() => handleMenuClick('All')}>ALL</li>
                                                <li onClick={() => handleMenuClick('AVAILABLE')}>AVAILABLE</li>
                                                <li onClick={() => handleMenuClick('USE')}>USE</li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                            </div>
                           

                            
                        </div>

                    </div>

                    <div className={Style.productDeatils}>
                        <div className={Style.titleAndFilter}>
                            <div>
                                <h3>Product details</h3>
                            </div>
                            <div className={Style.filterDropDown} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                                <div>
                                    <img src='assets/images/FilterIcon.png' alt='bb' />
                                </div>
                                <div className={Style.customDropdown}>
                                    <span className={Style.FilterHead}>{selectedOption}</span>
                                    <ul className={`${Style.dropdownOptions} ${showDropdown ? '' : Style.dropdownHidden}`}>
                                    <li onClick={() => handleOptionClick('A-Z')}>A-Z</li>
                                    <li onClick={() => handleOptionClick('Z-A')}>Z-A</li>
                                    </ul>
                                </div>
                            </div>
                        </div>


                        {
                                !isLoading ? (
                                    currentTableData.length > 0 ? (
                                        <>
                                            {currentTableData?.map((item, index) => (
                                                <div className={Style.productdata} key={index}>
                                                    <div className={Style.productDataDeatils}>
                                                        {/* <div className={item?.ManufacturerLogo ? Style.ProductImg : Style.DefaultProductImg}>
                                                            <img src={item?.ManufacturerLogo ?? img} alt='img' />
                                                        </div> */}
                                                        <div className={Style.productTitle}>
                                                            <h3>
                                                                {item.Manufacturer} 
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className={Style.pricDeatils}>
                                                        <div className={Style.priceAndDate}>
                                                            {item.Status__c === 'Issued' ? (
                                                                <p className={Style.plusPrice}>
                                                                    +${formentAcmount(Number(item?.Wallet_Amount__c).toFixed(2))}
                                                                </p>
                                                            ) : (
                                                                <p className={Style.minusPrice}>
                                                                    -${formentAcmount(Number(item?.Wallet_Amount__c).toFixed(2))}
                                                                </p>
                                                            )}
                                                            <small>
                                                                {convertDateTime(item.CreatedDate)}
                                                            </small>
                                                        </div>


                                                        <div className={Style.CircleDotGreen}>
                                                            <div className={Style.CircleDotGreenMain}>
                                                            <div className={(item?.Used_Status__c === "Used") ? Style.DotOrange : Style.DotGreen}>
                                                            </div>
                                                            <h5 className={(item?.Used_Status__c === "Used") ? Style.FontColorOrange : Style.FontColorGreen}>{(item?.Used_Status__c === "Used") ? "Use" : "Available"}</h5>
                                                            </div>
                                                        </div>


                                                        <div className={Style.viewBtn}>
                                                            <button 
                                                                onClick={() => openModal(item)}
                                                            >
                                                            View
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* /// credit Modal.....Start */}
                                                    {modalOpen && (
                                                        <ModalPage
                                                            open={modalOpen}
                                                            closeModal={closeModal}
                                                            content={
                                                            <div className="" style={{ width: '75vw' }}>
                                                                <div className="" style={{ minWidth: '75vw' }}>
                                                                    <div className={Style.PoDeatils}>
                                                                        <div className={Style.Ponumber}>PO Number <span>#{selectedItem?.opportunity?.PO_Number__c }</span> </div>
                                                                        <div className={Style.PoDate}><p> Date: <span> { (selectedItem?.opportunity?.CreatedDate) ? convertDate(selectedItem?.opportunity?.CreatedDate) : 'No Date' }</span></p></div>
                                                                    </div>
                                                                    <div className={Style.maincreditAmountDiv}>
                                                                        <div className={Style.CaseDeatils}>
                                                                            <div className={Style.CaseTitle}>
                                                                                <p>
                                                                                    {selectedItem?.Manufacturer} 
                                                                                    {/* | <span>Eau de Parfum</span> */}
                                                                                </p>
                                                                            </div>
                                                                            <div className={Style.CaseNumDeatils}>
                                                                                <p>Case Number
                                                                                    <span> #{selectedItem?.opportunity?.PO_Number__c}</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className={Style.creditAmountDiv}>
                                                                            <div className={Style.creditAmount}>
                                                                                <p>Credit Amount</p>
                                                                            </div>
                                                                            <div 
                                                                                className={(selectedItem?.Status__c === "Refund") ? (Style.creditAmountDetailDebit) : (Style.creditAmountDetail) }
                                                                            >
                                                                                <p>${(selectedItem?.Wallet_Amount__c) ? formentAcmount(Number(selectedItem?.Wallet_Amount__c).toFixed(2)) : ''}</p>
                                                                                <small>
                                                                                    { convertDate(selectedItem?.CreatedDate) }
                                                                                </small>
                                                                            </div>
                                                                        </div>
                                                                        <div className={Style.creditAmountDiv}>
                                                                            <div className={Style.creditAmount}>
                                                                                <p>Order Price</p>
                                                                            </div>
                                                                            <div className={Style.creditAmountDetail2}>
                                                                                <p>${(selectedItem?.opportunity?.Amount) ? formentAcmount(Number(selectedItem?.opportunity?.Amount).toFixed(2)) : ''}</p>
                                                                                <small>
                                                                                    {convertDate(selectedItem?.opportunity?.CreatedDate)}
                                                                                </small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                

                                                                </div>
                                                                
                                                                {(selectedItem.usage && selectedItem.usage.Id != '' )? (
                                                                    <div className="" style={{ minWidth: '75vw' }}>
                                                                        <div className={Style.PoDeatils}>
                                                                            <div className={Style.Ponumber}>PO Number <span>#{selectedItem?.usage?.Po_Number1__c}</span> </div>
                                                                            <div className={Style.PoDate}><p> Date: <span> { convertDate(selectedItem?.usage?.CreatedDate) }</span></p></div>
                                                                        </div>
                                                                        <div className={Style.maincreditAmountDiv}>
                                                                            <div className={Style.CaseDeatils}>
                                                                                <div className={Style.CaseTitle}>
                                                                                    <p>
                                                                                        {selectedItem?.Manufacturer} 
                                                                                    </p>
                                                                                </div>
                                                                                <div className={Style.CaseNumDeatils}>
                                                                                    <p>Case Number
                                                                                        <span> #{selectedItem?.usage?.Po_Number1__c}</span>
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className={Style.creditAmountDiv}>
                                                                                <div className={Style.creditAmount}>
                                                                                    <p>Credit Amount Adjusted </p>
                                                                                </div>
                                                                                <div 
                                                                                    className={(selectedItem?.Status__c === "Refund") ? (Style.creditAmountDetailDebit) : (Style.creditAmountDetail) }
                                                                                >
                                                                                    <p className={Style.AmountRed}>
                                                                                        ${(selectedItem?.usage?.Wallet_Amount__c) ? formentAcmount(Number(selectedItem?.usage?.Wallet_Amount__c).toFixed(2)) : ''}
                                                                                    </p>
                                                                                    <small>
                                                                                        { convertDate(selectedItem?.CreatedDate) }
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                            <div className={Style.creditAmountDiv}>
                                                                                <div className={Style.creditAmount}>
                                                                                    <p>Order Price</p>
                                                                                </div>
                                                                                <div className={Style.creditAmountDetail2}>
                                                                                    <p>${(selectedItem?.usedOrder?.Amount) ? formentAcmount(Number(selectedItem?.usedOrder?.Amount).toFixed(2)) : '' }</p>
                                                                                    <small>
                                                                                        {convertDate(selectedItem?.usedOrder?.CreatedDate)}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : ''}

                                                                <div className={Style.mainbutton}>
                                                                    <div>
                                                                        <button className={Style.CancleBtn} onClick={closeModal}>
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                            }
                                                        />
                                                    )}
                                                    {/* /// credit Modal.... End */}
                                                </div>
                                            ))}
                                            <Pagination
                                                className="pagination-bar"
                                                currentPage={currentPage}
                                                totalCount={filteredData.length}
                                                pageSize={PageSize}
                                                onPageChange={(page) => setCurrentPage(page)}
                                            />
                                        </>
                                    ) : (
                                        <div className={Style.noDataFound}>
                                            <h5>No Data Found</h5>
                                        </div>
                                    )
                                ) : (
                                    <Loading height={"70vh"} />
                                )
                            }

                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreditNote;
