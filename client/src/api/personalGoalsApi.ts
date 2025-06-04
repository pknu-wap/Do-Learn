// src/api/personalGoalsApi.ts

import api from './instance';
import { getAuthHeaders } from './auth';
import { WeeklyPlanRequest } from 'types/personalGoalTypes';

// 주차 계획 생성/수정
export const createOrUpdateWeeklyPlan = async (groupId: number, referenceDate: string, payload: WeeklyPlanRequest) => {
	const headers = {
		...getAuthHeaders(),
		'Content-Type': 'application/json',
	};

	const response = await api.post(`/api/weekly-plans?groupId=${groupId}&referenceDate=${referenceDate}`, payload, {
		headers,
	});
	return response.data;
};

// 주차 계획 조회
export const getWeeklyPlans = async (groupId: number, referenceDate: string) => {
	const headers = getAuthHeaders();

	const response = await api.get('/api/weekly-plans', {
		headers,
		params: { groupId, referenceDate },
	});
	return response.data;
};

// 개인 목표 완료 상태 변경
export const updatePersonalCompletion = async (taskId: number, completed: boolean) => {
	const headers = getAuthHeaders();

	const response = await api.patch(`/api/weekly-plans/personal-tasks/${taskId}/completion`, null, {
		headers,
		params: { completed },
	});
	return response.data as { completed: boolean; message: string };
};

// 개인 목표 삭제
export const deletePersonalTask = async (taskId: number) => {
	const headers = getAuthHeaders();

	const response = await api.delete(`/api/weekly-plans/personal-tasks/${taskId}`, { headers });
	return response.data;
};
