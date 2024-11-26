import React, { useCallback, useEffect, useState } from 'react';
import { Input, Typography, Button, Layout } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'debounce';
import { useAppContext } from '../hooks/useAppContext';
import { useHeaderContext } from '../hooks/useHeaderContext';

interface HeaderProps {
  scene: string;
  onDeleteHistory: () => void;
}

const { Header } = Layout;

const AppHeader: React.FC<HeaderProps> = ({ scene, onDeleteHistory }) => {
  const { clipboardItems, setFilteredClipboardItems, setIsSearching } =
    useAppContext();

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      const trimmedTerm = searchTerm.trim();
      if (!trimmedTerm) {
        setFilteredClipboardItems(clipboardItems);
        return;
      }

      const filteredItems = clipboardItems.filter((item) =>
        item.label.toLowerCase().includes(trimmedTerm.toLowerCase())
      );

      setFilteredClipboardItems(filteredItems);
    }, 300),
    [clipboardItems, setFilteredClipboardItems]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    setIsSearching(true);

    debouncedSearch(searchTerm);

    setSearchQuery(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredClipboardItems(clipboardItems);
    setIsSearching(false);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setFilteredClipboardItems(clipboardItems);
  }, [clipboardItems]);

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  return (
    <Header className="app-header">
      <Typography.Title className="scene-name">{scene}</Typography.Title>
      <Input
        allowClear
        onClear={handleClearSearch}
        placeholder="Search clipboard history"
        value={searchQuery}
        prefix={<SearchOutlined />}
        style={{ width: 500 }}
        onChange={handleInputChange}
      />
      <Button type="default" variant="solid" onClick={onDeleteHistory}>
        Delete Clipboard History
      </Button>
    </Header>
  );
};

export default AppHeader;
