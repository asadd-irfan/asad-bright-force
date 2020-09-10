// const AppError = require('./app-error-handler');
const NotificationMessages = require('../admin/models/notification-messages');


// const subscribeNotifications = async (notificationObj, subscribersObj, subscribersList) => {
// }


const createNotifications = async (notificationObj, receiverIds) => {
  let totalReceivers = receiverIds.length;
  let count = 0;
  for (let i = 0; i < totalReceivers; i++) {
    let notificationDetails = { ...notificationObj, receiverId: receiverIds[i] }
    // console.log('notificationDetails',notificationDetails)
    let notificationMsg = await NotificationMessages.create(notificationDetails);
    if (notificationMsg) {
      count++;
    } else {
      return false;
    }
  }
  if (count == totalReceivers) {
    return true;
  } else {
    return false;
  }
}


const sendNotifications = async (notificationObj, subscribersObj, subscribersList) => {

  let notificationSendingMethod = subscribersObj.sendingMethod;
  if (notificationSendingMethod.includes('db')) {
    console.log('sending notifications in db');
    if (subscribersList == null) {
      let subscribers = subscribersObj.subscribersList;
      let result = await createNotifications(notificationObj, subscribers);
      return result;
    } else {
      // let result = await subscribeNotifications(notificationObj, subscribersObj, subscribersList);
      let result = await createNotifications(notificationObj, subscribersList);
      return result;
    }
  }
  if (notificationSendingMethod.includes('sms')) {
    console.log('sending notifications through sms')

  }
  if (notificationSendingMethod.includes('email')) {
    console.log('sending notifications through email')

  }
}

module.exports = { sendNotifications, createNotifications };
