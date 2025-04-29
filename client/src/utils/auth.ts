export const isLoggedIn = (): boolean => {
	const token = localStorage.getItem('accessToken');
	return !!token;
};
