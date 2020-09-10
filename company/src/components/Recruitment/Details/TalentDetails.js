import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Avatar, Tag } from 'antd'
import '@ant-design/compatible/assets/index.css';
import { useSelector } from 'react-redux';
import '../recruitment.scss'
import moment from 'moment'
import axios from 'axios';
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setSelectedPositionRecruitment } from '../../../actions/positions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToolbox, faSuitcase, faGraduationCap, faClipboardList } from '@fortawesome/free-solid-svg-icons'
import user from '../../../assets/img/user.png'

const { Paragraph } = Typography;


const TalentDetails = ({
  talentDetails,
  positionRec
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const appConfigs = useSelector(state => state.auth.appConfigs);
  const [talent, setTalent] = useState(talentDetails)
  const [engagementPref, setEngagementPref] = useState(null)
  const employmentOptions = appConfigs && appConfigs['employment-type']
  const RoleOptions = appConfigs && appConfigs['preferred-role']
  const skillsOptions = appConfigs && appConfigs['skills']
  const [skills, setSkills] = useState([])
  const [codingChallengeScores, setCodingChallengeScores] = useState([])
  const [currencyName, setCurrencyName] = useState()
  const currencyOptions = appConfigs && appConfigs['currency']
  const [minSalary, setMinSalary] = useState(0)
  const [mainRole, setMainRole] = useState('')
  const [secondaryRole, setSecondaryRole] = useState('')

  useEffect(() => {
    setTalent(talentDetails)
  }, [talentDetails])

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('/api/company/talent-evaluation/' + talent?._id);
      if (res?.data?.result) {
        let evaluation = res?.data?.result
        setCodingChallengeScores(evaluation?.codingChallenge?.categoriesScores)
      }

    }
    fetchData();
  }, [talentDetails]);
  // console.log('talent?.salary', talent?.salary)

  useEffect(() => {
    employmentOptions && employmentOptions.map(emp => {
      if (emp._id === talent?.employmentType[0]) {
        setEngagementPref(emp.name)
      }
    })
    if (currencyOptions.length > 0 && talent?.currency) {
      const currencyObj = currencyOptions.find(element => element._id === talent?.currency);
      setCurrencyName(currencyObj.name)
    }
    if (talent?.salary?.minSalary) {
      setMinSalary(talent?.salary?.minSalary)
    }
  }, [talent, employmentOptions, currencyOptions])

  useEffect(() => {
    let mainRoleId = talent?.preferredRoles?.mainRole?.name;
    let roleId = talent?.preferredRoles?.secondaryRole?.name;
    if (mainRoleId) {
      let res = RoleOptions && RoleOptions.find(el => el._id == mainRoleId);
      setMainRole(res?.name)
    }
    if (roleId) {
      let res = RoleOptions && RoleOptions.find(el => el._id == roleId);
      setSecondaryRole(res?.name)
    }
  }, [talent, RoleOptions])

  function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    let selectedSkills = [];
    let talentSkills = talent?.preferredRoles?.mainRole?.skills;
    if (talentSkills) {
      talentSkills.map(skill => {
        let res = skillsOptions && skillsOptions.find(el => el._id == skill);
        selectedSkills.push(res);
        return res;
      })
      setSkills(selectedSkills)
    }
  }, [talent, skillsOptions])

  return (
    <div style={{ cursor: "pointer" }} onClick={() => {
      if (positionRec.status == "long-list") {
        history.push('/company/hire/recruitment/talent-page/' + positionRec?._id)
      }
      if (positionRec.status == "short-list" && (positionRec.shortListStatus == "rejected" || positionRec.shortListStatus == "pending")) {
        history.push('/company/hire/recruitment/view-offer/' + positionRec?._id)
      }
      if (positionRec.status == "interview" || (positionRec.status == "short-list" && positionRec.shortListStatus == "accepted")) {
        history.push('/company/hire/recruitment/talent-page/schedule-interview/' + positionRec?._id)
      }
      dispatch(setSelectedPositionRecruitment(positionRec))

    }}>
      <Row>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Avatar size={64} icon={<img src={
            talent?.profileImage.includes("http")
              ? talent?.profileImage
              : `/${talent?.profileImage}`
          } width='150px' height='120px' />}
          />
        </Col>
        <Col xs={20} sm={20} md={20} lg={20}>
          <Paragraph>
            <strong> {talent?.name}</strong>  <Tag color="blue">{engagementPref}</Tag>
          </Paragraph>
          <Paragraph>
            <strong> {talent?.location?.city}, {talent?.location?.country} * </strong>  <strong>Prefers:  {numberWithCommas(minSalary)} {currencyName} / yr</strong>
          </Paragraph>
        </Col>

      </Row>

      <Paragraph>
        <strong>{talent?.summary}</strong>
      </Paragraph>

      {talent?.workExperience.length > 0 && talent?.workExperience.map((work, index) => {
        return <Paragraph key={index}>
          <FontAwesomeIcon icon={faSuitcase} style={{ fontSize: 16, marginRight: 10 }} /> <strong>{work.title} in  {work.companyName}<br /> from : {moment(work.startDate).format('MMM-YYYY')} to: {moment(work.endDate).format('MMM-YYYY')} </strong>
        </Paragraph>
      })}


      {talent?.education.length > 0 && talent?.education.map((edu, index) => {
        return <Paragraph key={index}>
          <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: 16, marginRight: 10 }} />  <strong>{edu.degreeTitle} from {edu.instituteName} in {moment(edu.graduationYear).format('MMM-YYYY')} </strong>
        </Paragraph>
      })}
      {(talent?.preferredRoles?.mainRole || talent?.preferredRoles?.secondaryRole) &&
        <Paragraph >
          <FontAwesomeIcon icon={faClipboardList} style={{ fontSize: 16, marginRight: 10 }} />
          <strong>{mainRole} - {talent?.preferredRoles?.mainRole?.yearsOfExperience} years , {secondaryRole} - {talent?.preferredRoles?.secondaryRole?.yearsOfExperience} years  </strong>
        </Paragraph>
      }
      {talent?.preferredRoles?.mainRole?.skills && <Paragraph>
        <FontAwesomeIcon icon={faToolbox} style={{ fontSize: 16, marginRight: 10 }} />  <strong>{skills.map((skill, index) => {
          return <span key={index}>{index > 0 && ','} {skill.name}</span>
        })}</strong>



      </Paragraph>}


    </div>
  )
}
export default TalentDetails;

