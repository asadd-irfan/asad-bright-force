import { notification } from 'antd';
import { useState, useLayoutEffect } from 'react';
import jwtDecode from 'jwt-decode'
import { PAGE_LIMIT } from '../common/constants'

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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export const makeQueryParamterString = (paramsDictionary) => {
  let params = null;
  Object.keys(paramsDictionary).forEach(key => {
    if (paramsDictionary[key] === undefined || paramsDictionary[key] === '' || paramsDictionary[key] === null) {
      delete paramsDictionary[key];
    }
  });

  if (isEmpty(paramsDictionary)) {
    params = `?page=1&limit=${PAGE_LIMIT}`
  }
  else {
    params = '?'
    Object.keys(paramsDictionary).forEach((key, index) => {
      index === 0 ? params += key + '=' + paramsDictionary[key] : params += '&' + key + '=' + paramsDictionary[key]
    });
  }

  return params;
}

export const isValidUrl = (url) => {
  var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(url)) {
    return true;
  }
  else {
    return false;
  }
}