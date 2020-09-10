import React, { useEffect, useState } from "react";
import "./blockedCompanies.scss";
import { Row, Form, Col, Button, Select, Input, Tag, Modal } from "antd";
import axios from "axios";
import { suggestCompany } from "../../../../actions/professionalExperience";
import { useSelector, useDispatch } from "react-redux";
import { clearServerErrors } from "../../../../actions/auth";
import { resetNotificationSetting } from "../../../../actions/common";
import {
  deleteCompanyFromBlockList,
  blockACompany,
} from "../../../../actions/talent";
import {
  errorNotification,
  successNotification,
} from "../../../../common/commonMethods";

const { Option } = Select;

const BlockedCompanies = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [blockCompanyForm] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
  const [blockCompanyModalVisible, setBlockCompanyModalVisible] = useState(
    false
  );
  const [suggestModalVisible, setSuggestModalVisible] = useState(false);

  const apiResponse = useSelector((state) => state.auth.apiResponse);
  const serverErrors = useSelector((state) => state.auth.serverErrors);
  const showSuccessNotification = useSelector(
    (state) => state.auth.showSuccessNotification
  );
  const [suggestionFlag, setSuggestionFlag] = useState(false);

  const [Companies, setCompanies] = useState([]);
  const [talentCompanies, setTalentCompanies] = useState([]);
  const [removeCompany, setRemoveCompany] = useState(null);
  // console.log('user',user)

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/talent/companies");
      if (res?.data?.result) {
        let companies = res?.data?.result;
        setCompanies(companies);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    setTalentCompanies(user && user.blockedCompanies);
  }, [user]);
  // console.log('talentCompanies',talentCompanies)

  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification]);

  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  };
  const openSuccessNotification = () => {
    successNotification(apiResponse);
    if (
      apiResponse.message === "Record created Successfully!" &&
      suggestionFlag
    ) {
      setSuggestionFlag(false);
    }
    form.resetFields();
    dispatch(resetNotificationSetting());
  };

  const handleSubmit = (values) => {
    let res = Companies && Companies.find((el) => el._id == values.company);
    let obj = {
      companyId: res._id,
      companyName: res.name,
    };
    // console.log('obj', obj)

    dispatch(blockACompany(obj));
    blockCompanyForm.resetFields();
  };
  const SuggestCompany = (values) => {
    // console.log("values", values);
    let obj = {
      talentId: user?._id,
      talentName: user?.name,
      companyName: values.companyName,
      companyURL: values.companyURL,
    };
    // console.log('obj',obj)
    setSuggestionFlag(true);
    dispatch(suggestCompany(obj));
    setSuggestModalVisible(false);
  };

  const openDeleteModal = (e, item) => {
    e.preventDefault();
    setBlockCompanyModalVisible(true);
    setRemoveCompany(item);
  };
  const handleBlockCompanyModalCancel = (e) => {
    setBlockCompanyModalVisible(false);
    setRemoveCompany(null);
  };
  const removeCompanyFromBlockList = (value) => {
    dispatch(deleteCompanyFromBlockList(value));
    setBlockCompanyModalVisible(false);
    setRemoveCompany(null);
  };

  const openSuggestModal = () => {
    setSuggestModalVisible(true);
  };
  const handleSuggestModalCancel = () => {
    setSuggestModalVisible(false);
  };

  return (
    <div className="container px-3 mx-lg-3 mx-0">
      <h2 className="margin_1rem">Blocked companies</h2>
      <hr className="mb_2rem" style={{ border: "1px solid black" }} />

      <h4 className="pr-5 mb_2rem">
        Would you like to be hidden from specific companies? No worries! Fill
        them in below and we will block them from seeing your profile.
      </h4>
      <h5 className="pr-5 mb_3rem">
        Tip: does this company has a sister company, if so it might be a good
        idea to block those too just to be sure
      </h5>
      <div>
        <Form layout="vertical" form={blockCompanyForm} onFinish={handleSubmit}>
          <div>
            <Row>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item name="company">
                  <Select
                    showSearch
                    allowClear
                    placeholder="Search for a company or add a new one"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {Companies &&
                      Companies.map((company, index) => {
                        return (
                          <Option key={index} value={company._id}>
                            {company.name}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} />
              <Col xs={12} sm={12} md={3} lg={3}>
                <Form.Item>
                  <Button block type="primary" htmlType="submit">
                    Add
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={6} sm={6} md={3} lg={3} />
            </Row>
            <Row justify="start">
              <Col xs={23} sm={23} md={12} lg={12}>
                {talentCompanies.map((item, index) => (
                  <Tag
                    className="tag-style"
                    key={index}
                    style={{
                      marginRight: "15px",
                      marginBottom: "5px",
                      padding: "6px 8px 3px 8px",
                      fontSize: "15px",
                    }}
                    closable
                    onClose={(e) => openDeleteModal(e, item)}
                  >
                    {item.companyName}
                  </Tag>
                ))}
              </Col>
            </Row>
          </div>
        </Form>
      </div>
      <h4 className="pr-5 margin_2rem">Are we missing something?</h4>
      <h5 className="pr-5 margin_2rem">
        Suggest a company and we will make sure to add it to our database and
        block it for you
      </h5>
      {/* <h5 className="pr-5 mb_3rem">
        Tip: you can add URL's here, feel free to add your company URL, if
        they sign up to the platfrom we will block them for you
      </h5> */}
      <div style={{ marginBottom: "4.5rem" }}>
        {/* <Form layout="vertical" form={form} onFinish={SuggestCompany}>
          <div>
            <Row>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item name="companyName">
                  <Input placeholder="Type in company name or URL and press 'Add'" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={6} lg={6} />
              <Col xs={24} sm={24} md={3} lg={3}>
                <Form.Item>
                  <Button block type="primary" htmlType="submit">
                    Add
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={3} lg={3} />
            </Row>
          </div>
        </Form> */}
        <Button type="primary" onClick={openSuggestModal}>
          Suggest a Company
        </Button>
      </div>
      <Modal
        title="Remove From BlockList"
        visible={blockCompanyModalVisible}
        onOk={() => removeCompanyFromBlockList(removeCompany?._id)}
        onCancel={handleBlockCompanyModalCancel}
      >
        <h5>
          Are you sure to remove this company:{" "}
          <b>{removeCompany?.companyName}</b> from block list??
        </h5>
      </Modal>
      <Modal
        title="Suggest a Company"
        visible={suggestModalVisible}
        onCancel={handleSuggestModalCancel}
        footer={null}
      >
        <h5>
          Suggest a company and we will make sure to add it to our database and
          block it for you
        </h5>
        <Form layout="vertical" form={form} onFinish={SuggestCompany}>
          <div>
            <Row>
              <Col xs={24} sm={24} md={22} lg={22}>
                <Form.Item label="Company name" name="companyName">
                  <Input placeholder="Type company name " />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={22} lg={22}>
                <Form.Item label="Company URL" name="companyURL">
                  <Input placeholder="Type company  URL " />
                </Form.Item>
              </Col>

              <Row style={{ width: "100%" }}>
                <Col xs={12} sm={12} md={12} lg={12} />

                <Col xs={6} sm={6} md={6} lg={6}>
                  <Button
                    type="primary"
                    block
                    style={{ float: "right" }}
                    onClick={handleSuggestModalCancel}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col xs={0} sm={0} md={1} lg={1} />
                <Col xs={6} sm={6} md={5} lg={5}>
                  <Form.Item>
                    <Button
                      type="primary"
                      block
                      style={{ float: "right" }}
                      htmlType="submit"
                    >
                      Suggest
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Col xs={0} sm={0} md={3} lg={3} />
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BlockedCompanies;
