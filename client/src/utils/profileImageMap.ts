// 마이페이지
export const userProfileImageMap: Record<number, string> = {
	1: '/assets/img/profile/profile-1st.jpg',
	2: '/assets/img/profile/profile-2nd.jpg',
	3: '/assets/img/profile/profile-3rd.jpg',
	4: '/assets/img/profile/profile-default.jpg',
	5: '/assets/img/profile/profile-non-attendance.jpg',
};

export const getUserProfileImageUrl = (imageId: number): string => {
	return userProfileImageMap[imageId] || userProfileImageMap[4];
};

// 그룹 멤버 리스트, 랭킹
export const groupMemberImageMap: Record<number, string> = {
	1: '/assets/img/profile/profile-1st.jpg',
	2: '/assets/img/profile/profile-2nd.jpg',
	3: '/assets/img/profile/profile-3rd.jpg',
	4: '/assets/img/profile/profile-default.jpg',
	5: '/assets/img/profile/profile-non-attendance.jpg',
};

export const getGroupMemberProfileImageUrl = (imageId: number): string => {
	return groupMemberImageMap[imageId] || groupMemberImageMap[4];
};
