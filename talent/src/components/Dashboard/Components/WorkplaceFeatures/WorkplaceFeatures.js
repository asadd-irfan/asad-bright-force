import React, { useEffect, useState } from "react";
import '@ant-design/compatible/assets/index.css';
import { Typography, Row, Col, Button, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";

import TagInput from './TagInput'
import { loadAppConfigs, clearServerErrors } from "../../../../actions/auth";
import { resetNotificationSetting } from "../../../../actions/common";
import { updateWorkplaceFeatures } from "../../../../actions/workplaceFeatures";
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";
import "./workplaceFeatures.scss";
const array = require('lodash/array');

const { Title } = Typography;

function WorkplaceFeatures(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
  const roleFeaturesKey = 'role-features'
  const companyFeaturesKey = 'company-features'
  const companyValuesKey = 'company-values'


  const [selectedRoles, setSelectedRoles] = useState([null]);
  const [selectedSortedRoles, setSelectedSortedRoles] = useState([
    { id: "item-1", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-2", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-3", tagId: null, tagName: null, priorityOrder: 0 }
  ]);

  const [selectedCompanyFeatures, setSelectedCompanyFeatures] = useState([null]);
  const [selectedSortedCompanyFeatures, setSelectedSortedCompanyFeatures] = useState([
    { id: "item-1", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-2", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-3", tagId: null, tagName: null, priorityOrder: 0 }
  ]);

  const [selectedCompanyValues, setSelectedCompanyValues] = useState([null]);
  const [selectedSortedCompanyValues, setSelectedSortedCompanyValues] = useState([
    { id: "item-1", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-2", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-3", tagId: null, tagName: null, priorityOrder: 0 }
  ]);


  const appConfigRoles = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs[roleFeaturesKey]
      ? state.auth.appConfigs[roleFeaturesKey]
      : null
  );
  const appConfigCompanyFeatures = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs[companyFeaturesKey]
      ? state.auth.appConfigs[companyFeaturesKey]
      : null
  );
  const appConfigCompanyValues = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs[companyValuesKey]
      ? state.auth.appConfigs[companyValuesKey]
      : null
  );

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, []);


  useEffect(() => {
    let selectedRoles = []
    let selectedCompanyValues = []
    let selectedCompanyFeatures = []

    if (user.workplaceFeatures && user.workplaceFeatures.roleFeatures) {
      selectedRoles = user.workplaceFeatures && user.workplaceFeatures.roleFeatures.map(item => {
        return item && item.feature;
      });

      let userSelectedRoles = [];

      user.workplaceFeatures.roleFeatures.map((value, index) => {
        if (user.workplaceFeatures.roleFeatures[index]) {
          let selectedRoleIndex = array.findIndex(appConfigRoles, function (o) { return o._id === value.feature })
          if (selectedRoleIndex > -1) {
            userSelectedRoles.push({ tagId: appConfigRoles[selectedRoleIndex]._id, tagName: appConfigRoles[selectedRoleIndex].name, priorityOrder: value.priorityOrder  })
          }
        }
        return null
      })
      let populateUserSelectedRoles = selectedSortedRoles;
      populateUserSelectedRoles.map((value, index) => {
        if (userSelectedRoles[index]) {
          populateUserSelectedRoles[index] = { id: "item-" + (index + 1), "tagId": userSelectedRoles[index].tagId, "tagName": userSelectedRoles[index].tagName, "priorityOrder": userSelectedRoles[index].priorityOrder };
        }
        return null
      })
      setSelectedRoles([...selectedRoles])
      setSelectedSortedRoles([...populateUserSelectedRoles])
    }

    if (user.workplaceFeatures && user.workplaceFeatures.companyValues) {
      selectedCompanyValues = user.workplaceFeatures && user.workplaceFeatures.companyValues.map(item => {
        return item && item.value;
      });
      let userSelectedCompanyValues = [];

      user.workplaceFeatures.companyValues.map((value, index) => {
        if (user.workplaceFeatures.companyValues[index]) {
          let selectedCompanyValueIndex = array.findIndex(appConfigCompanyValues, function (o) { return o._id === value.value })
          if (selectedCompanyValueIndex > -1) {
            userSelectedCompanyValues.push({ tagId: appConfigCompanyValues[selectedCompanyValueIndex]._id, tagName: appConfigCompanyValues[selectedCompanyValueIndex].name, priorityOrder: value.priorityOrder })
          }
        }
        return null
      })
      let populateUserSelectedCompanyValue = selectedSortedCompanyValues;
      populateUserSelectedCompanyValue.map((value, index) => {
        if (userSelectedCompanyValues[index]) {
          populateUserSelectedCompanyValue[index] = { id: "item-" + (index + 1), "tagId": userSelectedCompanyValues[index].tagId, "tagName": userSelectedCompanyValues[index].tagName, "priorityOrder": userSelectedCompanyValues[index].priorityOrder };
        }
        return null
      })
      setSelectedCompanyValues([...selectedCompanyValues])
      setSelectedSortedCompanyValues([...populateUserSelectedCompanyValue])
    }

    if (user.workplaceFeatures && user.workplaceFeatures.companyFeatures) {
      selectedCompanyFeatures = user.workplaceFeatures &&  user.workplaceFeatures.companyFeatures.map(item => {
        return item && item.feature;
      });
      let userSelectedCompanyFeatures = [];

      user.workplaceFeatures.companyFeatures.map((value, index) => {
        if (user.workplaceFeatures.companyFeatures[index]) {
          let selectedCompanyFeatureIndex = array.findIndex(appConfigCompanyFeatures, function (o) { return o._id === value.feature })
          if (selectedCompanyFeatureIndex > -1) {
            userSelectedCompanyFeatures.push({ tagId: appConfigCompanyFeatures[selectedCompanyFeatureIndex]._id, tagName: appConfigCompanyFeatures[selectedCompanyFeatureIndex].name, priorityOrder: value.priorityOrder  })
          }
        }
        return null
      })
      let populateUserSelectedCompanyFeatures = selectedSortedCompanyFeatures;
      populateUserSelectedCompanyFeatures.map((value, index) => {
        if (userSelectedCompanyFeatures[index]) {
          populateUserSelectedCompanyFeatures[index] = { id: "item-" + (index + 1), "tagId": userSelectedCompanyFeatures[index].tagId, "tagName": userSelectedCompanyFeatures[index].tagName, "priorityOrder": userSelectedCompanyFeatures[index].priorityOrder };
        }
        return null
      })
      setSelectedCompanyFeatures([...selectedCompanyFeatures])
      setSelectedSortedCompanyFeatures([...populateUserSelectedCompanyFeatures])
    }
  }, [appConfigRoles, appConfigCompanyValues, appConfigCompanyFeatures])

  
  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification])


  const handleTagChange = (checked, id, name, key) => {

    if (key === roleFeaturesKey) {
      let selectedRolesLocally = selectedRoles;
      if (checked && selectedRolesLocally.length < 3) {
        selectedRolesLocally.push(id);

        let selectedSortedRolesLocally = [...selectedSortedRoles];
        let isPushed = false
        selectedSortedRolesLocally.map((item, index) => {
          if (selectedSortedRolesLocally[index].tagName === null && isPushed === false) {
            isPushed = true;
            selectedSortedRolesLocally[index].tagName = name;
            selectedSortedRolesLocally[index].tagId = id;
          }
          return null
        });

        setSelectedRoles([...selectedRolesLocally])
        setSelectedSortedRoles([...selectedSortedRolesLocally]);

      }
      else if (!checked && selectedRoles.includes(id)) {
        let selectedRolesLocally = selectedRoles;

        let filteredItems = selectedRolesLocally.filter(function (item) {
          return item !== id;
        });
        if (selectedRoles.length > 0) {
          selectedSortedRoles.map((item, ind) => {
            if (item.tagId === id) {
              selectedSortedRoles[ind].tagName = null;
              selectedSortedRoles[ind].tagId = null;
            }
            return null
          });

          setSelectedRoles(filteredItems);
        }
        let nullItems = []
        let filledItems = selectedSortedRoles.filter(item => {
          if (item.tagId === null) {
            nullItems.push(item)
            return null
          }
          else if (item.tagId !== null) {
            return item
          }
        })
        setSelectedSortedRoles([...filledItems, ...nullItems]);
      }
    }


    if (key === companyValuesKey) {
      let selectedCompanyValuesLocally = selectedCompanyValues;
      if (checked && selectedCompanyValuesLocally.length < 3) {
        selectedCompanyValuesLocally.push(id);

        let selectedSortedCompanyValuesLocally = [...selectedSortedCompanyValues];
        let isPushed = false
        selectedSortedCompanyValuesLocally.map((item, index) => {
          if (selectedSortedCompanyValuesLocally[index].tagName === null && isPushed === false) {
            isPushed = true;
            selectedSortedCompanyValuesLocally[index].tagName = name;
            selectedSortedCompanyValuesLocally[index].tagId = id;
          }
          return null
        });

        setSelectedCompanyValues([...selectedCompanyValuesLocally])
        setSelectedSortedCompanyValues([...selectedSortedCompanyValuesLocally]);

      }
      else if (!checked && selectedCompanyValues.includes(id)) {
        let selectedCompanyValuesLocally = selectedCompanyValues;

        let filteredItems = selectedCompanyValuesLocally.filter(function (item) {
          return item !== id;
        });
        if (selectedCompanyValues.length > 0) {
          selectedSortedCompanyValues.map((item, ind) => {
            if (item.tagId === id) {
              selectedSortedCompanyValues[ind].tagName = null;
              selectedSortedCompanyValues[ind].tagId = null;
            }
            return null
          });

          setSelectedCompanyValues(filteredItems);

        }
        let nullItems = []
        let filledItems = selectedSortedCompanyValues.filter(item => {
          if (item.tagId === null) {
            nullItems.push(item)
            return null
          }
          else if (item.tagId !== null) {
            return item
          }
          return null
        })
        setSelectedSortedCompanyValues([...filledItems, ...nullItems]);
      }
    }

    if (key === companyFeaturesKey) {
      let selectedCompanyFeaturesLocally = selectedCompanyFeatures;
      if (checked && selectedCompanyFeaturesLocally.length < 3) {
        selectedCompanyFeaturesLocally.push(id);

        let selectedSortedCompanyFeaturesLocally = [...selectedSortedCompanyFeatures];
        let isPushed = false
        selectedSortedCompanyFeaturesLocally.map((item, index) => {
          if (selectedSortedCompanyFeaturesLocally[index].tagName === null && isPushed === false) {
            isPushed = true;
            selectedSortedCompanyFeaturesLocally[index].tagName = name;
            selectedSortedCompanyFeaturesLocally[index].tagId = id;
          }
          return null
        });

        setSelectedCompanyFeatures([...selectedCompanyFeaturesLocally])
        setSelectedSortedCompanyFeatures([...selectedSortedCompanyFeaturesLocally]);

      }
      else if (!checked && selectedCompanyFeatures.includes(id)) {
        let selectedCompanyFeaturesLocally = selectedCompanyFeatures;

        let filteredItems = selectedCompanyFeaturesLocally.filter(function (item) {
          return item !== id;
        });
        if (selectedCompanyFeatures.length > 0) {
          selectedSortedCompanyFeatures.map((item, ind) => {
            if (item.tagId === id) {
              selectedSortedCompanyFeatures[ind].tagName = null;
              selectedSortedCompanyFeatures[ind].tagId = null;
            }
            return null
          });

          setSelectedCompanyFeatures(filteredItems);
        }
      }
      let nullItems = []
      let filledItems = selectedSortedCompanyFeatures.filter(item => {
        if (item.tagId === null) {
          nullItems.push(item)
          return null
        }
        else if (item.tagId !== null) {
          return item
        }
        return null
      })
      setSelectedSortedCompanyFeatures([...filledItems, ...nullItems]);
    }

  };

  const handleSubmit = values => {
    let roleFeatures = selectedSortedRoles.map((item, index) => {
      if (item.tagId) {
        return {
          feature: item.tagId,
          priorityOrder: index + 1        
      }
    }
    })
    let companyValues = selectedSortedCompanyValues.map((item, index) => {
      if (item.tagId) {
        return {
          value: item.tagId,
          priorityOrder: index + 1        
      }
    }
    })
    let companyFeatures = selectedSortedCompanyFeatures.map((item, index) => {
      if (item.tagId) {
        return {
          feature: item.tagId,
          priorityOrder: index + 1        
      }
    }
    })

    companyValues = companyValues.filter(Boolean)
    companyFeatures = companyFeatures.filter(Boolean)
    roleFeatures = roleFeatures.filter(Boolean)
    const allValues = { roleFeatures, companyValues, companyFeatures }
    dispatch(updateWorkplaceFeatures(allValues));
  };

  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  }
  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };

  return (
    <div>
      <Form
        layout='vertical'
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        className='form-wrapper'
      >
        <div className="preferred-role-wrapper">
          <Title level={2}>Workplace Features</Title>
        </div>
        <TagInput
          title='Role Features'
          inputTitle='Selected Role Features'
          tags={appConfigRoles && appConfigRoles}
          selectedTags={selectedRoles}
          parentHandleTagChange={handleTagChange}
          tagParentKey={roleFeaturesKey}
          setFunction={setSelectedSortedRoles} 
          inputValues={selectedSortedRoles} />
      
       <div id='company-values'>
          <TagInput
            title='Company Values'
            inputTitle='Selected Company Values'
            tags={appConfigCompanyValues && appConfigCompanyValues}
            selectedTags={selectedCompanyValues}
            parentHandleTagChange={handleTagChange}
            tagParentKey={companyValuesKey}
            setFunction={setSelectedSortedCompanyValues} 
            inputValues={selectedSortedCompanyValues}
          />
        </div>
        <div id='company-features'>
          <TagInput
            title='Company Features'
            inputTitle='Selected Company Features'
            tags={appConfigCompanyFeatures && appConfigCompanyFeatures}
            selectedTags={selectedCompanyFeatures}
            parentHandleTagChange={handleTagChange}
            tagParentKey={companyFeaturesKey}
            setFunction={setSelectedSortedCompanyFeatures} 
            inputValues={selectedSortedCompanyFeatures}

          />

        </div>

        <div className="my-5">
          <Row justify="end">
            <Col xs={24} sm={24} md={24} lg={24} offset={22}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={btnLoading}>
                  Save
              </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}

export default WorkplaceFeatures;
