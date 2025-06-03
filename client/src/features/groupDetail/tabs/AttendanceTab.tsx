// features/groupDetail/tabs/AttendanceTab.tsx
import React, { useEffect, useState } from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './AttendanceTab.scss';
import { fetchAttendanceCalendar, markAttendance, AttendanceRecord } from 'api/attendanceApi';

interface AttendanceTabProps {
	studyGroupId: number;
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AttendanceTab: React.FC<AttendanceTabProps> = ({ studyGroupId }) => {
	const [today] = useState(new Date());
	const [displayDate, setDisplayDate] = useState<Date>(new Date());
	const [attendanceDates, setAttendanceDates] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(false);

	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth() + 1;
	const todayDay = today.getDate();
	const todayStr = `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;

	const displayYear = displayDate.getFullYear();
	const displayMonth = displayDate.getMonth() + 1;

	const isCurrentMonthView = todayYear === displayYear && todayMonth === displayMonth;

	const handlePrev = () => setDisplayDate(new Date(displayYear, displayDate.getMonth() - 1, 1));
	const handleNext = () => setDisplayDate(new Date(displayYear, displayDate.getMonth() + 1, 1));
	const handleToday = () => setDisplayDate(new Date());

	// 출석 현황 조회
	useEffect(() => {
		fetchAttendanceCalendar(studyGroupId, displayYear, displayMonth)
			.then((res) => {
				setAttendanceDates(new Set(res.data.map((r: AttendanceRecord) => r.date)));
			})
			.catch(() => {
				setAttendanceDates(new Set());
			});
	}, [studyGroupId, displayYear, displayMonth]);

	// 출석 체크
	const handleCheck = () => {
		setLoading(true);
		markAttendance(studyGroupId)
			.then(() => {
				setAttendanceDates((prev) => new Set(prev).add(todayStr));
			})
			.catch(() => {
				alert('출석에 실패했습니다.');
			})
			.finally(() => setLoading(false));
	};

	// 달력 셀 구성
	const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();
	const firstWeekday = new Date(displayYear, displayMonth - 1, 1).getDay();
	const blanks = firstWeekday === 0 ? 6 : firstWeekday - 1;
	const totalCells = blanks + daysInMonth;
	const cells = Array.from({ length: totalCells }, (_, idx) => {
		if (idx < blanks) return { day: null };
		const d = idx - blanks + 1;
		const date = `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
		return { day: d, date };
	});

	// 버튼 비활성 조건
	const disableCheckButton = loading || attendanceDates.has(todayStr);

	return (
		<div className="attendance-container flex-col-center">
			{/* 연월 네비게이션 */}
			<div className="calendar-nav flex-between">
				<button className="button2 calendar-prev" onClick={handlePrev}>
					이전
				</button>
				<span className="body2">
					{displayYear}년 {displayMonth}월
				</span>
				<button className="button2 calendar-next" onClick={handleNext}>
					다음
				</button>
			</div>

			{/* 요일 헤더 */}
			<div className="calendar">
				{WEEK_DAYS.map((w) => (
					<div key={w} className="calendar-header">
						{w}
					</div>
				))}

				{/* 날짜 셀 */}
				{cells.map((cell, idx) => (
					<div
						key={idx}
						className={[
							'calendar-cell',
							!cell.day && 'blank',
							cell.day && attendanceDates.has(cell.date!) && 'present',
							cell.day === todayDay && isCurrentMonthView && 'today',
						]
							.filter(Boolean)
							.join(' ')}
					>
						{cell.day && <span>{cell.day}</span>}
					</div>
				))}
			</div>

			{/* 하단 버튼: 현재 월이면 출석 체크, 아니면 오늘로 돌아가기 */}
			{isCurrentMonthView ? (
				<button className="attendance-button body2" onClick={handleCheck} disabled={disableCheckButton}>
					출석하기
				</button>
			) : (
				<button className="attendance-button body2" onClick={handleToday}>
					오늘 날짜로 돌아가기
				</button>
			)}
		</div>
	);
};

export default AttendanceTab;
