import React, { useState, useEffect, useMemo } from 'react';

import ClipboardEntryActions from './components/ClipboardEntryActions';
import Divider from './components/Divider';
import { ClipboardItem } from '../../types';
import { truncateText } from '../../utils/truncateText';

import './Popup.css';

const MAX_ITEMS_TO_SHOW = 10;

const filterPinnedItems = (items: ClipboardItem[]) =>
  items.filter((item) => item.pinned);
const filterUnpinnedItems = (items: ClipboardItem[]) =>
  items.filter((item) => !item.pinned);

const Popup = () => {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

  const pinnedItems = useMemo(
    () => filterPinnedItems(clipboardItems),
    [clipboardItems]
  );
  const unpinnedItems = useMemo(
    () => filterUnpinnedItems(clipboardItems),
    [clipboardItems]
  );

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (id: string) => {
    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.filter(
        (item: ClipboardItem) => item.id !== id
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
      });
    });
  };

  const handlePinItem = (id: string) => {
    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
      });
    });
  };

  const ClipboardEntry = ({ id, text, pinned, website }: ClipboardItem) => (
    <div
      key={id}
      className="clipboard-entry my-4 mx-2.5 flex justify-between items-center"
    >
      <div className="clipboard-entry-content flex items-center">
        <img
          src={website?.favicon}
          alt={website?.name}
          className="clipboard-entry-icon mr-2.5 h-4 w-4"
        />
        <p className="clipboard-entry-text font-semibold text-[#4448ff]">
          {truncateText(text)}
        </p>
      </div>
      <ClipboardEntryActions
        onPin={() => handlePinItem(id)}
        onCopy={() => handleCopy(text)}
        onDelete={() => handleDelete(id)}
        isPinned={pinned}
      />
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

  const renderPinnedItems = () => {
    const itemsToDisplay = pinnedItems.slice(0, MAX_ITEMS_TO_SHOW);

    return (
      <>
        <Divider text={'PINNED'} />
        {itemsToDisplay.map((item) => {
          return (
            <React.Fragment key={item.id}>
              <ClipboardEntry {...item} />
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const renderUnpinnedItems = () => {
    if (clipboardItems.length === 0) {
      return <p className="clipboard-empty-message">No copied items</p>;
    }

    let currentDateLabel = '';
    const itemsToDisplay = unpinnedItems.slice(
      0,
      MAX_ITEMS_TO_SHOW - pinnedItems.length
    );

    return (
      <>
        {itemsToDisplay.map((item) => {
          const dateLabel = renderDateSeparator(item.timestamp);
          const showDateSeparator = dateLabel !== currentDateLabel;

          if (showDateSeparator) {
            currentDateLabel = dateLabel;

            return (
              <React.Fragment key={item.id}>
                <Divider text={dateLabel} />
                <ClipboardEntry {...item} />
              </React.Fragment>
            );
          }

          return <ClipboardEntry key={item.id} {...item} />;
        })}
      </>
    );
  };

  return (
    <div className="clipboard-popup-container flex flex-col justify-center">
      <h1 className="clipboard-popup-header m-0 py-3.5 px-5 text-base text-center text-white font-bold tracking-widest">
        ClipBoard+
      </h1>
      <div className="clipboard-list h-auto">
        {pinnedItems.length > 0 ? renderPinnedItems() : null}
        {renderUnpinnedItems()}
      </div>

      {clipboardItems.length > MAX_ITEMS_TO_SHOW && (
        <button className="see-more-btn m-[15px] h-[29px] w-[50%] self-center text-white font-semibold border-none rounded-full cursor-pointer">
          See More
        </button>
      )}
    </div>
  );
};

export default Popup;
