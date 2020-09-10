import React from 'react';
import { Table, Pagination } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectCompanyForAssign } from '../../actions/company'

function TableComponent({
  columns,
  data,
  rowClickUrl,
  totalCount,
  currentPage,
  onChangePage,
  pageSize,
  isRowSelection
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch(selectCompanyForAssign(selectedRows[0]))
    },
  };

  return (
    <React.Fragment>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={data}
        rowSelection={isRowSelection && {
          type: 'radio',
          ...rowSelection,
        }}
        pagination={false}
      // onRow={(record) => {
      //   return {
      //     onClick: event => {
      //       if (rowClickUrl !== undefined && rowClickUrl !== null && rowClickUrl !== '') {
      //         history.push(`${rowClickUrl}/${record.key}`);
      //       }
      //     },
      //   };
      // }}
      />
      <Pagination
        onChange={onChangePage}
        total={totalCount}
        current={currentPage}
        pageSize={pageSize}
        style={{ float: 'right' }}
      />
    </React.Fragment>
  )
}

export default TableComponent;
