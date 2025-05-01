import api from './instance';
import { AxiosError } from 'axios';

export interface SearchGroupParams {
	keyword: string;
	categories?: string;
	regions?: string;
	cursor?: number;
	size?: number;
}

export interface Group {
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

export interface SearchGroupResponse {
	groups: Group[] | null;
	nextCursor: number | null;
	message: string | null;
}

export const searchGroups = async (
	params: SearchGroupParams,
): Promise<SearchGroupResponse> => {
	try {
		const { keyword, categories, regions, cursor = 0, size = 10 } = params;

		const queryParams = new URLSearchParams({
			keyword,
			size: String(size),
		});

		if (categories) queryParams.append('categories', categories);
		if (regions) queryParams.append('regions', regions);
		if (cursor !== null) queryParams.append('cursor', String(cursor));

		const response = await api.get(
			`/grouplist/search?${queryParams.toString()}`,
		);

		return response.data;
	} catch (error) {
		const err = error as AxiosError;
		console.error(err.response?.data || err.message);

		return {
			groups: null,
			nextCursor: null,
			message: 'API 요청 중 에러가 발생했습니다.',
		};
	}
};
