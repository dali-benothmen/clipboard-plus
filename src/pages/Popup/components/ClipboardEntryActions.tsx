import React from 'react';
import { Dropdown } from 'antd';
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
} from '../../../assets/icons';

interface ClipboardEntryActionsProps {
  onPin: () => void;
  onCopy: () => void;
  onDelete: () => void;
  isPinned: boolean;
}

const ClipboardEntryActions: React.FC<ClipboardEntryActionsProps> = ({
  onPin,
  onCopy,
  onDelete,
  isPinned,
}) => (
  <div className="clipboard-entry-actions w-[70px] flex justify-between">
    <button onClick={onCopy}>
      <DocumentDuplicateIcon />
    </button>
    <button onClick={onPin}>
      {isPinned ? <BookmarkSlashIcon /> : <BookmarkIcon />}
    </button>
    <Dropdown
      menu={{
        items: [
          { label: 'Copy', key: '0', onClick: onCopy },
          {
            label: 'Delete',
            key: '1',
            danger: true,
            onClick: onDelete,
          },
        ],
      }}
      trigger={['click']}
    >
      <button>
        <EllipsisVerticalIcon />
      </button>
    </Dropdown>
  </div>
);

export default ClipboardEntryActions;
