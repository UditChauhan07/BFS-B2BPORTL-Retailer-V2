import { ErrorMessage, Field, Form, Formik } from "formik";
import TextError from "../../validation schema/TextError";
import Select from "react-select";
import styles from "../OrderStatusFormSection/style.module.css";
import { AccountInfoValidation } from "../../validation schema/AccountInfoValidation";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { uploadFileSupport } from "../../lib/store";
import Loading from "../Loading";
import { BiUpload } from "react-icons/bi";
import ModalPage from "../Modal UI";
const AccountInfo = ({ reason, Accounts, postSupportAny, GetAuthData, dSalesRepId, setSubmitForm }) => {
    const navigate = useNavigate();
    const [confirm, setConfirm] = useState(false);
    const initialValues = {
        description: "",
        account: null
    };
    let [files, setFile] = useState([])
    function handleChange(e) {
        let tempFile = [...files];
        let reqfiles = e.target.files;
        if (reqfiles) {
            if (reqfiles.length > 0) {
                Object.keys(reqfiles).map((index) => {
                    let url = URL.createObjectURL(reqfiles[index])
                    if (url) {
                        tempFile.push({ preview: url, file: reqfiles[index] });
                    }
                    // this thoughing me Failed to execute 'createObjectURL' on 'URL': Overload resolution failed?
                })
            }
        }
        setFile(tempFile);
    }
    const fileRemoveHandler = (index) => {
        let tempFile = [...files];
        tempFile.splice(index, 1)
        setFile(tempFile);
    }
    const onSubmitHandler = (values) => {
        setSubmitForm(true)
        let subject = `Customer Service for ${reason}`;
        GetAuthData()
            .then((user) => {
                if (user) {
                    let rawData = {
                        orderStatusForm: {
                            typeId: "0123b0000007z9pAAA",
                            reason: reason,
                            contactId: user.data.retailerId,
                            salesRepId: dSalesRepId,
                            accountId: user.data.accountId,
                            desc: values.description,
                            priority: "Medium",
                            subject,
                        },
                        key: user.data.x_access_token,
                    };
                    postSupportAny({ rawData })
                        .then((response) => {
                            if (response) {
                                if (response) {
                                    if (files.length > 0) {
                                        uploadFileSupport({ key: user?.data?.x_access_token, supportId: response, files }).then((fileUploader) => {
                                            if (fileUploader) {
                                                setSubmitForm(false)
                                                navigate("/CustomerSupportDetails?id=" + response);
                                            }
                                        }).catch((fileErr) => {
                                            setSubmitForm(false)
                                            console.log({ fileErr });
                                        })
                                    } else {
                                        setSubmitForm(false)
                                        navigate("/CustomerSupportDetails?id=" + response);
                                    }
                                }
                            }
                        })
                        .catch((err) => {
                            console.error({ err });
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <Formik initialValues={initialValues} validationSchema={AccountInfoValidation} onSubmit={onSubmitHandler}>
            {(formProps) => (
                <div className={styles.container}>
                    <ModalPage
                        open={confirm}
                        content={
                            <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                                <h2 >Please Confirm</h2>
                                <p style={{ lineHeight: '22px' }}>
                                    Are you sure you want to save?
                                </p>
                                <div className="d-flex justify-content-around ">
                                    <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => { onSubmitHandler() }}>
                                        Yes
                                    </button>
                                    <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setConfirm(false)}>
                                        No
                                    </button>
                                </div>
                            </div>
                        }
                        onClose={() => {
                            setConfirm(false);
                        }}
                    />
                    <Form className={styles.formContainer}>
                        <b className={styles.containerTitle}>Customer Service : {reason}</b>
                        <label className={styles.labelHolder}>
                            Describe your details that want to update
                            <Field component="textarea" placeholder="Description" rows={4} name="description" defaultValue={initialValues.description}></Field>
                        </label>
                        <ErrorMessage component={TextError} name="description" />
                        <div className={styles.attachHolder}>
                            <p className={styles.subTitle}>upload some attachments</p>
                            <label className={styles.attachLabel} for="attachement"><div><div className={styles.attachLabelDiv}><BiUpload /></div></div></label>
                            <input type="file" style={{ width: 0, height: 0 }} id="attachement" onChange={handleChange} multiple accept="image/*" />
                            <div className={styles.imgHolder}>
                                {files.map((file, index) => (
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', right: '5px', top: '-5px', color: '#000', zIndex: 1, cursor: 'pointer', fontSize: '18px' }} onClick={() => { fileRemoveHandler(index) }}>x</span>
                                        <a href={file?.preview} target="_blank" title="Click to Download">
                                            <img src={file?.preview} key={index} alt={file?.preview} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.dFlex}>
                            {" "}
                            <Link to={"/customer-support"} className={styles.btn}>
                                Cancel
                            </Link>
                            <input type="submit" className={styles.btn} value={"Submit"} />
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
}
export default AccountInfo