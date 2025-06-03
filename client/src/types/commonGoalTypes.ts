export interface SubGoal {
	id?: number; // 선택: 생성 요청 시에는 없어도 되고 응답엔 있음
	content: string;
	deleted?: boolean;
}

export interface CommonGoal {
	goalId: number;
	studyGroupId: number;
	weeklyPeriodId: number;
	startDate: string;
	endDate: string;
	startDayOfWeek: string | null;
	mainCategory: string;
	deleted: boolean;
	subGoals: SubGoal[];
}

export interface CreateCommonGoalRequest {
	studyGroupId: number;
	startDate?: string;
	startDayOfWeek?: string;
	mainCategory: string;
	subGoals?: SubGoal[];
}
