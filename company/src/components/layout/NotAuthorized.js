import React, { Fragment } from 'react';

const NotAuthorized = () => {
  return (
    <Fragment>
      <div style={{ textAlign: 'center' ,margin:'3em'}}>
        <h3>You are not authorized to access this page.</h3>
      </div>
    </Fragment>
  );
};

export default NotAuthorized;
