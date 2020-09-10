import React, { useState, useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { loadAppConfigs } from '../../../../../actions/auth';
import { getAllCompaniesPositions } from '../../../../../actions/positions'
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from '../../../../../common/constants'
import TableComponent from '../../../../Common/TableComponent'

function AllCompaniesPositionsTable() {

  const dispatch = useDispatch()
  const history = useHistory();
  const [current, setCurrent] = useState(1);
  const [allPositions, setAllPositions] = useState([]);
  const allCompaniesPositions = useSelector(state => state.positions.allCompaniesPositions);
  const allCompaniesPositionsCount = useSelector(state => state.positions.allCompaniesPositionsCount);
  let pageSize = PAGE_LIMIT;

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, [])

  useEffect(() => {
    let updatedArray = []
    allCompaniesPositions && allCompaniesPositions.map(pos => {
      if (pos.sentToAccountManager) {
        updatedArray.push(pos)
      }
    })
    setAllPositions(updatedArray)
  }, [allCompaniesPositions])
  console.log('allCompaniesPositions', allCompaniesPositions)
  const goToDetails = (key) => {
    history.push(`/admin/positions/company/${key}`);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'positionId',
      sorter: (a, b) => a.positionId.length - b.positionId.length,
    },
    {
      title: 'Date',
      dataIndex: 'createdDate',
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: 'Position Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      sorter: (a, b) => a.companyName.length - b.companyName.length,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: 'Engagement',
      dataIndex: 'engagement',
      sorter: (a, b) => a.engagement.length - b.engagement.length,
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      sorter: (a, b) => new Date(a.lastModified) - new Date(b.lastModified),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <>
            {<EditOutlined style={{ fontSize: '20px', color: 'blue' }} onClick={() => goToDetails(record.key)} />}
            {/* <DeleteOutlined style={{fontSize: '20px', marginLeft:'7px', color: 'red'}} onClick={() => console.log('recored.key',record.key)}/> */}
          </>
        )
      }
    },
  ];

  const data = allPositions && allPositions.map((position) => {
    return {
      key: position._id ? position._id : '',
      createdDate: position.createdAt ? moment(position.createdAt).format(MOMENT_DATE_FORMAT) : '',
      title: position.title ? position.title : '',
      positionId: position.positionId ? position.positionId : '',
      companyName: position.companyId?.name ? position.companyId?.name : '',
      type: position.name?.name ? position.name?.name : '',
      role: position.role?.name?.name ? position.role?.name?.name : '',
      engagement: position.employmentType?.name ? position.employmentType?.name : '',
      status: (position.status) ? <span className={
        (position.status === 'Open' && position.lastGroupStatus === 'un-processed') ? 'status-open-unprocess status-wrapper'
          : (position.status === 'Open' && position.lastGroupStatus === 'processed') ? 'status-open-process status-wrapper'
            : (position.status === 'Open' && position.lastGroupStatus === 'action-required') ? 'status-open-action-required status-wrapper'
              : (position.status === 'Open' && position.lastGroupStatus === 'fulfilled') ? 'status-open-fulfilled status-wrapper'
                : position.status === 'Closed - Hired' ? 'status-closed-hired status-wrapper'
                  : position.status === 'Closed - Other' ? 'status-closed-other status-wrapper'
                    : ''
      }>
        {position.lastGroupStatus ? position.status + ' - ' + position.lastGroupStatus : position.status}
      </span> : '',
      lastModified: position.updatedAt ? moment(position.updatedAt).format(MOMENT_DATE_FORMAT) : '',
    }
  })

  const getPageData = (value) => {
    setCurrent(value)
    let params = `?page=${value}&limit=${pageSize}`;
    dispatch(getAllCompaniesPositions(params))
  }
  return (
    <React.Fragment>
      <TableComponent
        columns={columns}
        data={data}
        totalCount={allCompaniesPositionsCount}
        currentPage={current}
        onChangePage={getPageData}
        pageSize={pageSize}
      />
    </React.Fragment>
  )
}

export default AllCompaniesPositionsTable;
