import React, { useState, useEffect } from "react";
import { getTalentCompaniesSuggestions } from "../../../../../../actions/company";
import { MOMENT_DATE_FORMAT } from "../../../../../../common/constants";
import { useSelector, useDispatch } from "react-redux";

import { Row, Card, Col, Typography, Tag, Table } from "antd";
import moment from "moment";

const { Title } = Typography;

function BlockedCompaniesCard() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.talents.selectedTalent);
  const [talentCompanySuggestions, setTalentCompanySuggestions] = useState(null)

  useEffect(() => {
    if (user) {
      dispatch(getTalentCompaniesSuggestions(user?._id)).then(res => {
        console.log('res', res)

        if (res?.result) {
          setTalentCompanySuggestions(res?.result)
        }

      });
    }
  }, [user]);

  console.log('talentCompanySuggestions', talentCompanySuggestions)
  const dataSource = talentCompanySuggestions && talentCompanySuggestions.map((element) => {
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

  const columns = [

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
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <>
            <Row>
              <u><a className="m-1" style={{ color: 'blue' }}>Replace</a></u>
              <u><a className="m-1" style={{ color: 'blue' }}>Create</a></u>
              <u><a className="m-1" style={{ color: 'blue' }}>Dismiss</a></u>
            </Row>
            {/* <EditOutlined
              style={{ fontSize: "20px", color: "blue" }}
              onClick={() => goToDetails(record.key)}
            />
            <DeleteOutlined
              style={{ fontSize: "20px", marginLeft: "7px", color: "red" }}
              onClick={() => console.log("recored.key", record.key)}
            /> */}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Card style={{ margin: "12px 0px", minHeight: "300px" }}>
        <Row>
          <Title level={2}>Blocked Companies </Title>
        </Row>
        <Row className="mt-3">
          <Col xs={24} sm={24} md={24} lg={24}>
            {user?.blockedCompanies.length === 0 && (
              <div>No Blocked Companies Found!</div>
            )}
            {user?.blockedCompanies.map((element) => {
              return (
                <Tag key={element._id} className="m-2" color="red">
                  {element.companyName}
                </Tag>
              );
            })}
          </Col>
        </Row>
        <Row className="m-3 p-3">
          <Title level={3}>Company Suggestions </Title>

        </Row>
        <Table dataSource={dataSource} columns={columns} />

      </Card>
    </div>
  );
}

export default BlockedCompaniesCard;
