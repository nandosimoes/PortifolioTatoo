import React from 'react';
import styles from './Portifolio.module.css';

export default function Modal({ item, onClose, onDelete }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <img src={item.image_url} alt={item.title} className={styles.modalImage} />
        <div className={styles.modalInfo}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {onDelete && (
            <button 
              className={styles.deleteButton}
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
            >
              Deletar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}