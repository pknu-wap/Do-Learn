import React, { useRef, useEffect, useState } from 'react';
import { Region, Category } from 'api/createGroupFormApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './filter.scss';

type DropdownType = 'regions' | 'categories' | 'times' | 'days' | null;
const MEETING_TIMES = ['오전', '오후', '저녁', '새벽'];
const CYCLE_OPTIONS = ['월', '주'];

interface FilterProps {
	selectedRegions: Region[];
	setSelectedRegions: React.Dispatch<React.SetStateAction<Region[]>>;
	selectedCategories: Category[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
	selectedTimes: string[];
	setSelectedTimes: React.Dispatch<React.SetStateAction<string[]>>;
}

const Filter: React.FC<FilterProps> = ({
	selectedRegions,
	setSelectedRegions,
	selectedCategories,
	setSelectedCategories,
	selectedTimes,
	setSelectedTimes,
}) => {
	const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
	const containerRef = useRef<HTMLDivElement>(null);

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

	const toggleDropdown = (type: DropdownType) => {
		setOpenDropdown((prev) => (prev === type ? null : type));
	};

	const toggleItem = <T,>(arr: T[], item: T, setter: (v: T[]) => void) => {
		setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
	};

	const handleReset = () => {
		setSelectedRegions([]);
		setSelectedCategories([]);
		setSelectedTimes([]);
	};

	return (
		<div className="filter-container flex-center" ref={containerRef}>
			<div className="filter flex-left">
				{/* 초기화 버튼 */}
				<button
					type="button"
					className="filter-button button2"
					onClick={handleReset}
				>
					초기화
				</button>

				{/* 만남장소 드롭다운 */}
				<div className="dropdown-wrapper">
					<button
						className="filter-button dropdown button2"
						onClick={() => toggleDropdown('regions')}
					>
						만남장소
					</button>
					{openDropdown === 'regions' && (
						<div className="dropdown-menu">
							{Object.values(Region).map((region) => (
								<button
									key={region}
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

				{/* 시간대 드롭다운 */}
				<div className="dropdown-wrapper">
					<button
						className="filter-button dropdown button2"
						onClick={() => toggleDropdown('times')}
					>
						시간대
					</button>
					{openDropdown === 'times' && (
						<div className="dropdown-menu">
							{MEETING_TIMES.map((time) => (
								<button
									key={time}
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

				{/* 분야 드롭다운 */}
				<div className="dropdown-wrapper">
					<button
						className="filter-button dropdown button2"
						onClick={() => toggleDropdown('categories')}
					>
						분야
					</button>
					{openDropdown === 'categories' && (
						<div className="dropdown-menu">
							{Object.values(Category).map((category) => (
								<button
									key={category}
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
