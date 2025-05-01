import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useStudyGroups } from '../../hooks/useStudyGroups';
import StudyGroupItem from './StudyGroupItem';
import './StudyGroupsList.scss';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';

const StudyGroupsList = () => {
	const { groups, loadMore, hasMore, loading, message } = useStudyGroups();
	const [visibleCount, setVisibleCount] = useState(10);
	const observer = useRef<IntersectionObserver | null>(null);

	const lastGroupElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						if (groups && visibleCount < groups.length) {
							setVisibleCount((prev) => prev + 10);
						} else if (hasMore) {
							loadMore();
						}
					}
				},
				{ rootMargin: '100px' },
			);

			if (node) observer.current.observe(node);
		},
		[loading, visibleCount, groups, hasMore, loadMore],
	);

	if (message) {
		return (
			<div className="flex-center" style={{ padding: '20px' }}>
				{message}
			</div>
		);
	}

	if (!groups) return null;

	const visibleGroups = groups.slice(0, visibleCount);

	return (
		<div className="list-container">
			{visibleGroups.map((group, index) => {
				const isLast = index === visibleGroups.length - 1;
				return (
					<div key={group.id} ref={isLast ? lastGroupElementRef : undefined}>
						<StudyGroupItem group={group} />
					</div>
				);
			})}

			{loading && (
				<div className="flex-center" style={{ padding: '20px 0' }}>
					<img
						src="/assets/spinner.gif"
						alt="로딩 중"
						style={{ width: '40px', height: '40px' }}
					/>
				</div>
			)}
		</div>
	);
};

export default StudyGroupsList;
