import React, { useState, useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { loadAppConfigs } from '../../../../../actions/auth';
import { getAllCompanies } from '../../../../../actions/company'
import { getAllAccountsManager } from '../../../../../actions/talentManager'
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from '../../../../../common/constants'
import TableComponent from '../../../../Common/TableComponent'

function CompaniesAllTable() {

  const dispatch = useDispatch()
  const history = useHistory();
  const [current, setCurrent] = useState(1);
  const allCompanies = useSelector(state => state.talentManager.allAccountManagers);
  const allAccountManagers = useSelector(state => state.talentManager.allAccountManagers);
  // const allCompaniesCount = useSelector(state => state.company.allCompaniesCount);
  let pageSize = PAGE_LIMIT;

  useEffect(() => {
    dispatch(loadAppConfigs());
    dispatch(getAllAccountsManager(''));
    // getPageData(1);
  }, [])
  // console.log('allAccountManagers',allAccountManagers)
  const goToDetails = (key) => {
    history.push(`/admin/staff/account-managers/${key}`);
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.location.length - b.location.length,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.industry.length - b.industry.length,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: (a, b) => a.size.length - b.size.length,
    },
    {
      title: 'Reg. Date',
      dataIndex: 'memDate',
      sorter: (a, b) => new Date(a.memDate) - new Date(b.memDate),
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      sorter: (a, b) => new Date(a.lastModified) - new Date(b.lastModified),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <>
            {<EditOutlined style={{ fontSize: '20px', color: 'blue' }} onClick={() => goToDetails(record.key)} />}
          </>
        )
      }
    },
  ];

  const data = allAccountManagers && allAccountManagers.map((manager) => {
    return {
      key: manager._id ? manager._id : '',
      name: manager.name ? manager.name : '',
      email: manager.email ? manager.email : '',
      phone: manager.phone ? manager.phone : '',
      location: manager.location.city && manager.location.country ? manager.location.city + ', ' + manager.location.country : '',
      memDate: manager.createdAt ? moment(manager.createdAt).format(MOMENT_DATE_FORMAT) : '',
      lastModified: manager.updatedAt ? moment(manager.updatedAt).format(MOMENT_DATE_FORMAT) : '',
    }
  })

  const getPageData = (value) => {
    setCurrent(value)
    let params = `?page=${value}&limit=${pageSize}`;
    dispatch(getAllCompanies(params))
  }
  return (
    <React.Fragment>
      <TableComponent
        columns={columns}
        data={data}
        // rowClickUrl='/admin/companies/company'
        // totalCount={allCompaniesCount}
        currentPage={current}
        onChangePage={getPageData}
        pageSize={pageSize}
      />
    </React.Fragment>
  )
}

export default CompaniesAllTable;
