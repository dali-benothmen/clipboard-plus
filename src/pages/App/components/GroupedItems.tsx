import React from 'react';
import { Button, Empty, List, Typography } from 'antd';
import ListItem from './ListItem';
import { ClipboardItem } from '../../../types';
import { formatDateFromISO } from '../../../utils/dateFormat';

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
              renderItem={(item) => !item.isTrashed && <ListItem item={item} />}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default GroupedItems;
