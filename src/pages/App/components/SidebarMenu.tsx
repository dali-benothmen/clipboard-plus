import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HistoryOutlined,
  SettingOutlined,
  DeleteOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

import { Logo } from '../../../assets/Logo';
import { Scene, Scenes } from '../scenes';

const { Sider } = Layout;

interface SidebarMenuProps {
  onSceneChange: (scene: Scene) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onSceneChange }) => (
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
          onClick: () => onSceneChange(Scenes.HISTORY),
        },
        {
          key: '2',
          icon: <LineChartOutlined />,
          label: 'Insights',
          onClick: () => onSceneChange(Scenes.INSIGHTS),
        },
        {
          key: '3',
          icon: <DeleteOutlined />,
          label: 'Trash',
          onClick: () => onSceneChange(Scenes.TRASH),
        },
        {
          key: '4',
          icon: <SettingOutlined />,
          label: 'Settings',
          onClick: () => onSceneChange(Scenes.SETTINGS),
        },
      ]}
    />
  </Sider>
);

export default SidebarMenu;
