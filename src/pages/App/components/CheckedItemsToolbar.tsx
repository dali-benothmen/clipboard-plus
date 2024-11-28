import React from 'react';
import { Button, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CSSTransition } from 'react-transition-group';
import { useAppContext } from '../hooks/useAppContext';
import { Scenes } from '../scenes';

type CheckedItemsToolbarProps = {
  visible: boolean;
  checkedItemsCount: number;
  onClearSelection: () => void;
  onMoveToTrash: () => void;
  onDelete: () => void;
  nodeRef: React.RefObject<HTMLDivElement>;
};

const CheckedItemsToolbar: React.FC<CheckedItemsToolbarProps> = ({
  visible,
  checkedItemsCount,
  onClearSelection,
  onMoveToTrash,
  onDelete,
  nodeRef,
}) => {
  const { scene } = useAppContext();

  return (
    <CSSTransition
      in={visible}
      nodeRef={nodeRef}
      timeout={100}
      classNames="slide"
      unmountOnExit
    >
      <div
        ref={nodeRef}
        style={{
          background: '#fff',
          position: 'absolute',
          width: '100%',
          zIndex: 1,
          padding: '0 20%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 64,
        }}
      >
        <Space>
          <Button
            type="text"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={onClearSelection}
          />
          <Typography.Text>{checkedItemsCount} selected</Typography.Text>
        </Space>
        <Button
          color="danger"
          variant="outlined"
          shape="round"
          onClick={scene === Scenes.TRASH ? onDelete : onMoveToTrash}
        >
          {scene === Scenes.TRASH ? 'Delete from Trash' : 'Move to Trash'}
        </Button>
      </div>
    </CSSTransition>
  );
};
export default CheckedItemsToolbar;
