import React, { useState } from 'react';
import ClipboardEntryActions from './ClipboardEntryActions';
import { truncateText } from '../../../utils/truncateText';
import { ClipboardItem } from '../../../types';

interface ClipboardEntryProps {
  clipboardItem: ClipboardItem;
  onPin: (id: string) => void;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
}

const ClipboardEntry: React.FC<ClipboardEntryProps> = (props) => {
  const { clipboardItem, onCopy, onPin, onDelete } = props;
  const { id, text, pinned, website } = clipboardItem;

  const [isCoping, setIsCoping] = useState(false);

  return (
    <div
      key={id}
      className="clipboard-entry my-4 mx-2.5 flex justify-between items-center"
    >
      <div className="clipboard-entry-content flex items-center">
        <img
          src={website?.favicon}
          alt={website?.name}
          className="clipboard-entry-icon mr-2.5 h-4 w-4"
        />
        <p
          className={`clipboard-entry-text text-[#4448ff] font-semibold transition-colors duration-100 ease-in-out ${
            isCoping ? 'text-green-400' : ''
          }`}
        >
          {truncateText(text)}
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
        isPinned={pinned}
      />
    </div>
  );
};

export default ClipboardEntry;
