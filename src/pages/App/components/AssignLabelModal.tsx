import React, { useRef } from 'react';
import { Button, Input, InputRef, message, Modal, Typography } from 'antd';
import { useModalContext } from '../hooks/useModalContext';
import { useAppContext } from '../hooks/useAppContext';
import { ClipboardItem } from '../../../types';

const AssignLabelModal = () => {
  const { clipboardItem, setClipboardItems } = useAppContext();
  const { isEditLabelModalOpen, setIsEditLabelModalOpen } = useModalContext();
  const inputRef = useRef<InputRef>(null);

  const handleAssignLabel = () => {
    const inputLabelValue = inputRef.current?.input?.value;

    if (inputLabelValue && clipboardItem) {
      const updatedItem = { ...clipboardItem, label: inputLabelValue };

      chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
        const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
          item.id === clipboardItem?.id ? updatedItem : item
        );

        chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
          message.success('Label added successfully!');
          setClipboardItems(updatedItems);
          setIsEditLabelModalOpen(false);
        });
      });
    }
  };

  return (
    <Modal
      title="Assign a Label"
      open={isEditLabelModalOpen}
      onCancel={() => setIsEditLabelModalOpen(false)}
      footer={
        <>
          <Button onClick={() => setIsEditLabelModalOpen(false)}>Cancel</Button>
          <Button type="primary" onClick={handleAssignLabel}>
            Confirm
          </Button>
        </>
      }
    >
      <Typography.Text type="secondary">
        Add a label to your clipboard item to make it easier to organize and
        find later. Labels help you quickly locate specific content when needed.{' '}
      </Typography.Text>
      <Input
        ref={inputRef}
        placeholder="Enter a label..."
        style={{ marginTop: 25, marginBottom: 15 }}
      />
    </Modal>
  );
};

export default AssignLabelModal;
