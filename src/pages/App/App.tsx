import React, { useEffect, useMemo, useState } from 'react';
import {
  HistoryOutlined,
  SettingOutlined,
  DeleteOutlined,
  LineChartOutlined,
  BarsOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Input, theme, Typography, Button, Tabs } from 'antd';
import type { GetProps } from 'antd';

import GroupedItems, { GroupedItemsType } from './components/GroupedItems';
import { Logo } from '../../assets/Logo';
import { ClipboardItem } from '../../types';

import './App.css';

type SearchProps = GetProps<typeof Input.Search>;

enum Scenes {
  HISTORY = 'History',
  INSIGHTS = 'Insights',
  TRASH = 'Trash',
  SETTINGS = 'Settings',
}

type Scene = Scenes.HISTORY | Scenes.INSIGHTS | Scenes.TRASH | Scenes.SETTINGS;

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const groupItemsByDate = (items: ClipboardItem[]) => {
  return items.reduce((acc, item) => {
    const date = item.timestamp.split('T')[0];

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);

    return acc;
  }, {} as Record<string, ClipboardItem[]>);
};

const groupItemsByCategory = (items: ClipboardItem[]) => {
  return items.reduce((acc, item) => {
    const { category } = item;

    if (category && category.name) {
      const categoryName = category.name;

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(item);
    }

    return acc;
  }, {} as Record<string, ClipboardItem[]>);
};

const App: React.FC = () => {
  const [scene, setScene] = useState<Scene>(Scenes.HISTORY);
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

  const groupedItemsByDate = useMemo(
    () => groupItemsByDate(clipboardItems),
    [clipboardItems]
  );
  const groupedItemsByCategory = useMemo(
    () => groupItemsByCategory(clipboardItems),
    [clipboardItems]
  );

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchClipboardHistory = () => {
      chrome.storage.local.get(['clipboardHistory'], ({ clipboardHistory }) => {
        if (clipboardHistory) {
          setClipboardItems(clipboardHistory);
        }
      });
    };

    fetchClipboardHistory();
  }, []);

  const GroupedByDate: React.FC<{ groupedItems: GroupedItemsType }> = ({
    groupedItems,
  }) => {
    return <GroupedItems groupedItems={groupedItems} groupName="date" />;
  };

  const GroupedByCategory: React.FC<{ groupedItems: GroupedItemsType }> = ({
    groupedItems,
  }) => {
    return <GroupedItems groupedItems={groupedItems} groupName="category" />;
  };

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log('value', value);

  return (
    <Layout>
      <Sider
        className="clipboard-manager-sider"
        trigger={null}
        collapsible
        collapsed
      >
        <div className="demo-logo-vertical">
          <Logo style={{ width: 150, height: 35 }} />
        </div>
        <Menu
          className="clipboard-manager-sider-menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: 'calc(100% - 95px)' }}
          items={[
            {
              key: '1',
              icon: <HistoryOutlined />,
              label: 'History',
              onClick: () => setScene(Scenes.HISTORY),
            },
            {
              key: '2',
              icon: <LineChartOutlined />,
              label: 'Insights',
              onClick: () => setScene(Scenes.INSIGHTS),
            },
            {
              key: '3',
              icon: <DeleteOutlined />,
              label: 'Trash',
              onClick: () => setScene(Scenes.TRASH),
            },
            {
              key: '4',
              icon: <SettingOutlined />,
              label: 'Settings',
              onClick: () => setScene(Scenes.SETTINGS),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Typography.Title className="scene-name">{scene}</Typography.Title>
          <Search
            placeholder="Search clipboard history"
            style={{ width: 500 }}
            allowClear
            onSearch={onSearch}
          />
          <Button color="default" variant="solid">
            Delete Clipboard History
          </Button>
        </Header>
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
          <Tabs
            defaultActiveKey="2"
            items={[
              {
                key: '1',
                label: 'By date',
                children: <GroupedByDate groupedItems={groupedItemsByDate} />,
                icon: <BarsOutlined />,
              },
              {
                key: '2',
                label: 'By category',
                children: (
                  <GroupedByCategory groupedItems={groupedItemsByCategory} />
                ),
                icon: <AppstoreOutlined />,
              },
            ]}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
