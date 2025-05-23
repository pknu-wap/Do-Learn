// src/features/filter/filter.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Region, Category } from 'api/createGroupFormApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './filter.scss';

type DropdownType = 'regions' | 'categories' | 'times' | 'days' | null;
const MEETING_TIMES = ['오전', '오후', '저녁', '새벽'] as const;
const CYCLE_OPTIONS = ['월', '주'] as const;

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
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [menuPos, setMenuPos] = useState<{
		top: number;
		left: number;
		width: number;
	} | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	// 외부 클릭 시: container 나 portal 메뉴 안이 아니면 닫기
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			const t = e.target as Node;
			if (containerRef.current?.contains(t)) return;
			if (menuRef.current?.contains(t)) return;
			setOpenDropdown(null);
			setAnchorEl(null);
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, []);

	// 메뉴 위치 계산
	const updateMenuPos = useCallback(() => {
		if (!anchorEl) {
			setMenuPos(null);
			return;
		}
		const rect = anchorEl.getBoundingClientRect();
		setMenuPos({
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX,
			width: rect.width,
		});
	}, [anchorEl]);

	// anchorEl 변화 / 스크롤 / 리사이즈 시 위치 갱신
	useEffect(() => {
		updateMenuPos();
	}, [anchorEl, updateMenuPos]);
	useEffect(() => {
		if (!anchorEl) return;
		window.addEventListener('scroll', updateMenuPos, true);
		window.addEventListener('resize', updateMenuPos);
		return () => {
			window.removeEventListener('scroll', updateMenuPos, true);
			window.removeEventListener('resize', updateMenuPos);
		};
	}, [anchorEl, updateMenuPos]);

	const toggleItem = useCallback(
		<T,>(arr: T[], item: T, setter: (v: T[]) => void) => {
			setter(
				arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item],
			);
		},
		[],
	);

	const handleReset = () => {
		setSelectedRegions([]);
		setSelectedCategories([]);
		setSelectedTimes([]);
		setSelectedMeetingCycle(null);
		setSelectedMeetingCount(null);
		setMeetingComparison('above');
		setOpenDropdown(null);
		setAnchorEl(null);
	};

	const handleButtonClick =
		(type: DropdownType) => (e: React.MouseEvent<HTMLButtonElement>) => {
			if (openDropdown === type) {
				setOpenDropdown(null);
				setAnchorEl(null);
			} else {
				setOpenDropdown(type);
				setAnchorEl(e.currentTarget);
			}
		};

	const renderMenu = useCallback(() => {
		if (!openDropdown || !menuPos) return null;
		let items: React.ReactNode = null;

		switch (openDropdown) {
			case 'regions':
				items = Object.values(Region).map((r) => (
					<button
						key={r}
						className={`dropdown-item button2 ${selectedRegions.includes(r) ? 'selected' : ''}`}
						onClick={() => toggleItem(selectedRegions, r, setSelectedRegions)}
					>
						{r}
					</button>
				));
				break;
			case 'categories':
				items = Object.values(Category).map((c) => (
					<button
						key={c}
						className={`dropdown-item button2 ${selectedCategories.includes(c) ? 'selected' : ''}`}
						onClick={() =>
							toggleItem(selectedCategories, c, setSelectedCategories)
						}
					>
						{c}
					</button>
				));
				break;
			case 'times':
				items = MEETING_TIMES.map((t) => (
					<button
						key={t}
						className={`dropdown-item button2 ${selectedTimes.includes(t) ? 'selected' : ''}`}
						onClick={() => toggleItem(selectedTimes, t, setSelectedTimes)}
					>
						{t}
					</button>
				));
				break;
			case 'days':
				items = (
					<>
						<div className="cycle-selector flex-center">
							{CYCLE_OPTIONS.map((cycle) => (
								<button
									key={cycle}
									className={`dropdown-item button2 ${selectedMeetingCycle === cycle ? 'selected' : ''}`}
									onClick={() => setSelectedMeetingCycle(cycle)}
								>
									{cycle}
								</button>
							))}
						</div>
						<div className="count-container">
							<div className="count-input-wrapper">
								<input
									type="number"
									min={1}
									value={selectedMeetingCount ?? ''}
									onChange={(e) =>
										setSelectedMeetingCount(
											e.target.value ? +e.target.value : null,
										)
									}
									className="button2 count-input"
								/>
								<span className="button2">회</span>
							</div>
							<div className="comparison-selector">
								<button
									className={`dropdown-item button2 ${meetingComparison === 'above' ? 'selected' : ''}`}
									onClick={() => setMeetingComparison('above')}
								>
									이상
								</button>
								<button
									className={`dropdown-item button2 ${meetingComparison === 'below' ? 'selected' : ''}`}
									onClick={() => setMeetingComparison('below')}
								>
									이하
								</button>
							</div>
						</div>
					</>
				);
				break;
		}

		return ReactDOM.createPortal(
			<div
				ref={menuRef}
				className={`dropdown-menu ${openDropdown === 'days' ? 'days-menu' : ''}`}
				style={{
					position: 'absolute',
					top: menuPos.top,
					left: menuPos.left,
					width: menuPos.width,
					zIndex: 10000,
				}}
			>
				{items}
			</div>,
			document.body,
		);
	}, [
		openDropdown,
		menuPos,
		selectedRegions,
		selectedCategories,
		selectedTimes,
		selectedMeetingCycle,
		selectedMeetingCount,
		meetingComparison,
		toggleItem,
		setSelectedRegions,
		setSelectedCategories,
		setSelectedTimes,
		setSelectedMeetingCycle,
		setSelectedMeetingCount,
		setMeetingComparison,
	]);

	return (
		<>
			<div className="filter-container flex-center" ref={containerRef}>
				<div className="filter flex-left">
					<button className="filter-button button2" onClick={handleReset}>
						초기화
					</button>
					<div className="dropdown-wrapper">
						<button
							className="filter-button dropdown button2"
							onClick={handleButtonClick('regions')}
						>
							만남장소
						</button>
					</div>
					<div className="dropdown-wrapper">
						<button
							className="filter-button dropdown button2"
							onClick={handleButtonClick('days')}
						>
							만남횟수
						</button>
					</div>
					<div className="flex-center dropdown-wrapper">
						<button
							className="filter-button dropdown button2"
							onClick={handleButtonClick('times')}
						>
							시간대
						</button>
					</div>
					<div className="dropdown-wrapper">
						<button
							className="filter-button dropdown button2"
							onClick={handleButtonClick('categories')}
						>
							분야
						</button>
					</div>
				</div>
			</div>
			{renderMenu()}
		</>
	);
};

export default Filter;
