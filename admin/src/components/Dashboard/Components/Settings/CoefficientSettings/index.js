import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select, InputNumber, Button, Table } from "antd";
import { useDispatch, useSelector } from 'react-redux'
import { getCoefficientConfigs, updateCoefficientWeight } from '../../../../../actions/settings'


const { Option } = Select;



function CoefficientSettings() {


  const [isDisabled, setIsDisabled] = useState(true);
  const [hideEditButton, setHideEditButton] = useState(false);
  const coefficientConfigs = useSelector(state => state.settings.coefficientConfigs);
  const [total, setTotal] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  // const history = useHistory();
  const dispatch = useDispatch();


  const columns = [
    {
      title: 'Coefficient Name',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: 'Coefficient Weight',
      dataIndex: 'weight',
      width: '25%',
      render: (text, record) => {
        // console.log('text',text)
        // console.log('record',record)
        return (
          <>
            {<InputNumber disabled={isDisabled} value={text} onChange={(e) => updateData(record, e)} />}
          </>
        )
      }
    },

  ];
  useEffect(() => {
    dispatch(getCoefficientConfigs());
  }, [])

  const originData = [];
  coefficientConfigs && coefficientConfigs.map(element => {
    originData.push({
      key: element._id,
      name: element.name,
      weight: element.weight,
    });

  })
  // console.log('originData',originData)
  useEffect(() => {
    let totalWeight = 0;

    if (coefficientConfigs) {
      setData(originData);
      originData.map(element => {
        if (element.weight) {
          totalWeight = totalWeight + element.weight;
        }
      })
      form.setFieldsValue({
        total: totalWeight,
      });
    }

  }, [coefficientConfigs])


  const disableButtonFalse = () => {
    setHideEditButton(true);
    setIsDisabled(false);
  }
  const showEditButton = () => {
    setHideEditButton(false);
    setIsDisabled(true);
  }
  const saveConfigWeights = () => {

    let obj = {
      "coefficientConfigs": data
    }
    dispatch(updateCoefficientWeight(obj));

  }
  const updateData = (record, value) => {

    let obj = {
      "key": record.key,
      "name": record.name,
      "weight": value,

    }
    // const row = await form.validateFields();
    const newData = [...data];
    const index = newData.findIndex(item => record.key === item.key);


    let totalWeight = 0
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...obj });
      setData(newData);

      newData.map(element => {
        if (element.weight) {
          totalWeight = totalWeight + element.weight;
        }
      })
      form.setFieldsValue({
        total: totalWeight,
      });
    }
  }

  // console.log('data', data)

  return (
    <div className="m-3 p-3">
            <div style={{ padding: '25px 15px',textAlign:'center' }}>
        <h1>COEFFICIENT CONFIG SETTINGS</h1>
      </div>

      <Row>
        <Col xs={4} sm={4} md={4} lg={4} />
        <Col xs={16} sm={16} md={16} lg={16}>
          <Row justify='end' className='m-3'>
            {!hideEditButton && <Button type='primary' onClick={() => disableButtonFalse()}
            >
              Edit
          </Button>}
            {hideEditButton && <><Button className='m-2' type='danger' onClick={() => showEditButton()}
            >
              Cancel
          </Button>
              <Button className='m-2' type='primary' onClick={() => saveConfigWeights()}
              >
                Save
        </Button>
            </>}

          </Row>
          <Form form={form} >

            <Table

              bordered
              dataSource={data}
              columns={columns}
              pagination={false}
            />
            <div className="m-3" >

              <Form.Item label="Total Count:" name='total'>
                <Input disabled style={{ width: 200 }} />
              </Form.Item>
            </div>
          </Form>

        </Col>
      </Row>
    </div>

  );
};

export default CoefficientSettings;

