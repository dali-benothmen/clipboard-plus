import React, { useState } from 'react';
import {
  HistoryOutlined,
  SettingOutlined,
  DeleteOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Input, theme, Typography, Button } from 'antd';
import { Logo } from '../../assets/Logo';
import type { GetProps } from 'antd';

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

const App: React.FC = () => {
  const [scene, setScene] = useState<Scene>(Scenes.HISTORY);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Clipboard History
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
