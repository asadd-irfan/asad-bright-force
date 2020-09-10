import React, { useState, useEffect } from "react";
import '@ant-design/compatible/assets/index.css';
import { Typography, Row, Col, Input, Slider, Button, Form, Select, Checkbox } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { loadAppConfigs, clearServerErrors } from "../../../../actions/auth";
import { resetNotificationSetting } from '../../../../actions/common';
import { suggestSkill } from '../../../../actions/professionalExperience';
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";
import "./RolePreference.scss";
const { Title, Paragraph } = Typography;

const SuggestSkills = () => {
    const [suggestionFlag, setSuggestionFlag] = useState(false)
    const [suggestionMessage, setSuggestionMessage] = useState('')
    const [Suggestion, setSuggestion] = useState("");
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const apiResponse = useSelector(state => state.auth.apiResponse);
    const btnLoading = useSelector(state => state.auth.btnLoading);
    const serverErrors = useSelector(state => state.auth.serverErrors);
    const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);

    useEffect(() => {
        serverErrors && openErrorNotification();
        showSuccessNotification && openSuccessNotification();
    }, [serverErrors, showSuccessNotification])



    const openErrorNotification = () => {
        errorNotification(serverErrors);
        setSuggestionMessage('')
        dispatch(clearServerErrors());
    }

    const openSuccessNotification = () => {
        successNotification(apiResponse)
        if ((apiResponse.message === 'Record created Successfully!') && suggestionFlag) {
            setSuggestionMessage(`${Suggestion}, was submitted`);
            setSuggestionFlag(false)
        }
        setSuggestion(null);
        dispatch(resetNotificationSetting());
    };
    const suggestionHandler = () => {
        setSuggestionFlag(true)
        dispatch(suggestSkill({ skillName: Suggestion, userId: user._id }));
    };

    return (
        <div className="my-5">

            <Row className="mt-3 mb-3">
                <Col xs={8} sm={8} md={5} lg={5}>
                    <Title level={3}>Missing a Skill? </Title>
                </Col>
                <Col xs={16} sm={16} md={10} lg={10}>
                    <Input
                        value={Suggestion}
                        onChange={e => {
                            setSuggestion(e.target.value);
                        }}
                    />
                    <Paragraph style={{ color: 'green' }}>{suggestionMessage}</Paragraph>
                </Col>
                <Col xs={12} sm={12} md={1} lg={1}></Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                    <Button type="primary" onClick={suggestionHandler}>
                        Suggest
            </Button>
                </Col>
            </Row>
        </div>
    )
}

export default SuggestSkills;