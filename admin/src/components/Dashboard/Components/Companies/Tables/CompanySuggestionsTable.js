import React, { useState, useEffect } from "react";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { loadAppConfigs } from "../../../../../actions/auth";
import { getAllCompaniesSuggestions } from "../../../../../actions/company";
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from "../../../../../common/constants";
import TableComponent from "../../../../Common/TableComponent";

function CompanySuggestionsTable() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [current, setCurrent] = useState(1);
  const talents = useSelector((state) => state.talents.talents);
  const allTalentsCount = useSelector((state) => state.talents.allTalentsCount);
  const contractDurationOptions = useSelector(
    (state) =>
      state.auth.appConfigs &&
      state.auth.appConfigs["freelancer-contract-duration"]
  );
  const companySuggestions = useSelector(
    (state) => state.company.allCompaniesSuggestions
  );
  let pageSize = PAGE_LIMIT;

  useEffect(() => {
    dispatch(loadAppConfigs());
    dispatch(getAllCompaniesSuggestions(""));
    // getPageData(1);
  }, []);
  console.log("companySuggestions", companySuggestions);

  const goToDetails = (key) => {
    // history.push(`/admin/company/${key}`);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      sorter: (a, b) => a.companyName.length - b.companyName.length,
    },
    {
      title: "Company URL",
      dataIndex: "companyURL",
      sorter: (a, b) => a.companyURL.length - b.companyURL.length,
    },
    {
      title: "Talent Name",
      dataIndex: "talentName",
      sorter: (a, b) => a.talentName.length - b.talentName.length,
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
            <DeleteOutlined
              style={{ fontSize: "20px", marginLeft: "7px", color: "red" }}
              onClick={() => console.log("recored.key", record.key)}
            />
          </>
        );
      },
    },
  ];

  const data =
    companySuggestions &&
    companySuggestions.map((element) => {
      return {
        key: element._id ? element._id : "",
        companyName: element.companyName ? element.companyName : "",
        companyURL: element.companyURL ? element.companyURL : "",
        talentName: element.talentName ? element.talentName : "",
        date: element.createdAt
          ? moment(element.createdAt).format(MOMENT_DATE_FORMAT)
          : "",
      };
    });

  const getPageData = (value) => {
    setCurrent(value);
    let params = `?page=${value}&limit=${pageSize}`;
    dispatch(getAllCompaniesSuggestions(params));
  };
  return (
    <React.Fragment>
      <TableComponent
        columns={columns}
        data={data}
        // rowClickUrl="/admin/talents"
        totalCount={allTalentsCount}
        currentPage={current}
        onChangePage={getPageData}
        pageSize={pageSize}
      />
    </React.Fragment>
  );
}

export default CompanySuggestionsTable;
