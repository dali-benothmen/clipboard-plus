import React, { useState } from 'react';
import { Button, Divider, Drawer, Flex, Typography } from 'antd';
import { useDrawerContext } from '../hooks/useDrawerContext';
import { formatDateFromISO } from '../../../utils/dateFormat';
import { truncateText } from '../../../utils/truncateText';

interface ClipboardDetailsPanel {
  onMoveToTrash: (id: string[]) => void;
}

const ClipboardDetailsPanel: React.FC<ClipboardDetailsPanel> = ({
  onMoveToTrash,
}) => {
  const { isDrawerOpen, setIsDrawerOpen, clipboardDetails } =
    useDrawerContext();

  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);

  const { id, label, text, timestamp, category, source } = clipboardDetails;

  return (
    <Drawer
      title="Clipboard Details"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      width={450}
      extra={
        <Button
          color="danger"
          variant="outlined"
          shape="round"
          onClick={() => {
            onMoveToTrash([id]);
            setIsDrawerOpen(false);
          }}
        >
          Move to trash
        </Button>
      }
    >
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 10 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Label:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {truncateText(label ?? '', 50)}
        </Typography.Text>
      </Flex>
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 10 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Copied on:{' '}
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
            ? truncateText(category.name ?? '', 50)
            : 'Item has no category'}
        </Typography.Text>
      </Flex>
      <Divider />
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 10 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Page title:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {truncateText(source?.name ?? '', 50)}
        </Typography.Text>
      </Flex>
      <Flex
        justify="flex-start"
        align="flex-start"
        style={{ width: '100%', marginBottom: 10 }}
      >
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Source website:{' '}
        </Typography.Text>
        <Typography.Text style={{ width: '75%' }}>
          {source?.hostname}
        </Typography.Text>
      </Flex>
      <Flex justify="flex-start" align="flex-start" style={{ width: '100%' }}>
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Original link:{' '}
        </Typography.Text>
        <Typography.Link style={{ width: '75%' }} href={source?.url}>
          {source?.url}
        </Typography.Link>
      </Flex>
      <Divider />
      <Flex justify="flex-start" align="flex-start" style={{ width: '100%' }}>
        <Typography.Text type="secondary" style={{ width: '25%' }}>
          Copied text:{' '}
        </Typography.Text>
        <Typography.Paragraph
          copyable
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
