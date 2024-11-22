import React, { useState } from 'react';
import { Layout, Input, theme } from 'antd';
import type { GetProps } from 'antd';

import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';
import AppScene, { Scene, Scenes } from './scenes';

import './App.css';

type SearchProps = GetProps<typeof Input.Search>;

const { Content } = Layout;

const App: React.FC = () => {
  const [scene, setScene] = useState<Scene>(Scenes.HISTORY);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSearch: SearchProps['onSearch'] = (value) =>
    console.log('value', value);

  return (
    <Layout>
      <SidebarMenu onSceneChange={setScene} />
      <Layout>
        <Header
          scene={scene}
          onSearch={onSearch}
          onDeleteHistory={() => console.log('Deleted')}
        />
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
