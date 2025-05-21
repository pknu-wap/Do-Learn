import { useEffect, useState } from 'react';
import { fetchMyGroups } from 'api/myGroupsApi';
import { isLoggedIn } from 'utils/auth';

export const useMyGroupIds = () => {
	const [myGroupIds, setMyGroupIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isLoggedIn()) return;

		const load = async () => {
			try {
				const groups = await fetchMyGroups();
				const ids = groups.map((group: any) => group.id);
				setMyGroupIds(ids);
			} catch (err) {
				console.error('내 그룹 불러오기 실패:', err);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	return { myGroupIds, loading };
};
