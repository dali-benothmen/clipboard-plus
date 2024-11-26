import React from 'react';
import {
  Avatar,
  Checkbox,
  Dropdown,
  List,
  message,
  Space,
  Typography,
} from 'antd';
import {
  CopyOutlined,
  MoreOutlined,
  PushpinFilled,
  PushpinOutlined,
} from '@ant-design/icons';
import { useAppContext } from '../hooks/useAppContext';
import { useModalContext } from '../hooks/useModalContext';
import { ClipboardItem } from '../../../types';
import { truncateText } from '../../../utils/truncateText';
import { formatTimeFromISO } from '../../../utils/dateFormat';

interface ListItemProps {
  item: ClipboardItem;
}

const ListItem: React.FC<ListItemProps> = ({ item }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    checkedItems,
    setCheckedItems,
    setClipboardItems,
    setSavedClipboardId,
  } = useAppContext();
  const { setIsModalOpen } = useModalContext();

  const handleCheck = (id: string) => {
    setCheckedItems((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((itemId) => itemId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);

    messageApi.open({
      type: 'success',
      content: 'Item copied',
    });
  };

  const handleMoveToTrash = (checkedItems: string[]) => {
    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
        checkedItems.includes(item.id)
          ? { ...item, isTrashed: !item.isTrashed }
          : item
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
        setCheckedItems([]);
      });
    });
  };

  const handleUnsaveClipboard = (id: string) => {
    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
        item.id === id ? { ...item, category: null } : item
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
      });
    });
  };

  const handleShowClipboardModal = (clipboardId: string) => {
    setSavedClipboardId(clipboardId);
    setIsModalOpen(true);
  };

  return (
    <>
      {contextHolder}

      <List.Item
        actions={[
          item.category ? (
            <PushpinFilled
              style={{ fontSize: 17, cursor: 'pointer' }}
              onClick={() => handleUnsaveClipboard(item.id)}
            />
          ) : (
            <PushpinOutlined
              style={{ fontSize: 17, cursor: 'pointer' }}
              onClick={() => handleShowClipboardModal(item.id)}
            />
          ),
          <CopyOutlined
            onClick={() => handleCopy(item.text)}
            style={{ fontSize: 17, cursor: 'pointer' }}
          />,

          <Dropdown
            menu={{
              items: [
                {
                  label: 'View Details',
                  key: '0',
                  onClick: () => console.log('view details'),
                },
                {
                  label: 'Edit Label',
                  key: '1',
                  onClick: () => console.log('edit label'),
                },
                {
                  label: 'Assign Shortcut Key',
                  key: '2',
                  onClick: () => console.log('Assign Shortcut Key'),
                },
                {
                  label: 'Move to trash',
                  key: '3',
                  danger: true,
                  onClick: () => handleMoveToTrash([item.id]),
                },
              ],
            }}
            trigger={['click']}
          >
            <MoreOutlined style={{ fontSize: 17, cursor: 'pointer' }} />
          </Dropdown>,
        ]}
      >
        <Space>
          <Checkbox
            checked={checkedItems.includes(item.id)}
            onChange={() => handleCheck(item.id)}
          />
          <Typography.Text type="secondary">
            {formatTimeFromISO(item.timestamp)}
          </Typography.Text>
          <div className="clipboard-item-info" style={{ marginLeft: 20 }}>
            <Avatar shape="square" size={18} src={item.source.favicon} />
            <Typography.Text style={{ margin: '0 7px' }}>
              {truncateText(item.label, 40)}
            </Typography.Text>
            <span> - </span>
            <Typography.Text type="secondary" style={{ margin: '0 7px' }}>
              {truncateText(item.source.hostname, 40)}
            </Typography.Text>
          </div>
        </Space>
      </List.Item>
    </>
  );
};

export default React.memo(ListItem);
