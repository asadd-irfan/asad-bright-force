import React from 'react';
import { Row, Form, Col, Card, Button } from 'antd';
import '../../companies.scss'
import { PAGE_LIMIT, MOMENT_DATE_FORMAT } from '../../../../../../common/constants'
import TableComponent from '../../../../../Common/TableComponent';
import moment from 'moment';
import { changeCompanyTabPanelKey } from '../../../../../../actions/company'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';


function CompanyDetailsActual({ selectedCompany }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const gotoCompanyPage = () => {
    dispatch(changeCompanyTabPanelKey('profile'))
    history.push(`/admin/companies/company/${selectedCompany && selectedCompany._id}`);
  }

  const [form] = Form.useForm();
  let pageSize = PAGE_LIMIT;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  let selCompany = [];
  selCompany.push(selectedCompany)
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'City/Region',
      dataIndex: 'city',
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: 'Memb. Date',
      dataIndex: 'memDate',
      sorter: (a, b) => new Date(a.regDate) - new Date(b.regDate),
    },
  ];


  const data = selCompany && selCompany.map((company, index) => {

    return {
      key: company && company._id ? company._id : '',
      name: company && company.name ? company.name : '',
      size: company && company.size ? company.size.name : '',
      memDate: company && company.status === 'not-registered' ? 'unregistered' : moment(company && company.createdAt).format(MOMENT_DATE_FORMAT),
    }
  })

  return (
    <div style={{ marginRight: '10px' }}>
      <Card bordered={false} style={{ border: '2px solid', borderRadius: '5px' }}>
        <Form
          {...layout}
          labelAlign={'left'}
          form={form}
        >
          <Row style={{ marginBottom: '10px' }}>
            <Col xs={22} sm={22} md={22} lg={22}>
              <h4>Company Details(Actual)</h4>
            </Col>
          </Row>
          <hr style={{ border: '1px solid', marginBottom: '10px' }} />
          <div style={{ marginBottom: '50px' }}>
            <React.Fragment>
              <TableComponent
                columns={columns}
                data={data}
                pageSize={pageSize}
              />
            </React.Fragment>
          </div>
          <div className='text-center' style={{ marginTop: '40px' }}>
            <Button type='primary' onClick={gotoCompanyPage}>Go to Company Page</Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default CompanyDetailsActual;
