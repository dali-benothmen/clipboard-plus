import React, { useState, useEffect, useMemo } from 'react';
import { Input, Modal } from 'antd';

import ClipboardEntry from './components/ClipboardEntry';
import Divider from './components/Divider';
import { ClipboardItem } from '../../types';

import './Popup.css';

const MAX_ITEMS_TO_SHOW = 10;

const filterPinnedItems = (items: ClipboardItem[]) =>
  items.filter((item) => item.pinned);
const filterUnpinnedItems = (items: ClipboardItem[]) =>
  items.filter((item) => !item.pinned);

const Popup = () => {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClipboardItem | null>(null);
  const [label, setLabel] = useState('');

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

  const handleSetLabel = (item: ClipboardItem) => {
    setSelectedItem(item);
    setLabel(item.label);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setLabel('');
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleSaveLabel = () => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem, label };
      chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
        const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
          item.id === selectedItem.id ? updatedItem : item
        );

        chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
          setClipboardItems(updatedItems);
          handleModalClose();
        });
      });
    }
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

  const renderPinnedItems = () => {
    const itemsToDisplay = pinnedItems.slice(0, MAX_ITEMS_TO_SHOW);

    return (
      <>
        <Divider text={'PINNED'} />
        {itemsToDisplay.map((item) => {
          return (
            <React.Fragment key={item.id}>
              <ClipboardEntry
                clipboardItem={item}
                onPin={() => handlePinItem(item.id)}
                onCopy={() => handleCopy(item.text)}
                onDelete={() => handleDelete(item.id)}
                onSetLabel={() => handleSetLabel(item)}
              />
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
                <ClipboardEntry
                  clipboardItem={item}
                  onPin={() => handlePinItem(item.id)}
                  onCopy={() => handleCopy(item.text)}
                  onDelete={() => handleDelete(item.id)}
                  onSetLabel={() => handleSetLabel(item)}
                />
              </React.Fragment>
            );
          }

          return (
            <ClipboardEntry
              key={item.id}
              clipboardItem={item}
              onPin={() => handlePinItem(item.id)}
              onCopy={() => handleCopy(item.text)}
              onDelete={() => handleDelete(item.id)}
              onSetLabel={() => handleSetLabel(item)}
            />
          );
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
      <Modal
        title="Set Label"
        open={isModalOpen}
        onOk={handleSaveLabel}
        onCancel={handleModalClose}
      >
        <p className="text-[13px] mb-1.5">
          Label your clipboard items for easier organization and quick access.
        </p>
        <Input
          value={label}
          onChange={handleLabelChange}
          placeholder="Enter a new label"
        />
      </Modal>
      {clipboardItems.length > MAX_ITEMS_TO_SHOW && (
        <button
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
          className="see-more-btn m-[15px] h-[29px] w-[50%] self-center text-white font-semibold border-none rounded-full cursor-pointer"
        >
          See More
        </button>
      )}
    </div>
  );
};

export default Popup;
