import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import '../positions.scss'
import moment from 'moment'
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const { Paragraph } = Typography;


function DetailsInfo({
  talent
}) {
  const history = useHistory();
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const employmentOptions = appConfigs && appConfigs['employment-type']
  const skillsOptions = appConfigs && appConfigs['skills']
  let roleOptions = appConfigs && appConfigs['preferred-role']
  const [engagementPref, setEngagementPref] = useState('')
  const [skills, setSkills] = useState([])
  const [preferredRole, setPreferredRole] = useState('')

  useEffect(() => {
    let engPref = ''

    employmentOptions && employmentOptions.map(emp => {
      if (emp._id === talent?.employmentType[0]) {
        engPref = emp.name
      }
    })
    setEngagementPref(engPref)
  }, [talent])

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
  }, [talent])



  useEffect(() => {
    let roleId = talent?.preferredRoles?.mainRole?.name;
    if (roleId) {
      let res = roleOptions && roleOptions.find(el => el._id == roleId);
      setPreferredRole(res?.name)
    }
  }, [talent])

  const gotoTalentPage = (id) => {
    history.push(`/admin/talents/${id}`);
  }

  return (
    <div key={talent?._id} style={{ cursor: "pointer" }} onClick={() => gotoTalentPage(talent?._id)}>
      <Paragraph>
        <strong>Name:</strong> {talent?.name} | <strong>Engagement Preference:</strong> {engagementPref}
      </Paragraph>
      <Paragraph>
        <strong>Location:</strong> {talent?.location?.city}, {talent?.location?.country} | <strong>Minimum Salary Expectation: </strong> {talent?.salary?.minSalary}
      </Paragraph>
      <Paragraph>
        <strong>Employment</strong>
      </Paragraph>
      {talent?.workExperience?.length > 0 && talent?.workExperience?.map((work, index) => {
        return <Paragraph key={index}>
          {index + 1}. <strong>Company Name: </strong> {work.companyName} |&nbsp;
                  <strong>Title: </strong> {work.title} |&nbsp;
                  <strong>Description: </strong> {work.description} |&nbsp;
                  <strong>Start Date: </strong> {moment(work.startDate).format('MMM-YYYY')} |&nbsp;
                  {work.currentlyWorking ? "Currently Working Here" : <span><strong>End Date: </strong> {moment(work.endDate).format('MMM-YYYY')} </span>}
        </Paragraph>
      })}
      <Paragraph>
        <strong>Education</strong>
      </Paragraph>
      {talent?.education?.length > 0 && talent?.education?.map((edu, index) => {
        return <Paragraph key={index}>
          {index + 1}. <strong>Institute Name: </strong> {edu.instituteName} |&nbsp;
                  <strong>Degree Title: </strong> {edu.degreeTitle} |&nbsp;
                  <strong>Graduation Year: </strong> {edu.graduationYear}
        </Paragraph>
      })}
      <Paragraph>
        <strong>Preferred Roles:</strong> {preferredRole}
      </Paragraph>
      {talent?.preferredRoles?.mainRole?.skills && <Paragraph>
        <strong>Skills: </strong> {skills.map((skill, index) => {
          return <span key={index}>{index > 0 && ','} {skill?.name}</span>
        })}



      </Paragraph>}




    </div>
  )
}

export default DetailsInfo;
