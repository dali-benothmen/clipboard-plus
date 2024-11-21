import React from 'react';
import { HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Logo } from '../../assets/Logo';

import './App.css';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
          items={[
            {
              key: '1',
              icon: <HistoryOutlined />,
              label: 'History',
            },
            {
              key: '2',
              icon: <SettingOutlined />,
              label: 'Settings',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
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
