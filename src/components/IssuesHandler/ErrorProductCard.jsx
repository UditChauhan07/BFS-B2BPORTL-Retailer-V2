import { useEffect } from "react";
import { originAPi } from "../../lib/store"
import LoaderV2 from "../loader/v2"

const ErrorProductCard = ({ Styles1, productErrorHandler, errorList, setProductDetailId, product, productImage, reason, setErrorList, ErrorProductQtyHandler, AccountName = null, readOnly = false }) => {
    return (<tr style={{ borderBottom: '1px solid #ccc', borderBottomLeftRadius: '50px', borderBottomRightRadius: '50px' }}>
        <td style={{ width: '200px', display: 'flex' }} className={Styles1.productImageHolder}>
            {!readOnly && <input type="checkbox" id={product.Id} onChange={() => productErrorHandler(product)} checked={errorList?.[product.Id]?.Id ? true : false} readOnly={readOnly} />}
            {
                !productImage.isLoaded ? <LoaderV2 /> :
                    productImage.images?.[product.ProductCode] ?
                        productImage.images[product.ProductCode]?.ContentDownloadUrl ?
                            <img onClick={() => { setProductDetailId(product?.Product2Id) }} src={productImage.images[product.ProductCode]?.ContentDownloadUrl} className="zoomInEffect" alt="img" />
                            : <img onClick={() => { setProductDetailId(product?.Product2Id) }} src={productImage.images[product.ProductCode]} className="zoomInEffect" alt="img" />
                        : <img onClick={() => { setProductDetailId(product?.Product2Id) }} src={originAPi + "/dummy.png"} className="zoomInEffect" alt="img" />
            }
            <label for={product.Id}>{product.Name.split(AccountName).length ==2 ?product.Name.split(AccountName)[1]:<>{product.Name}<br/><small style={{fontSize:'10px',color:'#ccc'}}>(not contains in order)</small></>}</label></td>
        <td>{product.ProductCode}</td>
        <td>{product?.Quantity??0}</td>
        <td>${parseFloat(product.TotalPrice).toFixed(2)}</td>
        {(reason && reason != "Charges" && errorList?.[product.Id]?.Id) && <td>
            <input type="text" max={product.Quantity} className={Styles1.productErrorQtyHolder} id={`oP${product.Id}`} value1={errorList?.[product.Id]?.issue ? errorList?.[product.Id]?.issue : null} onKeyUp={(e) => {
                if(!Number(e.target.value)){
                    e.target.value = null;
                    ErrorProductQtyHandler(errorList?.[product.Id]?.Id, 0)
                    return;
                }
                ErrorProductQtyHandler(errorList?.[product.Id]?.Id, e.target.value)
            }} readOnly={readOnly} placeholder="Enter Qty"/>
            <br />
            {/* <small style={{ fontSize: '9px' }}>{`Enter ${reason}'s Qty`}</small> */}
            </td>}
    </tr>)
}
export default ErrorProductCard;