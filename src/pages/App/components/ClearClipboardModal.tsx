import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  Modal,
  Select,
  Typography,
  message,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useModalContext } from '../hooks/useModalContext';
import { useAppContext } from '../hooks/useAppContext';
import { delay } from '../../../utils/delay';
import { ClipboardItem } from '../../../types';

type TimeRange = 'lastHour' | 'lastDay' | 'lastWeek' | 'lastMonth' | 'allTime';

const ClearClipboardModal = () => {
  //   const [messageApi, contextHolder] = message.useMessage();

  const { setClipboardItems, clipboardItems } = useAppContext();
  const { isClearClipboardModalOpen, setIsClearClipboardModalOpen } =
    useModalContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('allTime');
  const [moveToTrash, setMoveToTrash] = useState<boolean>(false);
  const [excludePinned, setExcludePinned] = useState<boolean>(false);

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };

  const handleMoveToTrash = (e: CheckboxChangeEvent) => {
    setMoveToTrash(e.target.checked);
  };

  const handleExcludePinned = (e: CheckboxChangeEvent) => {
    setExcludePinned(e.target.checked);
  };

  const handleConfirm = async () => {
    setLoading(true);

    const now = new Date();

    await delay(600);

    let timeRangeStart: any;

    switch (timeRange) {
      case 'lastHour':
        timeRangeStart = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
        break;
      case 'lastDay':
        timeRangeStart = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
        break;
      case 'lastWeek':
        timeRangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
        break;
      case 'lastMonth':
        timeRangeStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 1 month ago
        break;
      case 'allTime':
        timeRangeStart = null;
        break;
      default:
        break;
    }

    const updatedList = clipboardItems.map((item) => {
      if (item.isTrashed) {
        return item;
      }

      const itemTime = new Date(item.timestamp);
      const withinRange = itemTime >= timeRangeStart;

      if (withinRange && (!excludePinned || !item.category)) {
        if (moveToTrash) {
          return { ...item, isTrashed: true };
        } else {
          return null;
        }
      }

      return item;
    });

    const finalItems = updatedList.filter(
      (item) => item !== null
    ) as ClipboardItem[];

    chrome.storage.local.set({ clipboardHistory: finalItems }, () => {
      message.success('Clipboard history cleared successfully.');

      setClipboardItems(finalItems);
      setIsClearClipboardModalOpen(false);
      setLoading(false);
    });
  };

  return (
    <Modal
      title="Clear Clipboard History"
      open={isClearClipboardModalOpen}
      onCancel={() => setIsClearClipboardModalOpen(false)}
      footer={
        <>
          <Button onClick={() => setIsClearClipboardModalOpen(false)}>
            Cancel
          </Button>
          <Button type="primary" loading={loading} onClick={handleConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <Typography.Text type="secondary">
        Are you sure you want to clear all clipboard items? This action cannot
        be undone, and all saved items will be permanently removed.
      </Typography.Text>
      <Flex justify="flex-start" align="center" style={{ margin: '25px 0' }}>
        <Typography.Text type="secondary">Time range</Typography.Text>
        <Select
          defaultValue="allTime"
          style={{ width: 175, marginLeft: 10 }}
          onChange={handleTimeRangeChange}
          options={[
            { value: 'lastHour', label: 'Last hour' },
            { value: 'lastDay', label: 'Last 24 hours' },
            { value: 'lastWeek', label: 'Last 7 days' },
            { value: 'lastMonth', label: 'Last 4 weeks' },
            { value: 'allTime', label: 'All time' },
          ]}
        />
      </Flex>
      <Flex vertical justify="flex-start" align="flex-start">
        <Flex justify="flex-start" align="center" style={{ marginBottom: 10 }}>
          <Checkbox style={{ marginRight: 10 }} onChange={handleMoveToTrash} />
          <Typography.Text type="secondary">
            Move to Trash instead of permanent deletion.
          </Typography.Text>
        </Flex>
        <Flex justify="flex-start" align="center">
          <Checkbox
            style={{ marginRight: 10 }}
            onChange={handleExcludePinned}
          />
          <Typography.Text type="secondary">
            Exclude Pinned Items.
          </Typography.Text>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default ClearClipboardModal;
