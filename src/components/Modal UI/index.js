import React, { useEffect, useRef, useState } from "react";
import Styles from "./Styles.module.css";
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className={Styles.modalOverlay} onClick={onClose}>
          <div 
            className={`${Styles.modal} `}
            onClick={(e) => {
              // do not close modal if anything inside modal content is clicked
              e.stopPropagation();
            }}
          >
            <div className={Styles.modalContent}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
const ModalPage = ({ open, content, onClose }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onModalClose = () => {
    onClose?.();
    setIsOpen(false);
  };

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <div>
        <div className={Styles.ModalControl}>
          {content}
        </div>
      </div>
    </Modal>
  ) : null;
};

export default ModalPage;
