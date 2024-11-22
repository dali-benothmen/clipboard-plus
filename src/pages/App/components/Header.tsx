import React from 'react';
import { Input, Typography, Button, Layout } from 'antd';

interface HeaderProps {
  scene: string;
  onSearch: (value: string) => void;
  onDeleteHistory: () => void;
}

const { Header } = Layout;
const { Search } = Input;

const AppHeader: React.FC<HeaderProps> = ({
  scene,
  onSearch,
  onDeleteHistory,
}) => {
  return (
    <Header className="app-header">
      <Typography.Title className="scene-name">{scene}</Typography.Title>
      <Search
        placeholder="Search clipboard history"
        onSearch={onSearch}
        allowClear
        style={{ width: 500 }}
      />
      <Button type="default" variant="solid" onClick={onDeleteHistory}>
        Delete Clipboard History
      </Button>
    </Header>
  );
};

export default AppHeader;
