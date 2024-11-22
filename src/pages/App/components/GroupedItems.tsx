import React from 'react';
import { List, Typography } from 'antd';
import { PushpinOutlined, CopyOutlined, MoreOutlined } from '@ant-design/icons';
import { ClipboardItem } from '../../../types';

export interface GroupedItemsType {
  [key: string]: ClipboardItem[];
}

interface GroupedItemsProps {
  groupedItems: GroupedItemsType;
  groupName: 'date' | 'category';
}

const GroupedItems: React.FC<GroupedItemsProps> = ({
  groupedItems,
  groupName,
}) => (
  <div>
    {Object.entries(groupedItems).map(([key, items]) => {
      const formattedKey =
        groupName === 'date'
          ? new Date(key).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : key;

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
                  <CopyOutlined style={{ fontSize: 16, cursor: 'pointer' }} />,
                  <MoreOutlined style={{ fontSize: 16, cursor: 'pointer' }} />,
                ]}
              >
                {item.label}
              </List.Item>
            )}
          />
        </React.Fragment>
      );
    })}
  </div>
);

export default GroupedItems;
