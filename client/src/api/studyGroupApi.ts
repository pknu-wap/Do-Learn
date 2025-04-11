import api from './instance';

export interface StudyGroup {
	id: number;
	name: string;
	meetingDays: string;
	meetingTime: string;
	department: string | null;
	meetingType: string | null;
	currentMembers: number;
	maxMembers: number;
}

export interface StudyGroupsResponse {
	groups: StudyGroup[];
	nextCursor: number | null;
}

export const fetchStudyGroups = async (
	cursor: number = 0,
	size: number = 10,
): Promise<StudyGroupsResponse> => {
	const response = await api.get('/api/main/grouplist', {
		params: { cursor, size },
	});
	return response.data;
};
