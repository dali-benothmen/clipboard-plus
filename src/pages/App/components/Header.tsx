import React, { useCallback, useState } from 'react';
import { Input, Typography, Button, Layout, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAppContext } from '../hooks/useAppContext';
import { debounce } from 'lodash';

interface HeaderProps {
  scene: string;
  onDeleteHistory: () => void;
}

const { Header } = Layout;

const AppHeader: React.FC<HeaderProps> = ({ scene, onDeleteHistory }) => {
  const { clipboardItems, setFilteredClipboardItems } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      const trimmedTerm = searchTerm.trim();

      if (!trimmedTerm) {
        setFilteredClipboardItems(clipboardItems);
        setOptions([]);

        return;
      }

      const filteredItems = clipboardItems.filter((item) =>
        item.label.toLowerCase().includes(trimmedTerm.toLowerCase())
      );

      const autocompleteOptions = filteredItems.map((item) => ({
        value: item.label,
      }));

      setOptions(autocompleteOptions);
    }, 300),
    [clipboardItems, setFilteredClipboardItems]
  );

  const handleSearch = (searchText: string) => {
    setSearchQuery(searchText);

    if (!searchText) {
      setOptions([]);
      setFilteredClipboardItems([]);
    } else {
      debouncedSearch(searchText);
    }
  };

  const handleSelect = (value: string) => {
    const filteredItems = clipboardItems.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredClipboardItems(filteredItems);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredClipboardItems([]);
    setOptions([]);
  };

  return (
    <Header className="app-header">
      <Typography.Title className="scene-name">{scene}</Typography.Title>
      <AutoComplete
        value={searchQuery}
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
      >
        <Input
          allowClear
          onClear={handleClearSearch}
          placeholder="Search clipboard history"
          prefix={<SearchOutlined />}
          style={{ width: 500 }}
        />
      </AutoComplete>
      <Button type="default" variant="solid" onClick={onDeleteHistory}>
        Clear Clipboard Data
      </Button>
    </Header>
  );
};

export default AppHeader;
