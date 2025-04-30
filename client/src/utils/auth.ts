export const isLoggedIn = (): boolean => {
	const token =
		localStorage.getItem('accessToken') ||
		sessionStorage.getItem('accessToken');
	return !!token;
};
