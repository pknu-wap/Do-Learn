import api from './instance';
import { getAuthHeaders } from './auth';

export enum Category {
	어학 = '어학',
	IT = 'IT',
	공무원 = '공무원',
	자격증 = '자격증',
	취업준비 = '취업준비',
	자기계발 = '자기계발',
	기타 = '기타',
	학교 = '학교',
}

export enum Region {
	서울특별시 = '서울특별시',
	부산광역시 = '부산광역시',
	대구광역시 = '대구광역시',
	인천광역시 = '인천광역시',
	광주광역시 = '광주광역시',
	대전광역시 = '대전광역시',
	울산광역시 = '울산광역시',
	세종특별자치시 = '세종특별자치시',
	경기도 = '경기도',
	강원도 = '강원도',
	충청북도 = '충청북도',
	충청남도 = '충청남도',
	전라북도 = '전라북도',
	전라남도 = '전라남도',
	경상북도 = '경상북도',
	경상남도 = '경상남도',
	제주특별자치도 = '제주특별자치도',
	해당없음 = '해당없음',
}

export enum StudyType {
	온라인 = '온라인',
	오프라인 = '오프라인',
	혼합 = '혼합',
}

interface CreateGroupParams {
	name: string;
	maxMembers: number;
	notice: string;
	meetingDays: string;
	meetingTime: string;
	meetingType: StudyType;
	region: Region;
	category: Category;
	type: string;
	startDate: string; // ex:2025-01-01
}

interface CreateGroupResponse {
	message: string;
}

export const createStudyGroup = async (data: CreateGroupParams): Promise<CreateGroupResponse> => {
	const response = await api.post('/api/studygroup/create', data, {
		headers: {
			...getAuthHeaders(),
			'Content-Type': 'application/json',
		},
	});

	return response.data;
};
