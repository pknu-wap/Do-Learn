import axios from 'axios';
import { getAuthHeaders } from './auth';
import { WeeklyPlanRequest } from 'types/personalGoalTypes';

// 주차 계획 생성/수정 (PUT)
export const createOrUpdateWeeklyPlan = async (
	groupId: number,
	referenceDate: string,
	payload: WeeklyPlanRequest,
) => {
	const headers = {
		...getAuthHeaders(),
		'Content-Type': 'application/json',
	};

	const response = await axios.post(
		`/api/weekly-plans?groupId=${groupId}&referenceDate=${referenceDate}`,
		payload,
		{ headers },
	);

	return response.data;
};

// 주차 계획 조회 (조회만, 응답 타입은 나중에 정의)
export const getWeeklyPlans = async (
	groupId: number,
	referenceDate: string,
) => {
	const headers = getAuthHeaders();

	const response = await axios.get('/api/weekly-plans', {
		headers,
		params: {
			groupId,
			referenceDate,
		},
	});

	return response.data;
};

// 대범주 계획 완료 상태 변경 (대범주 완료 여부까지 응답)
export const updateCommonCompletion = async (
	planId: number,
	completed: boolean,
) => {
	const headers = getAuthHeaders();

	const response = await axios.patch(
		`/api/weekly-plans/member-goals/${planId}/completion`,
		null, // PATCH에 body 없음
		{
			headers,
			params: { completed },
		},
	);

	return response.data as {
		completed: boolean; // 대범주의 완료 여부
		message: string;
	};
};

// 개인 목표 완료 상태 변경
export const updatePersonalCompletion = async (
	taskId: number,
	completed: boolean,
) => {
	const headers = getAuthHeaders();

	const response = await axios.patch(
		`/api/weekly-plans/personal-tasks/${taskId}/completion`,
		null,
		{
			headers,
			params: { completed },
		},
	);

	return response.data as {
		completed: boolean;
		message: string;
	};
};
