// src/features/filter/filter.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Region, Category } from 'api/createGroupFormApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './filter.scss';

type DropdownType = 'regions' | 'categories' | 'times' | 'days' | null;
const MEETING_TIMES = ['오전', '오후', '저녁', '새벽'] as const;
const CYCLE_OPTIONS = ['월', '주'] as const; // ← as const 로 리터럴 타입 보존

interface FilterProps {
	selectedRegions: Region[];
	setSelectedRegions: React.Dispatch<React.SetStateAction<Region[]>>;
	selectedCategories: Category[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
	selectedTimes: string[];
	setSelectedTimes: React.Dispatch<React.SetStateAction<string[]>>;

	selectedMeetingCycle: '월' | '주' | null;
	setSelectedMeetingCycle: React.Dispatch<
		React.SetStateAction<'월' | '주' | null>
	>;
	selectedMeetingCount: number | null;
	setSelectedMeetingCount: React.Dispatch<React.SetStateAction<number | null>>;
	meetingComparison: 'above' | 'below';
	setMeetingComparison: React.Dispatch<React.SetStateAction<'above' | 'below'>>;
}

const Filter: React.FC<FilterProps> = ({
	selectedRegions,
	setSelectedRegions,
	selectedCategories,
	setSelectedCategories,
	selectedTimes,
	setSelectedTimes,

	selectedMeetingCycle,
	setSelectedMeetingCycle,
	selectedMeetingCount,
	setSelectedMeetingCount,
	meetingComparison,
	setMeetingComparison,
}) => {
	const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		const onOutsideClick = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpenDropdown(null);
			}
		};
		document.addEventListener('mousedown', onOutsideClick);
		return () => document.removeEventListener('mousedown', onOutsideClick);
	}, []);

	const toggleItem = <T,>(arr: T[], item: T, setter: (v: T[]) => void) => {
		setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
	};

	const handleReset = () => {
		setSelectedRegions([]);
		setSelectedCategories([]);
		setSelectedTimes([]);
		setSelectedMeetingCycle(null);
		setSelectedMeetingCount(null);
		setMeetingComparison('above');
	};

	return (
		<div className="filter-container flex-center" ref={containerRef}>
			<div className="filter flex-left">
				{/* 초기화 */}
				<button
					type="button"
					className="filter-button button2"
					onClick={handleReset}
				>
					초기화
				</button>

				{/* 만남장소 */}
				<div className="dropdown-wrapper">
					<button
						type="button"
						className="filter-button dropdown button2"
						onClick={() =>
							setOpenDropdown(openDropdown === 'regions' ? null : 'regions')
						}
					>
						만남장소
					</button>
					{openDropdown === 'regions' && (
						<div className="dropdown-menu">
							{Object.values(Region).map((region) => (
								<button
									key={region}
									type="button"
									className={`dropdown-item button2 ${
										selectedRegions.includes(region) ? 'selected' : ''
									}`}
									onClick={() =>
										toggleItem(selectedRegions, region, setSelectedRegions)
									}
								>
									{region}
								</button>
							))}
						</div>
					)}
				</div>

				{/* 만남횟수 */}
				<div className="dropdown-wrapper">
					<button
						type="button"
						className="filter-button dropdown button2"
						onClick={() =>
							setOpenDropdown(openDropdown === 'days' ? null : 'days')
						}
					>
						만남횟수
					</button>
					{openDropdown === 'days' && (
						<div className="dropdown-menu days-menu">
							{/* 주/월 선택 */}
							<div className="cycle-selector">
								{CYCLE_OPTIONS.map((c) => (
									<button
										key={c}
										type="button"
										className={`button2 ${selectedMeetingCycle === c ? 'selected' : ''}`}
										onClick={() => setSelectedMeetingCycle(c)} // 이제 `c`가 '월'|'주' 타입입니다
									>
										{c}
									</button>
								))}
							</div>

							{/* 숫자 입력 */}
							<div className="count-input-wrapper">
								<input
									type="number"
									min={1}
									value={selectedMeetingCount ?? ''}
									onChange={(e) =>
										setSelectedMeetingCount(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									className="button2 count-input"
								/>
								<span className="button2">회</span>
							</div>

							{/* 이상/이하 선택 */}
							<div className="comparison-selector" style={{ marginTop: 8 }}>
								<button
									type="button"
									className={`button2 ${meetingComparison === 'above' ? 'selected' : ''}`}
									onClick={() => setMeetingComparison('above')}
								>
									이상
								</button>
								<button
									type="button"
									className={`button2 ${meetingComparison === 'below' ? 'selected' : ''}`}
									onClick={() => setMeetingComparison('below')}
									style={{ marginLeft: 4 }}
								>
									이하
								</button>
							</div>
						</div>
					)}
				</div>

				{/* 시간대 */}
				<div className="dropdown-wrapper">
					<button
						type="button"
						className="filter-button dropdown button2"
						onClick={() =>
							setOpenDropdown(openDropdown === 'times' ? null : 'times')
						}
					>
						시간대
					</button>
					{openDropdown === 'times' && (
						<div className="dropdown-menu">
							{MEETING_TIMES.map((time) => (
								<button
									key={time}
									type="button"
									className={`dropdown-item button2 ${
										selectedTimes.includes(time) ? 'selected' : ''
									}`}
									onClick={() =>
										toggleItem(selectedTimes, time, setSelectedTimes)
									}
								>
									{time}
								</button>
							))}
						</div>
					)}
				</div>

				{/* 분야 */}
				<div className="dropdown-wrapper">
					<button
						type="button"
						className="filter-button dropdown button2"
						onClick={() =>
							setOpenDropdown(
								openDropdown === 'categories' ? null : 'categories',
							)
						}
					>
						분야
					</button>
					{openDropdown === 'categories' && (
						<div className="dropdown-menu">
							{Object.values(Category).map((category) => (
								<button
									key={category}
									type="button"
									className={`dropdown-item button2 ${
										selectedCategories.includes(category) ? 'selected' : ''
									}`}
									onClick={() =>
										toggleItem(
											selectedCategories,
											category,
											setSelectedCategories,
										)
									}
								>
									{category}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Filter;
