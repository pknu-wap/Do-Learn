import api from './instance';
import { getAuthHeaders } from './auth';

export interface GroupMember {
	userId: number;
	nickname: string;
	profileImage: number;
}

export const fetchGroupMembers = async (
	studyGroupId: number,
): Promise<GroupMember[]> => {
	const response = await api.get<{
		studyGroupId: number;
		members: GroupMember[];
	}>(`/api/studygroup/${studyGroupId}/members`, {
		headers: getAuthHeaders(),
	});
	return response.data.members;
};
