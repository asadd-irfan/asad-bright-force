import React, { useEffect, useState } from "react";
import '@ant-design/compatible/assets/index.css';
import { Typography, Row, Col, Tag, Slider, Button, Form, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { loadAppConfigs, clearServerErrors } from "../../../../actions/auth";
import { updateUserLanguages } from "../../../../actions/talent";
import { resetNotificationSetting } from "../../../../actions/common";
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";
import "./languages.scss";

const { Title } = Typography;
const { Option } = Select;

function Languages(props) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const apiResponse = useSelector(state => state.auth.apiResponse);

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, []);

  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification])

  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };
  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  }

  const appConfigLanguages = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs["language"]
      ? state.auth.appConfigs["language"]
      : null
  );

  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [autoCompleteLanguages, setAutoCompleteLanguages] = useState([]);
  const [language, setLanguage] = useState([]);
  const [languages, setLanguages] = useState([]);

  const handleSubmit = values => {
    let obj = {
      languages: languages.map(item => {
        return {
          name: item.languageId,
          priorityOrder: item.languageProficiency
        }
      })
    }
    dispatch(updateUserLanguages(obj));
  };

  useEffect(() => {
    // for languages
    let userSelectedLanguages = [];
    if (user && user.languages) {
      appConfigLanguages && appConfigLanguages.map(appConfigLang => {
        user.languages.filter(lang => {
          if (lang.name === appConfigLang._id) {
            let selectedObj = { languageId: appConfigLang._id, languageName: appConfigLang.name, languageProficiency: lang.priorityOrder }
            userSelectedLanguages.push(selectedObj)
          }
        })
      })
    }
    let userSelectedLanguagesNames = userSelectedLanguages.map(lang => {
      return lang.languageName
    })
    setLanguages(userSelectedLanguages)
    setSelectedLanguage(userSelectedLanguagesNames)
  }, [user, appConfigLanguages])

  
  const languagesHandleFocus = e => {
    let value = e.target.value;
    let result;
    result = appConfigLanguages && appConfigLanguages.map(item => item.name).filter(item => {
      if (item.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        return item
      }
      return null
    });
    setLanguage(result);
  };
  

  const languagesSelectHandler = (value) => {
    let resultObj = appConfigLanguages && appConfigLanguages.filter(item => {
      if (item.name === value) {
        return item
      }
    })
    if (!selectedLanguage.includes(value)) {
      selectedLanguage.push(value);
      setSelectedLanguage([...selectedLanguage]);
      let languagesLocally = [...languages];
      let isPushed = false;
      selectedLanguage.map((item, index) => {
        if (isPushed === false) {
          isPushed = true;
          let obj = {
            languageId: resultObj && resultObj[0]._id,
            languageName: value,
            languageProficiency: 0
          }
          languagesLocally.push(obj);
        }
        return null
      });
      setLanguages([...languagesLocally]);
      setAutoCompleteLanguages('')
    }
    return "";
  };

  const languagesClearField = (e, index, value) => {
    e.preventDefault();
    let languageArr = selectedLanguage.filter(item => {
      if (item !== value) {
        return item
      }
      else { return null }
    })
    setSelectedLanguage(languageArr)

    let languagesLocally = languages.filter(item => {
      if (item.languageName !== value) {
        return item
      }
      else { return null }
    })
    setLanguages(languagesLocally);
  }

  const changeLanguageProficiency = (value, langId) => {
    let updatedLanguages = languages.slice()
     updatedLanguages.filter((item) => {
      if (item.languageId === langId) {
        item.languageProficiency = value;
      }
    })
    setLanguages(updatedLanguages)
  }

  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
    >
      <div className="my-5" >
        <div className="my-2">
        {/* <div className="preferred-role-wrapper"> */}
          <Title level={2}>Languages</Title>
        </div>
        <div className="choose-role-wrapper mb-5">
          <Title level={4}>What languages do you know?</Title>
        </div>
        <div className="mb-4 my-3">
          <Row>
            <Col xs={8} sm={8} md={5} lg={5}>
              {/* <Title level={3}>Languages </Title> */}
            </Col>
            <Col xs={16} sm={16} md={7} lg={7}>
              <Select
                    style={{ width: '100%', marginBottom: "20px" }}
                    onFocus={languagesHandleFocus}
                    onSelect={languagesSelectHandler}
                    value={autoCompleteLanguages}
                    showSearch
                    showArrow={false}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Search a language"
                  >
                    {language && language.map(lang => (
                      <Option key={lang}>{lang}</Option>
                    ))}
                  </Select>
            </Col>
          </Row>
         
          <Row justify='start'>
                <Col xs={1} sm={1} md={5} lg={5}></Col>
                <Col xs={23} sm={23} md={15} lg={15}>
                  {languages.map((item, index) => (
                    <Row key={index}>
                      <Col xs={6} sm={6} md={4} lg={4}>
                        <Tag 
                          className="tag-style" 
                          style={{ marginRight: '15px',  marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }}
                          closable onClose={(e) => languagesClearField(e, index, item.languageName)}
                        >
                          {item.languageName}
                        </Tag>
                      </Col>
                    
                      <Col xs={18} sm={18} md={18} lg={18}>
                        <Slider
                          marks={{
                            1: "Beginner",
                            2: "Intermediate",
                            3: "Advanced",
                            4: "Proficient",
                            5: "Fluent/Native"
                          }}
                          min={0}
                          max={5}
                          value={item.languageProficiency}
                          onChange={(value) => changeLanguageProficiency(value, item.languageId)}
                          style={{ marginLeft: "25px", marginTop: "5px" }}
                          className="ant-slider-custom-styles"
                        />
                      </Col>
                    
                    
                    </Row>
                  ))}
                </Col>
              </Row>
          
        </div>

        <Row >
            <Col xs={24} sm={24} md={24} lg={24} >
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={btnLoading}>
                  Save
              </Button>
              </Form.Item>
            </Col>
          </Row>

       
        </div>
    </Form>
  );
}

export default Languages;
