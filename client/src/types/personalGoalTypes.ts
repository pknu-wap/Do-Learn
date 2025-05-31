export interface WeeklyPlanRequest {
	memberGoalPlans: {
		subGoalId: number;
		date: string; // YYYY-MM-DD
		dayOfWeek: string; // "MONDAY" ~ "SUNDAY"
		completed: boolean;
	}[];
	personalTaskPlans: {
		content: string;
		date: string; // YYYY-MM-DD
		dayOfWeek: string; // "MONDAY" ~ "SUNDAY"
		completed: boolean;
	}[];
}
