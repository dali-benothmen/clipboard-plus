import React from 'react';
import { Empty, List, Typography } from 'antd';
import ListItem from './ListItem';
import { ClipboardItem } from '../../../types';

interface FilteredItemsListProps {
  filteredItems: ClipboardItem[];
}

const FilteredItemsList: React.FC<FilteredItemsListProps> = ({
  filteredItems,
}) => {
  if (filteredItems.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ marginBlock: 50 }}
        description={
          <Typography.Text>Clipboard Item not found</Typography.Text>
        }
      />
    );
  }

  return (
    <List
      size="small"
      header={
        <Typography.Text>
          <strong>Found {filteredItems.length} search result'</strong>
        </Typography.Text>
      }
      dataSource={filteredItems}
      renderItem={(item) => !item.isTrashed && <ListItem item={item} />}
    />
  );
};

export default React.memo(FilteredItemsList);
