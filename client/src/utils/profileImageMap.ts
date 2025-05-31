export const profileImageMap: Record<number, string> = {
	1: '/assets/profile_images/profile-1st.png',
	2: '/assets/profile_images/profile-2nd.png',
	3: '/assets/profile_images/profile-3rd.png',
	4: '/assets/profile_images/profile-default.png',
};

export const getProfileImageUrl = (imageId: number): string => {
	return profileImageMap[imageId] || profileImageMap[4];
};
