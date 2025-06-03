import api from './instance';
import { getAuthHeaders } from './auth';

export interface AttendanceRecord {
	date: string;
	status: string;
}

interface CheckAttendanceResponse {
	message: string;
}

export const markAttendance = (studyGroupId: number) =>
	api.post<CheckAttendanceResponse>(`api/studygroup/${studyGroupId}/attendance`, null, { headers: getAuthHeaders() });

export const fetchAttendanceCalendar = (studyGroupId: number, year: number, month: number) => {
	const mm = String(month).padStart(2, '0');
	return api.get<AttendanceRecord[]>(`api/studygroup/${studyGroupId}/attendance/calendar?year=${year}&month=${mm}`, {
		headers: getAuthHeaders(),
	});
};
