import React, { useState, useEffect } from 'react';
import { ClipboardItem } from '../../types';

import './Popup.css';

const MAX_ITEMS_TO_SHOW = 10;

const Popup = () => {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

  console.log({ clipboardItems });

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
    <div
      key={id}
      className="clipboard-entry my-2 mx-2.5 flex justify-between items-center"
    >
      <div className="clipboard-entry-content flex items-center">
        <img
          src={website?.favicon}
          alt={website?.name}
          className="clipboard-entry-icon mr-2.5 h-4 w-4"
        />
        <p className="clipboard-entry-text font-semibold">{text}</p>
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
      <div className="clipboard-list h-auto">
        {itemsToDisplay.map((item) => {
          const dateLabel = renderDateSeparator(item.timestamp);
          const showDateSeparator = dateLabel !== currentDateLabel;

          if (showDateSeparator) {
            currentDateLabel = dateLabel;

            return (
              <React.Fragment key={item.id}>
                <div className="clipboard-date-separator bg-[#f7f7f7] text-center py-1 px-0 text-[#b7b7b7] text-[10px] tracking-wider">
                  {dateLabel}
                </div>
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
    <div className="clipboard-popup-container flex flex-col justify-center">
      <h1 className="clipboard-popup-header m-0 py-3.5 px-5 text-base text-center text-white tracking-widest">
        ClipBoard+
      </h1>
      {renderCopiedItemsList()}
    </div>
  );
};

export default Popup;
