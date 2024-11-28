import React, { useEffect, useState } from 'react';
import { Button, Empty, Flex, List, Modal, Typography } from 'antd';
import { useAppContext } from '../hooks/useAppContext';
import ListItem from '../components/ListItem';
import { ClipboardItem } from '../../../types';
import { delay } from '../../../utils/delay';

const Trash = () => {
  const { clipboardItems, setClipboardItems } = useAppContext();

  const [trashedItems, setTrashedItems] = useState<ClipboardItem[]>([]);
  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const trashedItems = clipboardItems.filter((item) => item.isTrashed);

    setTrashedItems(trashedItems);
  }, [clipboardItems]);

  const handleEmptyTrash = async () => {
    setLoading(true);

    await delay(1000);

    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.filter(
        (item: ClipboardItem) => !item.isTrashed
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
        setLoading(false);
        setIsEmptyTrashModalOpen(false);
      });
    });
  };

  if (trashedItems.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Typography.Text type="secondary">Trash is empty</Typography.Text>
        }
        style={{ marginBlock: 50 }}
      />
    );
  }

  return (
    <>
      <Modal
        title="Empty Trash"
        open={isEmptyTrashModalOpen}
        onCancel={() => setIsEmptyTrashModalOpen(false)}
        footer={
          <>
            <Button onClick={() => setIsEmptyTrashModalOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" loading={loading} onClick={handleEmptyTrash}>
              Confirm
            </Button>
          </>
        }
      >
        <Typography.Text type="secondary" style={{ marginBottom: 30 }}>
          Are you sure you want to permanently delete all items in the trash?
          This action cannot be undone.
        </Typography.Text>
      </Modal>
      <List
        size="small"
        style={{ marginTop: 15 }}
        dataSource={clipboardItems}
        header={
          <Flex justify="space-between" align="center">
            <Typography.Text>
              <strong>Clipboard Trash</strong>
            </Typography.Text>
            <Button
              variant="outlined"
              onClick={() => setIsEmptyTrashModalOpen(true)}
            >
              Empty Trash
            </Button>
          </Flex>
        }
        renderItem={(item) =>
          item.isTrashed && <ListItem isTrashed item={item} />
        }
      />
    </>
  );
};

export default Trash;
