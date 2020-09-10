import React from 'react';
import { Collapse, Row, Form, Col, DatePicker, Typography } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment'
import '../positions.scss'
import { MOMENT_DATE_FORMAT } from '../../../../../common/constants'
const { Panel } = Collapse;
const { Paragraph } = Typography;


function InfoPanel({
  selectedPosition,
  selectedCompany,
  openPositions
}) {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.positions.btnLoading);
  const allCompanies = useSelector(state => state.company.allCompanies);
  const allAdmins = useSelector(state => state.talentManager.allAdmins);
  const [form] = Form.useForm();

  const rolesOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['preferred-role']
  );
  const typeOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['roles']
  );

  const handleSubmit = values => {

  };

  const resetAllData = e => {
    form.resetFields();
  };


  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="Positions Info Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Paragraph><strong>{selectedPosition?.title}</strong> at <strong>{selectedCompany?.name}</strong></Paragraph>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={10} lg={10}>
                <Paragraph>Last Modified on :  <strong>{moment(selectedPosition?.updatedAt).format('dddd')} {moment(selectedPosition?.updatedAt).format(MOMENT_DATE_FORMAT)}</strong></Paragraph>
              </Col>
            </Row>
            <Row>
              <Col xs={0} sm={0} md={24} lg={24}>
                <Paragraph>&nbsp;</Paragraph>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Paragraph>
                  <span className={
                    (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'un-processed') ? 'status-open-unprocess status-wrapper'
                      : (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'processed') ? 'status-open-process status-wrapper'
                        : (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'action-required') ? 'status-open-action-required status-wrapper'
                          : (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'fulfilled') ? 'status-open-fulfilled status-wrapper'
                            : selectedPosition?.status === 'Closed - Hired' ? 'status-closed-hired status-wrapper'
                              : selectedPosition?.status === 'Closed - Other' ? 'status-closed-other status-wrapper'
                                : ''
                  }>
                    {selectedPosition?.lastGroupStatus ? selectedPosition?.status + ' - ' + selectedPosition?.lastGroupStatus : selectedPosition?.status}
                  </span>
                </Paragraph>
                <Paragraph style={{ color: '#E69138' }}>Minimal amount of talents are {selectedPosition?.groupConfigs?.candidatesPerGroup},
              above the required matching score {selectedPosition?.groupConfigs?.matchingScore} with total number of group division is {selectedPosition?.groupConfigs?.totalGroups}.</Paragraph>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Paragraph><strong>Open Positions({selectedCompany?.name})</strong> </Paragraph>
                <Paragraph>{openPositions}</Paragraph>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Paragraph><strong>Account Manager</strong> </Paragraph>
                <Paragraph>{selectedPosition?.assignedAccountManager?.name}</Paragraph>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>

              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>

              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>

              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={12} md={19} lg={19}>
              </Col>
              <Col xs={6} sm={6} md={2} lg={2}>

              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={6} sm={6} md={2} lg={2}>
                <Form.Item>
                  {/* <Button
                    type="primary"
                    block
                    style={{ float: "right" }}
                    loading={btnLoading}
                    htmlType="submit"
                  >
                    Save
                </Button> */}
                </Form.Item>
              </Col>
            </Row>

          </Form>

        </Panel>
      </Collapse>
    </div>
  )
}

export default InfoPanel;
