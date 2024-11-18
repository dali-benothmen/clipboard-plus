import React, { useState, useEffect } from 'react';
import { CopiedItem } from '../../types';

import './Popup.css';

const MAX_ITEMS_TO_SHOW = 10;

const Popup = () => {
  const [copiedItems, setCopiedItems] = useState<CopiedItem[]>([]);

  useEffect(() => {
    const fetchCopiedHistory = () => {
      chrome.storage.local.get(['copiedHistory'], ({ copiedHistory }) => {
        if (copiedHistory) {
          setCopiedItems(copiedHistory);
        }
      });
    };

    fetchCopiedHistory();
  }, []);

  const renderCopiedItem = ({ id, text, website }: CopiedItem) => (
    <div key={id} className="copied-item">
      <div className="copied-item-wrapper">
        <img src={website?.favicon} alt={website?.name} className="favicon" />
        <p className="copied-text">{text}</p>
      </div>
    </div>
  );

  const renderCopiedItemsList = () => {
    const itemsToDisplay = copiedItems.slice(0, MAX_ITEMS_TO_SHOW);

    return (
      <div className="copied-items-list">
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map(renderCopiedItem)
        ) : (
          <p className="no-items-message">No copied items</p>
        )}
      </div>
    );
  };

  return (
    <div className="popup-container">
      <h1 className="popup-header">ClipBoard+</h1>
      {renderCopiedItemsList()}
    </div>
  );
};

export default Popup;
