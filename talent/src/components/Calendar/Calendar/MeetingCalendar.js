import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment';
import { Modal, Typography, Select, Form } from 'antd';
import moment from 'moment';

import './calendar.scss'

const { Option } = Select;
const { Paragraph } = Typography;


function TMMeetingCalendar(props) {
	// const dispatch = useDispatch();
	// const managersDetails = useSelector(state => state.auth && state.auth.TMManagersCalendarDetail &&
	// 	state.auth.TMManagersCalendarDetail.talentManagersSchedule)
	// const calendarData = useSelector(state => state.auth && state.auth.TMManagersCalendarDetail &&
	// 	state.auth.TMManagersCalendarDetail.calendersData)

	// const apiResponse = useSelector(state => state.auth.apiResponse);
	// const user = useSelector(state => state.auth.user);


	// const serverErrors = useSelector(state => state.auth.serverErrors);
	// const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
	// const [form] = Form.useForm();

	// const calendarComponentRef = useRef()
	// const [calendarEvents, setCalendarEvents] = useState([])
	// const [scheduleMeeting, setScheduleMeeting] = useState([])
	// const [meetingModalVisible, setMeetingModalVisible] = useState(false)
	// const [dateArg, setDateArg] = useState();

	// const handleModalOk = () => {
	// 	setMeetingModalVisible(false)
	// 	const values = {
	// 		startTime: dateArg.date,
	// 		endTime: `${dateArg && moment(dateArg && dateArg.date).add(1, 'hours').format()}`
	// 	}
	// 	dispatch(scheduleTalentMeeting(values))
	// };

	// const handleModalCancel = () => {
	// 	setMeetingModalVisible(false)
	// };


	
	// function renderAvailableMeetings(value) {
	// 	let managerName = null
	// 	let selectedManagerId = null
	// 	managersDetails && managersDetails.filter(item => {
	// 		if (item.talentManager.name === value) {
	// 			managerName = value;
	// 			return selectedManagerId = item.talentManager._id
	// 		}
	// 	});
	// 	let managerMeetingDetail = calendarData && calendarData[selectedManagerId]
	// 	let calendarEventsArr = []
	// 	if (managerMeetingDetail) {
	// 		calendarEventsArr = managerMeetingDetail && managerMeetingDetail.map(item => {
	// 			return {
	// 				title: 'TM meeting',
	// 				start: item.startTime,
	// 				end: item.endTime,
	// 				id: item._id,
	// 				allDay: false
	// 			}
	// 		})
	// 	}
	// 	let managerAvailability = []
	// 	managersDetails && managersDetails.filter(item => {
	// 		if (item && item.schedule) {
	// 			item.schedule.filter(schedule => {
	// 				if (schedule.userId === selectedManagerId) {
	// 					managerAvailability.push({
	// 						start: schedule.startDateTime,
	// 						end: schedule.endDateTime,
	// 						color: '#073763',
	// 						rendering: 'background'
	// 					})
	// 				}
	// 			})
	// 		}
	// 	})
	// 	setCalendarEvents([...managerAvailability, ...calendarEventsArr])
	// 	setScheduleMeeting({
	// 		managerName: managerName,
	// 		events: [...calendarEventsArr]
	// 	});
	// }

	// const handleDateClick = (arg) => {
	// 	// show modal only when date available
	// 	calendarEvents.map((event, index) => {
	// 		let startDateTime = moment(moment(event.start).toDate()).format('MM-DD-YYYY HH:mm');
	// 		let endDateTime = moment(moment(event.end).toDate()).format('MM-DD-YYYY HH:mm');
	// 		let selectedDate = moment(arg.date).format('MM-DD-YYYY HH:mm');
	// 		if (selectedDate >= startDateTime && selectedDate <= endDateTime) {
	// 			setDateArg(arg)
	// 			setMeetingModalVisible(true);		
	// 		}
	// 	})
	// }

	// const getTManagers = () => {
	// 	const weekStart = moment(calendarComponentRef.current && calendarComponentRef.current.calendar.view.activeStart).format('YYYY-MM-DD');
	// 	const weekEnd = moment(calendarComponentRef.current && calendarComponentRef.current.calendar.view.activeEnd).format('YYYY-MM-DD');;
	// 	dispatch(getTManagersDetails(`meetingType=talent-manager-meeting&startDate=${weekStart}&endDate=${weekEnd}`))

	// }
	// useEffect(() => {
	// 	const weekStart = moment(calendarComponentRef.current && calendarComponentRef.current.calendar.view.activeStart).format('YYYY-MM-DD');
	// 	const weekEnd = moment(calendarComponentRef.current && calendarComponentRef.current.calendar.view.activeEnd).format('YYYY-MM-DD');;
	// 	dispatch(getTManagersDetails(`meetingType=talent-manager-meeting&startDate=${weekStart}&endDate=${weekEnd}`))
	// }, [])

	// useEffect(() => {
	// 	renderAvailableMeetings(managersDetails && managersDetails[0] && managersDetails[0].talentManager.name)
	// 	form.setFieldsValue({
	// 		manager: managersDetails && managersDetails[0] && managersDetails[0].talentManager.name
	// 	});
	// 	serverErrors && openErrorNotification();
	// 	showSuccessNotification && openSuccessNotification();
	// }, [serverErrors, showSuccessNotification, calendarData]);

	// const openErrorNotification = () => {
	// 	errorNotification(serverErrors);
	// 	dispatch(clearServerErrors());
	// }
	// const openSuccessNotification = () => {
	// 	successNotification(apiResponse)
	// 	dispatch(resetNotificationSetting());
	// 	const weekStart = moment(calendarComponentRef.current && calendarComponentRef.current.calendar.view.activeStart).format('YYYY-MM-DD');
	// 	const weekEnd = moment(calendarComponentRef.current && calendarComponentRef.current.calendar.view.activeEnd).format('YYYY-MM-DD');;
	// 	dispatch(getTManagersDetails(`meetingType=talent-manager-meeting&startDate=${weekStart}&endDate=${weekEnd}`))
	// };

	const { 
		dateArg, 
		calendarComponentRef, 
		form, 
		getTManagers,
		onDateClick,
		calendarEvents,
		renderAvailableMeetings,
		managersDetails,
		handleModalCancel,
		handleModalOk,
		meetingModalVisible,
		managerOrInterviewer
	 } = props;
	return (
		<div className='calendar-app-container'>
			<Modal
				title="Confirm meeting"
				visible={meetingModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
			>
				<Paragraph>Would you like to schedule your meeting on  {dateArg && moment(dateArg && dateArg.date).format('dddd')}
					{' '} {dateArg && moment(dateArg && dateArg.date).format('LL')}
					{' at '} {dateArg && moment(dateArg && dateArg.date).format('LT')}
					{' to '} {dateArg && moment(dateArg && dateArg.date).add(1, 'hours').format('LT')} ?</Paragraph>

			</Modal>
			<div className='calendar-app' >	
				<Form
					form={form}
				>
					<Form.Item name='manager' rules={
						[
							{
								required: true,
								message: 'Please select an manager'
							}
						]
					}>
						<Select className='mb-3' style={{ width: 200, border: '1px solid black' }} onChange={renderAvailableMeetings}>
							{
								managersDetails && managersDetails.map((item, ind) => {
									return <Option key={ind} value={item[managerOrInterviewer].name}>{item[managerOrInterviewer].name}</Option>
								})
							}
						</Select>
					</Form.Item>
				</Form>
				<FullCalendar
					customButtons={{
						prevButton: {
							text: 'prev',
							click: function () {
								calendarComponentRef.current && calendarComponentRef.current.calendar.prev()
								getTManagers()
							}
						},
						nextButton: {
							text: 'next',
							click: function () {
								calendarComponentRef.current && calendarComponentRef.current.calendar.next()
								getTManagers()
							}
						},
						todayButton: {
							text: 'today',
							click: function () {
								calendarComponentRef.current && calendarComponentRef.current.calendar.today()
								getTManagers()
							}
						}
					}}
					defaultView="timeGridWeek"
					visibleRange={{
						start: '2020-04-03',
						end: '2020-04-03'
					}}
					header={{
						left: `prevButton,nextButton todayButton`,
						center: 'title',
						right: ``,
					}}

					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin]}
					ref={calendarComponentRef}
					// hiddenDays={[6]}
					firstDay={moment().day()}
					minTime='08:00:00'
					maxTime='20:00:00'
					slotDuration={{ hours: 1 }}
					events={calendarEvents}
					dateClick={onDateClick}
				/>
			</div>
		</div>
	)
}

export default TMMeetingCalendar;


