import React, { useState, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Typography, Row, Col, Button, Checkbox, Form, Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { loadAppConfigs, clearServerErrors } from './../../../../actions/auth';
import { resetNotificationSetting } from '../../../../actions/common';
import { updateCompanyPreferences } from './../../../../actions/companyPreferences';
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";

import './companyPreferences.scss';

const { Title, Paragraph } = Typography;
const { CheckableTag } = Tag;

const CompanyPreferences = () => {
	const dispatch = useDispatch()
	const [form] = Form.useForm();
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const serverErrors = useSelector(state => state.auth.serverErrors);
	const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
	const btnLoading = useSelector(state => state.auth.btnLoading);
  const apiResponse = useSelector(state => state.auth.apiResponse);
	let companySizesOptions = appConfigs && appConfigs['company-size']

	const user = useSelector(state => state.auth.user);
	const [selectedIndustries, setSelectedIndustries] = useState(user && user.companyPreferences && user.companyPreferences.industryPreference ? user.companyPreferences.industryPreference : [])
	const appConfigIndustryPref = useSelector(state => state.auth.appConfigs && state.auth.appConfigs['industry-preference'] ? state.auth.appConfigs['industry-preference'] :null );
  


	useEffect(() => {
		dispatch(loadAppConfigs());
	},[]) 

	useEffect(() => {
		form.setFieldsValue({
			companySizesOptions: user && user.companyPreferences && user.companyPreferences.companySize ? user.companyPreferences.companySize : null,
			industryPreference: user && user.companyPreferences && user.companyPreferences.industryPreference ? user.companyPreferences.industryPreference : null,
	});
	},[appConfigs])

	useEffect(() => {	
		serverErrors && openErrorNotification();
		showSuccessNotification && openSuccessNotification();
	}, [serverErrors, showSuccessNotification])

	const handleSubmit = values => {
		const companySize = values.companySizesOptions && values.companySizesOptions
				const industryPreference = selectedIndustries;
				const allValues = { industryPreference, companySize };
				dispatch(updateCompanyPreferences(allValues));
	};


	const handleTagChange = (checked,id, name) => {
    if(checked && selectedIndustries.length < 5) {
      setSelectedIndustries([...selectedIndustries, id])
    }
    else if(!checked && selectedIndustries.includes(id) ){
      let filteredItems =  selectedIndustries.filter(function(item) {
        return item !== id
      })  
      setSelectedIndustries(filteredItems)
    }
    
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
			<div className='main-heading-wrapper'>
				<Title level={1}>Company Preferences</Title>
			</div>

			<Form 
				layout='vertical'
				form={form}
				onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
				className='form-wrapper'
			>
				<div className='form-inner-wrapper my-3'>
				<Title level={2}>Industries</Title>

					<div id='preferred-industry'  className=' my-3'>
						<Title level={4}>
							What are your preferred industries
                        </Title>
						<Paragraph>You can choose up to five</Paragraph>
						<Form.Item>
							<Row>

							<Col xs={20} sm={20} md={16} lg={16}>
															
								{appConfigIndustryPref && appConfigIndustryPref.map((tag, index) => {
									return (
										<CheckableTag  key={index}
											className='checkable-tag checkable-tag-margin m-2' 
											value={tag.name} 
											checked={selectedIndustries.includes(tag._id) ? true : false} 
											onChange={(checked) =>handleTagChange(checked,tag._id, tag.name)}> {tag.name}</CheckableTag>
									);
								})}
								</Col>
							</Row>
						</Form.Item>
					</div>
					<div id='company-size' className=' my-3'>
					<Title level={2}>Company Size</Title>
						<Title level={4}>
							What is your preferred company size
                        </Title>
						<Paragraph>Select as many as you like</Paragraph>
						<Row>
							<Form.Item name='companySizesOptions'>
							<Checkbox.Group style={{ width: '100%' }}>
											{companySizesOptions ? companySizesOptions.map((checkbox, index) => {
												return (
													<Row key={index}>
														<Checkbox value={checkbox._id} key={checkbox._id}>
															{checkbox.name}
														</Checkbox> 
														
													</Row>
												);
											}) : <div>Loading...</div>}
									</Checkbox.Group>
							</Form.Item>
						</Row>
					</div>
					<Row className="my-3">
						<Col xs={6} sm={6} md={6} lg={6}>
							<Form.Item>
								<Button type='primary' htmlType='submit' loading={btnLoading}>
									Save
                                </Button>
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Form>
		</div>
	);
};

export default CompanyPreferences;
