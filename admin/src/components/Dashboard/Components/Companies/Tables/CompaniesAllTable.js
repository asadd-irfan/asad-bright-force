import React, { useState, useEffect } from 'react';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { loadAppConfigs } from '../../../../../actions/auth';
import { getAllCompanies } from '../../../../../actions/company'
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from '../../../../../common/constants'
import TableComponent from '../../../../Common/TableComponent'

function CompaniesAllTable() {

  const dispatch = useDispatch()
  const history = useHistory();
  const [current, setCurrent] = useState(1);
  const allCompanies = useSelector(state => state.company.allCompanies);
  const allCompaniesCount = useSelector(state => state.company.allCompaniesCount);
  let pageSize = PAGE_LIMIT;

  useEffect(() => {
    dispatch(loadAppConfigs());
    // getPageData(1);
  }, [])

  const goToDetails = (key) => {
    history.push(`/admin/companies/company/${key}`);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'companyId',
      sorter: (a, b) => a.companyId.length - b.companyId.length,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: (a, b) => a.location.length - b.location.length,
    },
    {
      title: 'Industries',
      dataIndex: 'industry',
      sorter: (a, b) => a.industry.length - b.industry.length,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      sorter: (a, b) => a.size.length - b.size.length,
    },

    {
      title: 'No. of Opened positions',
      dataIndex: 'openPositions',
      sorter: (a, b) => a.openPositions.length - b.openPositions.length,
    },
    {
      title: 'No. of Closed positions',
      dataIndex: 'closePositions',
      sorter: (a, b) => a.closePositions.length - b.closePositions.length,
    },
    {
      title: 'Latest Position Opened Date',
      dataIndex: 'openPositionDate',
      sorter: (a, b) => a.openPositionDate.length - b.openPositionDate.length,
    },
    {
      title: 'Latest Position Closed Date',
      dataIndex: 'closePositionDate',
      sorter: (a, b) => a.closePositionDate.length - b.closePositionDate.length,
    },
    {
      title: 'EOR',
      dataIndex: 'eor',
      sorter: (a, b) => a.eor.length - b.eor.length,
    }, {
      title: 'Payroll',
      dataIndex: 'payroll',
      sorter: (a, b) => a.payroll.length - b.payroll.length,
    },
    {
      title: 'Membership Date',
      dataIndex: 'memDate',
      sorter: (a, b) => new Date(a.memDate) - new Date(b.memDate),
    },
    // {
    //   title: 'Last Modified',
    //   dataIndex: 'lastModified',
    //   sorter: (a, b) => new Date(a.lastModified) - new Date(b.lastModified),
    // },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <>
            {<EyeOutlined style={{ fontSize: '20px', color: 'green' }} onClick={() => goToDetails(record.key)} />}
            {/* <DeleteOutlined style={{fontSize: '20px', marginLeft:'7px', color: 'red'}} onClick={() => console.log('recored.key',record.key)}/> */}
          </>
        )
      }
    },
  ];

  const data = allCompanies && allCompanies.map((company) => {
    return {
      key: company._id ? company._id : '',
      companyId: company.companyId ? company.companyId : '',
      status: company.status ? company.status : '',
      name: company.name ? company.name : '',
      size: company.size ? company.size.name : '',
      location: company.location ? company.location : '',
      industry: company.industries ? company.industries.map(industry => {
        return industry.name + ', '
      }) : '',
      // role: company.role ? company.role : '',
      // funding: company.fundingRaised && company.fundingRaised.currency ? company.fundingRaised.amount + ' ' + company.fundingRaised.currency.name : '',
      // positions: company.currentStatus ? company.currentStatus : '',
      // memDate: company.status === 'not-registered' ? 'unregistered' : '',
      memDate: company.status === 'not-registered' ? 'un registered' : moment(company.registrationDate).format(MOMENT_DATE_FORMAT),
      // lastModified: company.updatedAt ? moment(company.updatedAt).format('DD/MM/YY') : '',
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
        totalCount={allCompaniesCount}
        currentPage={current}
        onChangePage={getPageData}
        pageSize={pageSize}
      />
    </React.Fragment>
  )
}

export default CompaniesAllTable;
