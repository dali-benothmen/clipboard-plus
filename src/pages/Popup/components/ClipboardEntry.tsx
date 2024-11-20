import React, { useState } from 'react';
import ClipboardEntryActions from './ClipboardEntryActions';
import { truncateText } from '../../../utils/truncateText';
import { ClipboardItem } from '../../../types';

interface ClipboardEntryProps {
  clipboardItem: ClipboardItem;
  onPin: (id: string) => void;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
  onSetLabel: (item: ClipboardItem) => void;
}

const ClipboardEntry: React.FC<ClipboardEntryProps> = (props) => {
  const { clipboardItem, onCopy, onPin, onDelete, onSetLabel } = props;
  const { id, text, label, pinned, source } = clipboardItem;

  const [isCoping, setIsCoping] = useState(false);

  return (
    <div
      key={id}
      className="clipboard-entry my-4 mx-2.5 flex justify-between items-center"
    >
      <div className="clipboard-entry-content flex items-center">
        <img
          src={source?.favicon}
          alt={source?.name}
          className="clipboard-entry-icon mr-2.5 h-4 w-4"
        />
        <p
          className={`clipboard-entry-text text-[#4448ff] font-semibold transition-colors duration-100 ease-in-out ${
            isCoping ? 'text-green-400' : ''
          }`}
        >
          {truncateText(label, 30)}
        </p>
      </div>
      <ClipboardEntryActions
        onPin={() => onPin(id)}
        onCopy={() => {
          onCopy(text);

          setIsCoping(true);

          setTimeout(() => {
            setIsCoping(false);
          }, 100);
        }}
        onDelete={() => onDelete(id)}
        onSetLabel={() => onSetLabel(clipboardItem)}
        isPinned={pinned}
      />
    </div>
  );
};

export default ClipboardEntry;
