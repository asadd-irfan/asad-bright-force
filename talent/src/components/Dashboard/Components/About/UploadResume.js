import React, { useState, useEffect } from "react";
import './../BlockedCompanies/blockedCompanies.scss'
import "./uploadCv.scss";
import { MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import { resetNotificationSetting } from "../../../../actions/common";
import { clearServerErrors } from "../../../../actions/auth";

import { uploadResume, removeTalentResume } from "../../../../actions/talentResume";
import { useSelector, useDispatch } from "react-redux";
import { errorNotification, successNotification } from "../../../../common/commonMethods";
import {
  Upload,
  Button,
  message,
  Typography,
  Checkbox
} from "antd";
import { BASE_URL } from '../../../../common/constants'

const { Paragraph, Title } = Typography;

function UploadResume() {
  const dontHaveResume = useSelector(state => state.auth.user.dontHaveResume)
  const [doNotHaveCv, setDoNotHaveCv] = useState(dontHaveResume);
  const myCv = useSelector(state => state.auth.user.resume)
  const [fileList, setFileList] = useState([]);

  const btnLoading = useSelector(state => state.auth.btnLoading);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(
    state => state.auth.showSuccessNotification
  );
  const dispatch = useDispatch();

  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  }
  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };

  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification]);

  const removeCv = () => {
    dispatch(removeTalentResume({ resume: "" }));
    setFileList("")
  };

  const props = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: file => {
      const isPdfOrDocx =
        file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isPdfOrDocx) {
        message.error("You can only upload PDF/Docx file!");
        return true;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File must smaller than 2MB!");
        return true;
      }
      setFileList([file]);
      return false;
    },
    fileList
  };
  const checkboxChangeHandler = value => {
    return setDoNotHaveCv(!doNotHaveCv);
  };
  const handleUpload = () => {
    const formData = new FormData();
    if (doNotHaveCv) {
      dispatch(uploadResume({ dontHaveResume: doNotHaveCv }));
    } else {
      formData.append("resume", fileList[0]);
      dispatch(uploadResume(formData));
    }
  };
  return (
    <>
      <div >
        <div className='heading-wrapper' >
          <Title level={2}>Upload Resume</Title>
        </div>
        <Paragraph className="mt-4">
          Uploading a CV may be relevant to some employers, if you have one go
          ahead and use it.
        </Paragraph>
      </div>
      {(myCv !== undefined && myCv !== '' && myCv !== null) ?
        <div>
          <Button type="primary" onClick={e => {
            e.preventDefault();
            window.open(`/${myCv}`, '_blank')
          }}>View My CV</Button>
          <Link onClick={removeCv} to="#">
            <Paragraph
              style={{ display: "inline", marginLeft: "15px", color: "red" }}
            >
              <MinusCircleOutlined /> Delete My CV
          </Paragraph>
          </Link>
        </div> :
        <div >
          <Checkbox disabled={fileList.length > 0 && true} onChange={checkboxChangeHandler} className="checkbox-style" checked={doNotHaveCv}>
            I don't have a CV file
        </Checkbox>
          <>
            {!doNotHaveCv && <Upload {...props} className="upload-btn">
              <Button>
                <UploadOutlined /> Click to Select
              </Button>
            </Upload>}
            {fileList.length > 0 && <Button
              type="primary"
              onClick={handleUpload}
              style={{ marginTop: 16 }}
              loading={btnLoading}
              disabled={(!doNotHaveCv && fileList.length < 1)}
            >
              Upload
            </Button>}
            {doNotHaveCv && <Button
              type="primary"
              onClick={handleUpload}
              style={{ marginTop: 16 }}
              loading={btnLoading}
              disabled={(!doNotHaveCv && fileList.length < 1)}
            >
              Save
            </Button>}
          </>
        </div>
      }
    </>
  );
}

export default UploadResume;
