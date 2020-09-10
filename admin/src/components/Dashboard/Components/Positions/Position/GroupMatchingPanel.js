import React from 'react';
import { Collapse, Row, Col, Typography, InputNumber, Form,Button } from 'antd';
import '../positions.scss'
import { updateGroupConfigs } from '../../../../../actions/positions'
import { useSelector, useDispatch } from 'react-redux'

const { Panel } = Collapse;

const { Paragraph } = Typography;


function GroupMatchingPanel({
  selectedPosition,
  form
}) {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.positions.btnLoading)

const updatePositionGroupConfigs = () => {
  let obj = {
    "groupConfigs": {
      "candidatesPerGroup": form.getFieldValue('candidatesPerGroup'),
      "matchingScore": form.getFieldValue('matchingScore'),
      "totalGroups": form.getFieldValue('totalGroups')
    }
  }
  // console.log('obj',obj)
  dispatch(updateGroupConfigs(obj,selectedPosition?._id))
}

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="Group Matching Panel" key="1">
          <h6>Group  Matching</h6>
          <br />
          <Row>
            <Col xs={24} sm={24} md={18} lg={18}>
              <Row>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <h6>Minimum Talents per Group</h6>
                  <Form.Item name='candidatesPerGroup' rules={
                    [
                      {
                        required: true,
                        message: 'Please input Minimum Talents per Group!'
                      }
                    ]
                  }>
                    <InputNumber />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <h6>Amount of Total Groups</h6>
                  <Form.Item name='totalGroups' rules={
                    [
                      {
                        required: true,
                        message: 'Please input Amount of Total Groups!'
                      }
                    ]
                  }>
                    <InputNumber min={1} max={3}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <h6>Minimum Matching Score</h6>
                  <Form.Item name='matchingScore' rules={
                    [
                      {
                        required: true,
                        message: 'Please input Minimum Matching Score!'
                      }
                    ]
                  }>
                    <InputNumber />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} />
              </Row>
              <Row>
                <Col xs={16} sm={16} md={16} lg={16} />
                <Col xs={8} sm={8} md={8} lg={8}>
                <Button
                    type='primary'
                    loading={btnLoading}
                    onClick={() => updatePositionGroupConfigs()}
                  >
                Save
                </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Paragraph><span className={
                    (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'un-processed') ? 'status-open-unprocess status-wrapper'
                      : (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'processed') ? 'status-open-process status-wrapper'
                        : (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'action-required') ? 'status-open-action-required status-wrapper'
                          : (selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'fulfilled') ? 'status-open-fulfilled status-wrapper'
                            : selectedPosition?.status === 'Closed - Hired' ? 'status-closed-hired status-wrapper'
                              : selectedPosition?.status === 'Closed - Other' ? 'status-closed-other status-wrapper'
                                : ''
                  }>
                    {selectedPosition?.lastGroupStatus ? selectedPosition?.status + ' - ' + selectedPosition?.lastGroupStatus : selectedPosition?.status}
                  </span></Paragraph>
                  <Paragraph style={{ color: '#E69138' }}>Minimal amount of talents are {selectedPosition?.groupConfigs?.candidatesPerGroup}, 
              above the required matching score {selectedPosition?.groupConfigs?.matchingScore} with total number of group division is {selectedPosition?.groupConfigs?.totalGroups}.</Paragraph>

            </Col>
          </Row>
        </Panel>
      </Collapse>
    </div>
  )
}

export default GroupMatchingPanel;
