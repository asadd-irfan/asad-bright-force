import React from 'react';

function VideoInterviewResult({
    talentEvaluationDetails
}) {
    let videoInterview = talentEvaluationDetails && talentEvaluationDetails.videoInterview
    
    return (
        <div className='mb-20'>
            <div className='horizontally-middle mb-10'>
                <h4>Video Interview</h4>
            </div>
            
            
            {/* <div className='mb-20'>
                <h5>Results:</h5>
                <span>{videoInterview && videoInterview.resultDetails}</span>
            </div> */}
            <div className='mb-20'>
                <h5>Video Link:</h5>
                <span><a target='_blank' rel='noopener noreferrer' href={videoInterview && videoInterview.videoLink}>{videoInterview && videoInterview.videoLink}</a></span>
            </div>
            
        </div>
    )
}

export default VideoInterviewResult;
