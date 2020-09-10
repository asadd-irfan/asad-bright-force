import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { loadAppConfigs } from "../../../../../actions/auth";
import { getAllCompanyRequests } from "../../../../../actions/company";
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from "../../../../../common/constants";
import TableComponent from "../../../../Common/TableComponent";

function CompanyRequestsTable() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [current, setCurrent] = useState(1);
  const [tableData, setTableData] = useState([]);
  const companyRequests = useSelector((state) => state.company.companyRequests);
  const companyRequestsCount = useSelector(
    (state) => state.company.companyRequestsCount
  );
  let pageSize = PAGE_LIMIT;

  useEffect(() => {
    dispatch(loadAppConfigs());
    // getPageData(1);
  }, []);

  useEffect(() => {
    const data =
      companyRequests &&
      companyRequests.map((request) => {
        return {
          key: request._id ? request._id : "",
          email: request.email ? request.email : "",
          phone: request.phone ? request.phone : "",
          company: request.companyName ? request.companyName : "",
          contact: request.requesterName ? request.requesterName : "",
          status: request.status ? (
            <span
              className={
                request.status === "pending"
                  ? "status-pending status-wrapper"
                  : request.status === "handled"
                    ? "status-handled status-wrapper"
                    : request.status === "closed"
                      ? "status-closed status-wrapper"
                      : request.status === "denied"
                        ? "status-denied status-wrapper"
                        : ""
              }
            >
              {request.status}
            </span>
          ) : (
              ""
            ),
          date: request.createdAt
            ? moment(request.createdAt).format(MOMENT_DATE_FORMAT)
            : "",
          lastModified: request.updatedAt
            ? moment(request.updatedAt).format(MOMENT_DATE_FORMAT)
            : "",
        };
      });
    setTableData(data);
  }, [companyRequests]);

  const goToDetails = (key) => {
    history.push(`/admin/companies/request/${key}`);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Company Name",
      dataIndex: "company",
      sorter: (a, b) => a.company.length - b.company.length,
    },
    {
      title: "Contact Name",
      dataIndex: "contact",
      sorter: (a, b) => a.contact.length - b.contact.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      sorter: (a, b) => new Date(a.lastModified) - new Date(b.lastModified),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <>
            <EyeOutlined
              style={{ fontSize: "20px", color: "blue" }}
              onClick={() => goToDetails(record.key)}
            />
            {/* <DeleteOutlined style={{fontSize: '20px', marginLeft:'7px', color: 'red'}} onClick={() => console.log('recored.key',record.key)}/> */}
          </>
        );
      },
    },
  ];

  const getPageData = (value) => {
    setCurrent(value);
    let params = `?page=${value}&limit=${pageSize}`;
    dispatch(getAllCompanyRequests(params));
  };
  return (
    <React.Fragment>
      <TableComponent
        columns={columns}
        data={tableData}
        rowClickUrl="/admin/companies/request"
        totalCount={companyRequestsCount}
        currentPage={current}
        onChangePage={getPageData}
        pageSize={pageSize}
      />
    </React.Fragment>
  );
}

export default CompanyRequestsTable;
