import { useState, useLayoutEffect } from 'react';
import { notification } from 'antd';

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}


export const errorNotification = (serverErrors) => {
  if (serverErrors && serverErrors.message) {
    notification.error({
      message: 'Error',
      description: serverErrors.message
    });
  } else {
    notification.error({
      message: 'Error',
      description: 'Some Error Occurred'
    });  
  }
};

export const successNotification = (apiResponse) => {
  notification.success({
    message: 'Success',
    description: apiResponse && apiResponse.message
  });
};

export const onFinishFailed = errorInfo => {
  notification.error({
    message: 'Error',
    description: errorInfo.errorFields[0].errors,
  });
};