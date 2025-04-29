import { useState, useEffect } from 'react';
import { fetchStudyGroups, StudyGroup } from 'api/studyGroupApi';

export const useStudyGroups = () => {
	const [groups, setGroups] = useState<StudyGroup[]>([]);
	const [nextCursor, setNextCursor] = useState<number | null>(0);
	const [loading, setLoading] = useState(false);

	const loadMore = async () => {
		if (nextCursor === null || loading) return;
		setLoading(true);
		try {
			const data = await fetchStudyGroups(nextCursor);
			setGroups((prev) => [...prev, ...data.groups]);
			setNextCursor(data.nextCursor);
		} catch (err) {
			console.error('그룹 불러오기 실패', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMore();
	}, []);

	return { groups, loadMore, hasMore: nextCursor !== null, loading };
};
