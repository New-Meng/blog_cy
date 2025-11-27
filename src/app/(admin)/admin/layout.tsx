"use client";

import React, { useState } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown } from 'antd';
import { UserOutlined, TagsOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/admin/tagManage',
      icon: <TagsOutlined />,
      label: <Link href="/admin/tagManage">标签管理</Link>,
    },
    // Add more items here as needed
  ];

  // Placeholder for current user name
  const currentUserName = "Admin User"; 

  const userMenu = {
    items: [
        {
            key: 'logout',
            label: '退出登录',
        }
    ]
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu 
            theme="dark" 
            defaultSelectedKeys={[pathname]} 
            mode="inline" 
            items={menuItems} 
            selectedKeys={[pathname]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Avatar icon={<UserOutlined />} />
                 <Dropdown menu={userMenu}>
                    <span style={{ cursor: 'pointer' }}>{currentUserName}</span>
                 </Dropdown>
            </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100%'
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
