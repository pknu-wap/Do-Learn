import { useState, useEffect } from 'react';
import { fetchStudyGroups, StudyGroup } from 'api/studyGroupApi';

export const useStudyGroups = () => {
	const [groups, setGroups] = useState<StudyGroup[]>([]);
	const [nextCursor, setNextCursor] = useState<number | null>(0);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const loadMore = async () => {
		if (nextCursor === null || loading) return;

		setLoading(true);
		try {
			const data = await fetchStudyGroups(nextCursor);

			if (data.groups === null) {
				setNextCursor(null);
				setMessage(data.message ?? '해당 목록이 없습니다.');
			} else {
				setGroups((prev) => [...prev, ...(data.groups ?? [])]);
				setNextCursor(data.nextCursor);
			}
		} catch (err) {
			console.error('그룹 불러오기 실패', err);
			setMessage('그룹 데이터를 불러오는 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMore();
	}, []);

	return { groups, loadMore, hasMore: nextCursor !== null, loading, message };
};
