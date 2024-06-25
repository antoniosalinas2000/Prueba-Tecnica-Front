import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Select, Row, Col, Checkbox } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('https://392f-191-98-159-22.ngrok-free.app/api/departments');
            setDepartments(response.data);
            setFilteredDepartments(response.data); // Set filteredDepartments initially
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const getParentDepartment = (parentId) => {
        const parent = departments.find(department => department.id === parentId);
        return parent ? parent.name : '';
    };

    const getSubDepartmentsCount = (departmentId) => {
        return departments.filter(department => department.parent_id === departmentId).length;
    };

    const handleSearch = (value) => {
        const filteredData = departments.filter(department => {
            if (selectedColumn === 'parent_id') {
                const parentName = getParentDepartment(department.parent_id);
                return parentName ? parentName.toLowerCase().includes(value.toLowerCase()) : false;
            }
            if (selectedColumn) {
                return department[selectedColumn] ? department[selectedColumn].toString().toLowerCase().includes(value.toLowerCase()) : false;
            }
            return Object.keys(department).some(key =>
                department[key] ? department[key].toString().toLowerCase().includes(value.toLowerCase()) : false
            );
        });
        setFilteredDepartments(filteredData);
    };

    const handleColumnChange = (value) => {
        setSelectedColumn(value);
    };

    const handleReset = () => {
        setSearchText('');
        setSelectedColumn('');
        setFilteredDepartments(departments); // Reset filtered data to original data
    };

    const getColumnFilterProps = dataIndex => {
        const uniqueValues = [...new Set(departments.map(department => {
            if (dataIndex === 'parent_id') return getParentDepartment(department.parent_id);
            return department[dataIndex];
        }))];

        return {
            filters: uniqueValues.map(value => ({
                text: value,
                value: value,
            })),
            onFilter: (value, record) => {
                const recordValue = dataIndex === 'parent_id' ? getParentDepartment(record.parent_id) : record[dataIndex];
                return recordValue === value;
            },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }} className='custom-filters'>
                    <Input
                        placeholder={`Buscar ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        <Checkbox.Group
                            options={uniqueValues.map(value => ({ label: value, value }))}
                            value={selectedKeys}
                            onChange={keys => setSelectedKeys(keys)}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                        />
                    </div>
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            OK
                        </Button>
                        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                            Reiniciar
                        </Button>
                    </Space>
                </div>
            )
        };
    };

    const columns = [
        {
            title: 'División',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnFilterProps('name')
        },
        {
            title: 'División superior',
            dataIndex: 'parent_id',
            key: 'parent_id',
            render: parentId => getParentDepartment(parentId),
            sorter: (a, b) => getParentDepartment(a.parent_id).localeCompare(getParentDepartment(b.parent_id)),
            ...getColumnFilterProps('parent_id')
        },
        {
            title: 'Colaboradores',
            dataIndex: 'employee_count',
            key: 'employee_count',
            sorter: (a, b) => a.employee_count - b.employee_count,
            ...getColumnFilterProps('employee_count')
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
            key: 'level',
            sorter: (a, b) => a.level - b.level,
            ...getColumnFilterProps('level')
        },
        {
            title: 'Subdivisiones',
            key: 'subdivisions',
            render: (_, record) => <span>{getSubDepartmentsCount(record.id)} <PlusCircleOutlined style={{ color: '#52c41a' }} /></span>,
            sorter: (a, b) => getSubDepartmentsCount(a.id) - getSubDepartmentsCount(b.id),
        },
        {
            title: 'Embajadores',
            dataIndex: 'ambassador_name',
            key: 'ambassador_name',
            ...getColumnFilterProps('ambassador_name')
        },
    ];

    return (
        <div className='main-table'>
            <div className="table-header">
                <div className='view-items'>
                    <span className="view-item-selected">Listado</span>
                    <span className="view-item">Árbol</span>
                </div>
                <Col>
                    <Space>
                        <Select
                            placeholder="Columna"
                            style={{ width: 200 }}
                            value={selectedColumn}
                            onChange={handleColumnChange}
                        >
                            <Option value="name">División</Option>
                            <Option value="parent_id">División superior</Option>
                            <Option value="employee_count">Colaboradores</Option>
                            <Option value="level">Nivel</Option>
                            <Option value="ambassador_name">Embajadores</Option>
                        </Select>
                        <Input
                            placeholder="Buscar"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onPressEnter={() => handleSearch(searchText)}
                            style={{ width: 200 }}
                        />
                        <Button
                            type="primary"
                            onClick={() => handleSearch(searchText)}
                            icon={<SearchOutlined />}
                        >
                            Buscar
                        </Button>
                        <Button
                            onClick={handleReset}
                        >
                            Reestablecer Búsqueda
                        </Button>
                    </Space>
                </Col>
            </div>
            <Table columns={columns} dataSource={filteredDepartments} rowKey="id" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default DepartmentList;
