import React, { Fragment, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import PositionType from './PositionType'
import { useDispatch } from 'react-redux'
import { setCurrentHireSNavbarButton } from '../../actions/common'

const Recruitment = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setCurrentHireSNavbarButton('recruitment'));
  }, [])

  return (
    // <Fragment>
    <>
      <PositionType />
    </>
    // </Fragment> 
  );
}
export default Recruitment;

