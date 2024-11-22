import React from 'react';
import { Avatar, Button, Checkbox, Empty, List, Space, Typography } from 'antd';
import { PushpinOutlined, CopyOutlined, MoreOutlined } from '@ant-design/icons';
import { ClipboardItem } from '../../../types';

export interface GroupedItemsType {
  [key: string]: ClipboardItem[];
}

interface GroupedItemsProps {
  groupedItems: GroupedItemsType;
  groupName: 'date' | 'category';
}

function formatTimeFromISO(isoDate: string) {
  const dateObj = new Date(isoDate);

  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 12-hour format with AM/PM
  });
}

function formatDateFromISO(isoDate: string) {
  const dateObj = new Date(isoDate);

  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const GroupedItems: React.FC<GroupedItemsProps> = ({
  groupedItems,
  groupName,
}) => {
  if (Object.keys(groupedItems).length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          groupName === 'date' ? (
            <Typography.Text>Clipboard history is empty</Typography.Text>
          ) : (
            <>
              <Typography.Text>
                No categories available. Create a new category to organize your
                clipboard items.
              </Typography.Text>
              <br />
              <br />
              <Button>Create now</Button>
            </>
          )
        }
        style={{ marginBlock: 50 }}
      />
    );
  }

  return (
    <div>
      {Object.entries(groupedItems).map(([key, items]) => {
        const formattedKey =
          groupName === 'date' ? formatDateFromISO(key) : key;

        return (
          <React.Fragment key={key}>
            <List
              size="small"
              style={{ marginTop: 15 }}
              header={
                <Typography.Text>
                  <strong>{formattedKey}</strong>
                </Typography.Text>
              }
              dataSource={items}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <PushpinOutlined
                      style={{ fontSize: 16, cursor: 'pointer' }}
                    />,
                    <CopyOutlined
                      style={{ fontSize: 16, cursor: 'pointer' }}
                    />,
                    <MoreOutlined
                      style={{ fontSize: 16, cursor: 'pointer' }}
                    />,
                  ]}
                >
                  <Space>
                    <Checkbox />
                    <Typography.Text style={{ color: 'gray', fontSize: 13 }}>
                      {formatTimeFromISO(item.timestamp)}
                    </Typography.Text>
                    <div
                      className="clipboard-item-info"
                      style={{ marginLeft: 20 }}
                    >
                      <Avatar
                        shape="square"
                        size={18}
                        src={item.source.favicon}
                      />
                      <Typography.Text
                        style={{ margin: '0 7px', fontSize: 13 }}
                      >
                        {item.label}
                      </Typography.Text>
                      <span> - </span>
                      <Typography.Text
                        style={{ margin: '0 7px', color: 'gray', fontSize: 13 }}
                      >
                        {item.source.name}
                      </Typography.Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default GroupedItems;
