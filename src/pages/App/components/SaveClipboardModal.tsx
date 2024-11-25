import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, Input, InputRef, Modal, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { useModalContext } from '../hooks/useModalContext';
import { useAppContext } from '../hooks/useAppContext';
import { Category } from '../../../types';

interface SaveClipboardModalProps {
  onCreateCategory: (categoryName: string) => void;
  onSaveClipboard: (clipboardId: string, categoryName: string) => void;
}

const SaveClipboardModal: React.FC<SaveClipboardModalProps> = ({
  onCreateCategory,
  onSaveClipboard,
}) => {
  const {
    isModalOpen,
    isCreateCategoryFormVisible,
    setIsModalOpen,
    setIsCreateCategoryFormVisible,
  } = useModalContext();
  const { categories, savedClipboardId } = useAppContext();

  const createCategoryInputRef = useRef<InputRef>(null);
  const categoryRefs = useRef(new Map<string, HTMLElement | null>());

  const [searchCategoryInput, setSearchCategoryInput] = useState<string>('');
  const [filteredCategories, setFilteredCategories] =
    useState<Category[]>(categories);
  const [highlightedCategoryId, setHighlightedCategoryId] = useState<
    string | null
  >(null);

  const defaultCategory = categories.find(
    (category) => category.name === 'General'
  );

  useEffect(() => {
    if (highlightedCategoryId) {
      const targetElement = categoryRefs.current.get(highlightedCategoryId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const timeout = setTimeout(() => {
          setHighlightedCategoryId(null);
        }, 2000);

        return () => clearTimeout(timeout);
      }
    }
  }, [highlightedCategoryId]);

  useEffect(() => {
    if (isModalOpen) {
      setFilteredCategories(categories);
    }
  }, [categories, isModalOpen]);

  const handleSearchCategory = (searchTerm: string) => {
    setSearchCategoryInput(searchTerm);

    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCategories(filtered);
  };

  const handleCreateCategory = (categoryName: string) => {
    if (!categoryName.trim()) return;

    onCreateCategory(categoryName);

    setTimeout(() => {
      const updatedCategories = [...categories];
      const newCategory = updatedCategories[updatedCategories.length - 1];

      if (newCategory) {
        setHighlightedCategoryId(newCategory.id);
      }
    }, 200);
  };

  const Category = ({
    id,
    categoryName,
    onSaveClipboard,
  }: {
    id: string;
    categoryName: string;
    onSaveClipboard: (clipboardId: string, categoryName: string) => void;
  }) => (
    <Flex
      justify="space-between"
      align="center"
      ref={(element) => {
        if (element) {
          categoryRefs.current.set(id, element);
        } else {
          categoryRefs.current.delete(id);
        }
      }}
      style={{
        marginBottom: 12,
        marginRight: 3,
      }}
    >
      <Typography.Text>
        <strong>{categoryName}</strong>
      </Typography.Text>
      <Button onClick={() => onSaveClipboard(savedClipboardId, categoryName)}>
        Save
      </Button>
    </Flex>
  );

  const CreateCategoryForm = () => (
    <Flex
      justify="justify-content"
      align="center"
      style={{
        marginTop: 10,
        padding: '20px 10px',
        border: '1px dashed #d1d1d1',
        borderRadius: 5,
      }}
    >
      <Input
        placeholder="Category name"
        ref={createCategoryInputRef}
        onPressEnter={() => {
          handleCreateCategory(
            createCategoryInputRef.current?.input?.value ?? ''
          );
        }}
      />
      <Button
        color="primary"
        variant="outlined"
        style={{ margin: '0 10px' }}
        onClick={() =>
          handleCreateCategory(
            createCategoryInputRef.current?.input?.value ?? ''
          )
        }
      >
        Create
      </Button>
      <Button onClick={() => setIsCreateCategoryFormVisible(false)}>
        Cancel
      </Button>
    </Flex>
  );

  return (
    <Modal
      closable
      title="Save to category"
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen(false);
      }}
    >
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        Choose a category to save this item or create a new one. Categories help
        you stay organized and find your saved items easily
      </Typography.Text>
      <Input
        placeholder="Search category"
        value={searchCategoryInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleSearchCategory(e.target.value)
        }
        prefix={<SearchOutlined />}
        style={{ margin: '20px 0' }}
      />
      <Flex vertical justify="space-between" className="category-list">
        {!defaultCategory && (
          <Category
            id={'default'}
            categoryName="General"
            onSaveClipboard={() => onSaveClipboard(savedClipboardId, 'General')}
          />
        )}
        {filteredCategories.map(({ name, id }) => (
          <Category
            key={id}
            id={id}
            categoryName={name}
            onSaveClipboard={() => onSaveClipboard(savedClipboardId, name)}
          />
        ))}
      </Flex>
      {isCreateCategoryFormVisible ? (
        <CreateCategoryForm />
      ) : (
        <Flex justify="center" align="center" style={{ marginTop: 10 }}>
          <Button
            icon={<PlusOutlined />}
            variant="outlined"
            color="primary"
            style={{ width: '100%', marginTop: 15 }}
            onClick={() => setIsCreateCategoryFormVisible(true)}
          >
            Create New Category
          </Button>
        </Flex>
      )}
    </Modal>
  );
};

export default SaveClipboardModal;
