import React from "react";
import styles from "../styles/AsideMenu.module.css";

function AsideMenu({ isOpen, onClose, onSearch, onFilter, children }) {
  return (
    <>
      {/* Overlay visible uniquement quand le menu est ouvert */}
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}

      <aside className={`${styles.asideMenu} ${isOpen ? styles.asideOpen : ""}`}>
        <div className={styles.block}>
          <h5 className="fw-bold">Recherche</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        <div className={styles.block}>
          <h5 className="fw-bold">Filtres</h5>
          <select className="form-select" onChange={(e) => onFilter && onFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        <div className={styles.block}>
          <h5 className="fw-bold">Informations</h5>
          {children}
        </div>
      </aside>
    </>
  );
}

export default AsideMenu;
