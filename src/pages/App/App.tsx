import React, { useRef } from 'react';
import { Layout, Input, theme, Space, Button, Typography, Flex } from 'antd';
import type { GetProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CSSTransition } from 'react-transition-group';

import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';
import AppScene from './scenes';
import { useAppContext } from './hooks/useAppContext';

import './App.css';

type SearchProps = GetProps<typeof Input.Search>;

const { Content, Header: SlideInToolbar } = Layout;

const App: React.FC = () => {
  const { checkedItems, scene, setScene, setCheckedItems } = useAppContext();
  const nodeRef = useRef(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSearch: SearchProps['onSearch'] = (value) =>
    console.log('value', value);

  return (
    <Layout>
      <SidebarMenu onSceneChange={setScene} />
      <Layout style={{ position: 'relative' }}>
        <CSSTransition
          in={checkedItems.length > 0}
          nodeRef={nodeRef}
          timeout={100}
          classNames={'slide'}
          unmountOnExit
        >
          <SlideInToolbar
            ref={nodeRef}
            className="app-header"
            style={{
              background: '#fff',
              position: 'absolute',
              width: '100%',
              zIndex: 1,
            }}
          >
            <Flex
              style={{ width: '100%' }}
              justify="space-around"
              align="center"
            >
              <Space>
                <Button
                  color="default"
                  variant="text"
                  shape="circle"
                  icon={<CloseOutlined />}
                  onClick={() => setCheckedItems([])}
                />
                <Typography.Text>
                  {checkedItems.length} selected
                </Typography.Text>
              </Space>
              <Button color="danger" variant="outlined" shape="round">
                Move to trash
              </Button>
            </Flex>
          </SlideInToolbar>
        </CSSTransition>
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
