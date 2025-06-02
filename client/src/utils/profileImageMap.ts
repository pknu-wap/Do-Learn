export const profileImageMap: Record<number, string> = {
	1: '/assets/profile_images/profile-1st.jpg',
	2: '/assets/profile_images/profile-2nd.jpg',
	3: '/assets/profile_images/profile-3rd.jpg',
	4: '/assets/profile_images/profile-default.jpg',
	5: '/assets/profile_images/profile-non-attendance.jpg',
};

export const getProfileImageUrl = (imageId: number): string => {
	return profileImageMap[imageId] || profileImageMap[4];
};
