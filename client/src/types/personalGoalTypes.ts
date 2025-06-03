export interface WeeklyPlan {
	date: string;
	weekday: string;
	tasks: {
		taskId: number;
		content: string;
		completed: boolean;
	}[];
}

export interface WeeklyPlanRequest {
	plans: {
		date: string;
		taskIds: number[];
	}[];
}

// 서버 응답 타입: memberWeeklyPlans 항목
export interface SubGoalPlan {
	id: number;
	subGoalContent: string;
	completed: boolean;
	dayOfWeek: string;
	date: string;
}

// 서버 응답 타입: personalTasks 항목
export interface PersonalTaskPlan {
	id: number;
	content: string;
	completed: boolean;
	dayOfWeek: string;
	date: string;
}

// 요일별로 묶은 최종 렌더링용 데이터
export interface MergedDayPlan {
	dayOfWeek: string;
	weekday: string;
	date: string;
	tasks: {
		taskId: number;
		content: string;
		completed: boolean;
	}[];
}
