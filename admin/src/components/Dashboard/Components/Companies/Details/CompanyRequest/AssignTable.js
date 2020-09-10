import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { loadAppConfigs } from '../../../../../../actions/auth';
import { getAllCompanies } from '../../../../../../actions/company'
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from '../../../../../../common/constants'
import TableComponent from '../../../../../Common/TableComponent'
import moment from 'moment'

function AssignTable() {

  const dispatch = useDispatch()
  const [current, setCurrent] = useState(1);
  const allCompanies = useSelector(state => state.company.allCompanies);
  const allCompaniesCount = useSelector(state => state.company.allCompaniesCount);
  let pageSize = PAGE_LIMIT;
  useEffect(() => {
    dispatch(loadAppConfigs());
    getPageData(1);
  }, [])

  // const goToDetails = (key) => {
  //   history.push(`/admin/company/${key}`);
  // }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'City/Region',
      dataIndex: 'city',
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: 'Memb. Date',
      dataIndex: 'memDate',
      sorter: (a, b) => new Date(a.regDate) - new Date(b.regDate),
    },
  ];

  const data = allCompanies && allCompanies.map((company) => {

    return {
      key: company._id ? company._id : '',
      name: company.name ? company.name : '',
      size: company.size ? company.size.name : '',
      regDate: company.status === 'not-registered' ? 'unregistered' : moment(company.registrationDate).format(MOMENT_DATE_FORMAT),
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
        isRowSelection={true}
        // rowClickUrl='/admin/talents'
        totalCount={allCompaniesCount}
        currentPage={current}
        onChangePage={getPageData}
        pageSize={pageSize}
      />
    </React.Fragment>
  )
}

export default AssignTable;
