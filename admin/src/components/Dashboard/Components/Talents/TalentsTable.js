import React, { useState, useEffect } from 'react';
import { EyeOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { loadAppConfigs } from './../../../../actions/auth';
import { getTalentsData } from '../../../../actions/talent'
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from '../../../../common/constants'
import TableComponent from '../../../Common/TableComponent'

function TalentsTable() {

  const dispatch = useDispatch()
  const history = useHistory();
  const [current, setCurrent] = useState(1);
  const talents = useSelector(state => state.talents.talents);
  const allTalentsCount = useSelector(state => state.talents.allTalentsCount);

  const appConfigs = useSelector(state => state.auth.appConfigs);
  let typeOptions = appConfigs && appConfigs['roles']
  let roleOptions = appConfigs && appConfigs['preferred-role']

  let pageSize = PAGE_LIMIT;
  useEffect(() => {
    dispatch(loadAppConfigs());
    getPageData(1);
  }, [])

  const goToDetails = (key) => {
    history.push(`/admin/talents/${key}`);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'talentId',
      sorter: (a, b) => a.talentId.length - b.talentId.length,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      // ...getColumnSearchProps('name'),
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   sorter: (a, b) => a.email.length - b.email.length,
    //   // ...getColumnSearchProps('age'),
    // },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    //   sorter: (a, b) => a.phone.length - b.phone.length,
    //   // ...getColumnSearchProps('address'),
    // },
    {
      title: 'Type',
      dataIndex: 'role',
      sorter: (a, b) => a.role.length - b.role.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'Main Role',
      dataIndex: 'mainRole',
      sorter: (a, b) => a.mainRole.length - b.mainRole.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'Secondary Role',
      dataIndex: 'secondaryRole',
      sorter: (a, b) => a.secondaryRole.length - b.secondaryRole.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'No. Positions sent',
      dataIndex: 'positionsSent',
      // sorter: (a, b) => a.role.length - b.role.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'No. Applications',
      dataIndex: 'applications',
      // sorter: (a, b) => a.role.length - b.role.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'No. Interviews',
      dataIndex: 'interviews',
      // sorter: (a, b) => a.role.length - b.role.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'No. Interviews Passed',
      dataIndex: 'interviewsPassed',
      // sorter: (a, b) => a.role.length - b.role.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'No. Hires',
      dataIndex: 'hires',
      // sorter: (a, b) => a.role.length - b.role.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'Status Change Date',
      dataIndex: 'statusChangeDate',
      // sorter: (a, b) => a.status.length - b.status.length,
    },
    // {
    //   title: 'Job Search / Availability',
    //   dataIndex: 'available',
    //   sorter: (a, b) => a.available.length - b.available.length,
    //   // ...getColumnSearchProps('address'),
    // },
    // {
    //   title: 'Reg. Date',
    //   dataIndex: 'regDate',
    //   sorter: (a, b) => new Date(a.regDate) - new Date(b.regDate),
    //   // ...getColumnSearchProps('address'),
    // },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      sorter: (a, b) => new Date(a.lastModified) - new Date(b.lastModified),
      // ...getColumnSearchProps('address'),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <>
            {/* <EditOutlined style={{ fontSize: '20px', color: 'blue' }} onClick={() => goToDetails(record.key)} /> */}
            <EyeOutlined style={{ fontSize: '20px', marginLeft: '7px', color: 'green' }} onClick={() => goToDetails(record.key)} />
          </>
        )
      }
    },
  ];

  const data = talents && talents.map((talent, index) => {
    let typeName = '';
    let mainRoleName = '';
    let secondaryRoleName = '';

    if (talent && talent.role) {
      typeOptions && typeOptions.filter(type => {
        if (type._id === talent.role) {
          typeName = type.name
        }
      })
    }

    if (talent && talent.preferredRoles) {
      roleOptions && roleOptions.filter(role => {
        if (role._id === talent.preferredRoles.mainRole.name) {
          mainRoleName = role.name
        }
      })
      roleOptions && roleOptions.filter(role => {
        if (role._id === talent.preferredRoles.secondaryRole.name) {
          secondaryRoleName = role.name
        }
      })
    }
    return {
      key: talent._id ? talent._id : '',
      talentId: talent.talentId ? talent.talentId : '',
      name: talent.name ? talent.name : '',
      // email: talent.email ? talent.email : '',
      // phone: talent.phone ? talent.phone : '',
      role: typeName,
      mainRole: mainRoleName,
      secondaryRole: secondaryRoleName,
      status: talent.currentStatus ? talent.currentStatus : '',
      available: talent.jobSearchStatus ? talent.jobSearchStatus : '',
      // regDate: talent.createdAt ? moment(talent.createdAt).format('DD/MM/YY') : '',
      lastModified: talent.updatedAt ? moment(talent.updatedAt).format(MOMENT_DATE_FORMAT) : '',
    }
  })

  const getPageData = (value) => {
    setCurrent(value)
    let params = `?page=${value}&limit=${pageSize}`;
    dispatch(getTalentsData(params))
  }
  return (
    <React.Fragment>
      <TableComponent
        columns={columns}
        data={data}
        rowClickUrl='/admin/talents'
        totalCount={allTalentsCount}
        currentPage={current}
        onChangePage={getPageData}
        pageSize={pageSize}
      />
    </React.Fragment>
  )
}

export default TalentsTable;
