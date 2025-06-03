import api from './instance';
import { getAuthHeaders } from './auth';
import { CreateCommonGoalRequest, SubGoal } from 'types/commonGoalTypes';

// 대범주 생성(POST)
export const createCommonGoal = async (payload: CreateCommonGoalRequest) => {
	const headers = {
		...getAuthHeaders(),
		'Content-Type': 'application/json',
	};

	const response = await api.post('/api/weekly-goals', payload, { headers });
	return response.data;
};

// 대범주 전체 조회(GET)
export const getCommonGoals = async ({
	studyGroupId,
	referenceDate,
	startDayOfWeek,
}: {
	studyGroupId: number;
	referenceDate: string; // "YYYY-MM-DD"
	startDayOfWeek: string; // e.g. "MONDAY"
}) => {
	const headers = getAuthHeaders();

	const response = await api.get('/api/weekly-goals', {
		headers,
		params: {
			studyGroupId,
			referenceDate,
			startDayOfWeek,
		},
	});

	return response.data;
};

// 대범주 상세 조회(소범주/GET)
export const getCommonGoalDetail = async (goalId: number) => {
	const headers = getAuthHeaders();

	const response = await api.get(`/api/weekly-goals/${goalId}`, {
		headers,
	});

	return response.data;
};

// 대범주 수정(PUT)
export const updateCommonGoal = async (goalId: number, payload: CreateCommonGoalRequest) => {
	const headers = {
		...getAuthHeaders(),
		'Content-Type': 'application/json',
	};

	const response = await api.put(`/api/weekly-goals/${goalId}`, payload, {
		headers,
	});

	return response.data;
};

//대범주 삭제
export const deleteCommonGoal = async (goalId: number) => {
	const headers = getAuthHeaders();

	const response = await api.delete(`/api/weekly-goals/${goalId}`, {
		headers,
	});

	return response.status; // 보통 204 반환됨
};

// 소범주 생성(POST)
export const createSubGoal = async (goalId: number, content: string) => {
	const headers = {
		...getAuthHeaders(),
		'Content-Type': 'application/json',
	};

	const response = await api.post(`/api/weekly-sub-goals/${goalId}`, { content }, { headers });

	return response.data;
};

// 소범주 수정(PUT)
export const updateSubGoal = async (subGoalId: number, content: string) => {
	const headers = {
		...getAuthHeaders(),
		'Content-Type': 'application/json',
	};

	const response = await api.put(`/api/weekly-sub-goals/${subGoalId}`, { content }, { headers });

	return response.data;
};

// 소범주 삭제
export const deleteSubGoal = async (subGoalId: number) => {
	const headers = getAuthHeaders();

	const response = await api.delete(`/api/weekly-sub-goals/${subGoalId}`, {
		headers,
	});

	return response.status;
};
