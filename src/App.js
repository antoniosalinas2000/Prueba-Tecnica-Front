import React from 'react';
import './App.css';
import { Layout, Menu, Table, Button, Input, Space, Dropdown, Checkbox } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import DepartmentList from './components/DepartmentList';

const { Header, Content } = Layout;

function App() {
  return (
    <div>
      <Layout className="layout">

        <Header className="header">
          <div className='header-left'>
            <img src='x.png' className="logo" alt="logo" />
            <Menu theme="none" mode="horizontal" defaultSelectedKeys={['2']} style={{ lineHeight: '64px' }}>
              <Menu.Item key="1">Dashboard</Menu.Item>
              <div className="selected-header">
                <Menu.Item key="2">Organización</Menu.Item>
              </div>
              <Menu.Item key="3">Modelos</Menu.Item>
              <Menu.Item key="4">Seguimiento</Menu.Item>
            </Menu>
          </div>
          <div className='header-right'>
            <img src='avatar.png' className="avatar" alt="avatar" />
            <span className="username">Administrador</span>
          </div>
        </Header>

        <div className='organizacion-header'>
          <h2 className='title'>Organización</h2>
          <div className='table-header'>
            <div className='options-header'>
              <span className='options-header-item-selected'>Divisiones</span>
              <span className='options-header-item'>Colaboradores</span>
            </div>
            <div className=''>
              <img src='Agregar.jpg' className="image-icon" alt="search" />
              <img src='Importar.jpg' className="image-icon" alt="filter" />
              <img src='Exportar.jpg' className="image-icon" alt="add" />
            </div>
          </div>


        </div>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <DepartmentList />
          </div>
        </Content>
      </Layout>
    </div>

  );
}

export default App;
