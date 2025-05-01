import api from './instance';

export interface StudyGroup {
	id: number;
	name: string;
	meetingDays: string;
	meetingTime: string;
	meetingType: string;
	currentMembers: number;
	maxMembers: number;
	region: string;
	category: string;
	type: string;
}

export interface StudyGroupsResponse {
	groups: StudyGroup[] | null;
	nextCursor: number | null;
	message?: string | null;
}

export const fetchStudyGroups = async (
	cursor: number = 0,
	size: number = 10,
	categories?: string,
	regions?: string,
): Promise<StudyGroupsResponse> => {
	const params: any = { cursor, size };
	if (categories) params.categories = categories;
	if (regions) params.regions = regions;

	const response = await api.get('/api/main/grouplist', { params });
	return response.data;
};
