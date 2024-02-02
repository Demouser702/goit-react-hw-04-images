import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, handleClose, children }) => {
  const handleOutsideClick = e => {
    if (e.currentTarget === e.target) {
      handleClose();
    }
  };

  useEffect(() => {
    const pressEsc = e => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', pressEsc, false);
    }

    return () => {
      document.removeEventListener('keydown', pressEsc, false);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={handleOutsideClick}>
      <dialog className={styles.modal}>
        <main className={styles.content}>{children}</main>
      </dialog>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
