import React, { useState } from 'react';
import { Divider, Drawer, Flex, Typography } from 'antd';
import { useDrawerContext } from '../hooks/useDrawerContext';
import { formatDateFromISO } from '../../../utils/dateFormat';
import { truncateText } from '../../../utils/truncateText';

const ClipboardDetailsPanel = () => {
  const { isDrawerOpen, setIsDrawerOpen, clipboardDetails } =
    useDrawerContext();

  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);

  const { label, text, timestamp, category, source } = clipboardDetails;

  return (
    <Drawer
      title="Clipboard Details"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
    >
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 15 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Label:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {truncateText(label ?? '', 30)}
        </Typography.Text>
      </Flex>
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 15 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Copied At:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {formatDateFromISO(timestamp)}
        </Typography.Text>
      </Flex>
      <Flex justify="flex-start" align="flex-start" style={{ width: '100%' }}>
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Category:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {category
            ? truncateText(category.name ?? '', 30)
            : 'Item has no category'}
        </Typography.Text>
      </Flex>
      <Divider />
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 15 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Title:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {truncateText(source?.name ?? '', 30)}
        </Typography.Text>
      </Flex>
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 15 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Website:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {source?.hostname}
        </Typography.Text>
      </Flex>
      <Flex justify="flex-start" align="flex-start" style={{ width: '100%' }}>
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Source:{' '}
        </Typography.Text>
        <Typography.Link style={{ width: '75%' }} href={source?.url}>
          {source?.url}
        </Typography.Link>
      </Flex>
      <Divider />
      <Flex justify="flex-start" align="flex-start" style={{ width: '100%' }}>
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Content:{' '}
        </Typography.Text>
        <Typography.Paragraph
          style={{ width: '75%' }}
          ellipsis={{
            rows,
            expandable: 'collapsible',
            expanded,
            onExpand: (_, info) => setExpanded(info.expanded),
          }}
        >
          {text}
        </Typography.Paragraph>
      </Flex>
      <Divider />
    </Drawer>
  );
};

export default ClipboardDetailsPanel;
