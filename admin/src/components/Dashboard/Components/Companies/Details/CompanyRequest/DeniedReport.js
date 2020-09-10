import React from 'react';
import { Row, Form, Col, Card, Typography, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { CloseCircleOutlined } from '@ant-design/icons';
import '../../companies.scss'
import { restartRequest } from '../../../../../../actions/company'
import { MOMENT_DATE_FORMAT } from '../../../../../../common/constants'
import moment from 'moment'

const { Paragraph } = Typography;

function DeniedReport({ selectedCompanyRequest }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.auth.btnLoading)

  const onChangeRestartRequest = () => {
    let id = selectedCompanyRequest && selectedCompanyRequest._id
    dispatch(restartRequest(id))
  }

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 16 },
  };
  return (
    <div style={{ marginRight: '10px' }}>
      <div className='text-center' style={{ margin: '10px 0px' }}>
        <h3><CloseCircleOutlined style={{ color: '#cc0000' }} /> This Request was Denied</h3>
      </div>
      <Card bordered={false} style={{ border: '2px solid', borderRadius: '5px' }}>
        <Form
          {...layout}
          labelAlign={'left'}
          form={form}
        >
          <div style={{ marginBottom: '10px' }}>
            <h4>Denied Report</h4>
          </div>
          <hr style={{ border: '1px solid', marginBottom: '10px' }} />

          <Row>
            <Paragraph><strong>Denied by:</strong> {selectedCompanyRequest && selectedCompanyRequest.deniedReport && selectedCompanyRequest.deniedReport.deniedByAdmin && selectedCompanyRequest.deniedReport.deniedByAdmin.name}
              &nbsp;at {selectedCompanyRequest && selectedCompanyRequest.deniedReport && selectedCompanyRequest.deniedReport.deniedByAdmin && moment(selectedCompanyRequest.deniedReport.deniedByAdmin.date).format(MOMENT_DATE_FORMAT)}</Paragraph>
          </Row>

          <Row>
            <Col xs={24} sm={24} md={22} lg={22}>
              <Form.Item label="Rejection Reason:">
                <Paragraph>{selectedCompanyRequest && selectedCompanyRequest.deniedReport && selectedCompanyRequest.deniedReport.rejectionReason}</Paragraph>
              </Form.Item>
            </Col>
          </Row>

          <div className='text-center' style={{ margin: '10px 0px' }}>
            <Button type='primary' loading={btnLoading} onClick={onChangeRestartRequest}>Restart Request (move to pending)</Button>
          </div>

        </Form>
      </Card>
    </div>
  )
}

export default DeniedReport;
