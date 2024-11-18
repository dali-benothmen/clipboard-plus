import React, { useState, useEffect } from 'react';
import { ClipboardItem } from '../../types';

import './Popup.css';

const MAX_ITEMS_TO_SHOW = 10;

const Popup = () => {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

  useEffect(() => {
    const fetchClipboardHistory = () => {
      chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
        if (clipboardHistory) {
          setClipboardItems(clipboardHistory);
        }
      });
    };

    fetchClipboardHistory();
  }, []);

  const renderCopiedItem = ({ id, text, website }: ClipboardItem) => (
    <div key={id} className="clipboard-entry">
      <div className="clipboard-entry-content">
        <img
          src={website?.favicon}
          alt={website?.name}
          className="clipboard-entry-icon"
        />
        <p className="clipboard-entry-text">{text}</p>
      </div>
    </div>
  );

  const renderDateSeparator = (itemDate: string) => {
    const now = new Date();
    const itemDateObj = new Date(itemDate);

    if (itemDateObj.toDateString() === now.toDateString()) {
      return 'TODAY';
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (itemDateObj.toDateString() === yesterday.toDateString()) {
      return 'YESTERDAY';
    }

    return itemDateObj.toLocaleDateString();
  };

  const renderCopiedItemsList = () => {
    if (clipboardItems.length === 0) {
      return <p className="clipboard-empty-message">No copied items</p>;
    }

    let currentDateLabel = '';
    const itemsToDisplay = clipboardItems.slice(0, MAX_ITEMS_TO_SHOW);

    return (
      <div className="clipboard-list">
        {itemsToDisplay.map((item) => {
          const dateLabel = renderDateSeparator(item.timestamp);
          const showDateSeparator = dateLabel !== currentDateLabel;

          if (showDateSeparator) {
            currentDateLabel = dateLabel;

            return (
              <React.Fragment key={item.id}>
                <div className="clipboard-date-separator">{dateLabel}</div>
                {renderCopiedItem(item)}
              </React.Fragment>
            );
          }

          return renderCopiedItem(item);
        })}
      </div>
    );
  };

  return (
    <div className="clipboard-popup-container">
      <h1 className="clipboard-popup-header">ClipBoard+</h1>
      {renderCopiedItemsList()}
    </div>
  );
};

export default Popup;
