import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import './companyPreferences.scss'

const { CheckableTag } = Tag;

const PreferredIndustriesTag = (props) => {

    const [isCheckTag, setCheckTag] = useState(false)

    const handleTagChange = checked => {
        if(props.selectedIndustries.length < 5){
            setCheckTag(checked);
            props.parentcallback(checked, props.value);
        }
        else {
            props.selectedIndustries.map(obj => {
                if (obj.id === props.value){
                    setCheckTag(checked);
                    props.parentcallback(checked, props.value);
                }
            }) 
        }
    };
    
    return (
        <CheckableTag className='checkable-tag' checked={isCheckTag} onChange={handleTagChange}>{props.children}</CheckableTag>
      );
}

export default PreferredIndustriesTag
