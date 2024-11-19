import React, { useState, useEffect, useMemo } from 'react';
import { Dropdown } from 'antd';

import { ClipboardItem } from '../../types';
import { truncateText } from '../../utils/truncateText';
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
} from '../../assets/icons';

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

  const ClipboardEntryActions = ({
    onPin,
    onCopy,
    onDelete,
    isPinned,
  }: {
    onPin: () => void;
    onCopy: () => void;
    onDelete: () => void;
    isPinned: boolean;
  }) => (
    <div className="clipboard-entry-actions w-[70px] flex justify-between">
      <button onClick={onCopy}>
        <DocumentDuplicateIcon />
      </button>
      <button onClick={onPin}>
        {isPinned ? <BookmarkSlashIcon /> : <BookmarkIcon />}
      </button>
      <Dropdown
        menu={{
          items: [
            { label: 'Copy', key: '0', onClick: onCopy },
            {
              label: 'Delete',
              key: '1',
              danger: true,
              onClick: onDelete,
            },
          ],
        }}
        trigger={['click']}
      >
        <button>
          <EllipsisVerticalIcon />
        </button>
      </Dropdown>
    </div>
  );

  const ClipboardEntry = ({ id, text, pinned, website }: ClipboardItem) => {
    const handleCopy = () => console.log('Item Copied');
    const handleDelete = () => console.log('Item deleted');

    return (
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
          onCopy={handleCopy}
          onDelete={handleDelete}
          isPinned={pinned}
        />
      </div>
    );
  };

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

  const LineSeperator = ({ text }: { text: string }) => (
    <div className="clipboard-line-separator bg-[#f7f7f7] text-center py-1 px-0 text-[#b7b7b7] text-[10px] tracking-wider">
      {text}
    </div>
  );

  const renderPinnedItems = () => {
    const itemsToDisplay = pinnedItems.slice(0, MAX_ITEMS_TO_SHOW);

    return (
      <>
        <LineSeperator text={'PINNED'} />
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
                <LineSeperator text={dateLabel} />
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
