import { useRef, useEffect } from 'react';
import { notification } from 'antd';
import { useState, useLayoutEffect } from 'react';
import jwtDecode from 'jwt-decode'


export const errorNotification = (serverErrors) => {
  console.log('SERVER Errors = ', serverErrors)
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
  notification.open({
    message: 'Errors',
    description: errorInfo.errorFields[0].errors,
  });
};

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

export const jwtTokenDecode = () => {
  const decodedToken = jwtDecode(localStorage.token);
  return decodedToken;
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}