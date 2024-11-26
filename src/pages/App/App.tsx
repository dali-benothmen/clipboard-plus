import React, { useRef } from 'react';
import { Layout, theme } from 'antd';

import CheckedItemsToolbar from './components/CheckedItemsToolbar';
import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';
import AppScene from './scenes';
import { useAppContext } from './hooks/useAppContext';
import { ClipboardItem } from '../../types';

import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  const { checkedItems, scene, setScene, setCheckedItems, setClipboardItems } =
    useAppContext();
  const nodeRef = useRef(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMoveToTrash = (checkedItems: string[]) => {
    chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
      const updatedItems = clipboardHistory.map((item: ClipboardItem) =>
        checkedItems.includes(item.id)
          ? { ...item, isTrashed: !item.isTrashed }
          : item
      );

      chrome.storage.local.set({ clipboardHistory: updatedItems }, () => {
        setClipboardItems(updatedItems);
        setCheckedItems([]);
      });
    });
  };

  return (
    <Layout>
      <SidebarMenu onSceneChange={setScene} />
      <Layout style={{ position: 'relative' }}>
        <CheckedItemsToolbar
          visible={checkedItems.length > 0}
          checkedItemsCount={checkedItems.length}
          onClearSelection={() => setCheckedItems([])}
          onMoveToTrash={() => handleMoveToTrash(checkedItems)}
          nodeRef={nodeRef}
        />
        <Header scene={scene} onDeleteHistory={() => console.log('Deleted')} />
        <Content
          style={{
            margin: '24px 90px',
            padding: 24,
            minHeight: 280,
            overflowY: 'scroll',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <AppScene scene={scene} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
