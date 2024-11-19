import React, { useState } from 'react';
import { Dropdown, Modal } from 'antd';

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
  onSetLabel: () => void;
  isPinned: boolean;
}

const ClipboardEntryActions: React.FC<ClipboardEntryActionsProps> = ({
  onPin,
  onCopy,
  onDelete,
  onSetLabel,
  isPinned,
}) => {
  return (
    <>
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
              { label: 'Set Label', key: '0', onClick: onSetLabel },
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
    </>
  );
};

export default ClipboardEntryActions;
