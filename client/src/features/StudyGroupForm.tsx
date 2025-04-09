import { useState } from 'react';

const StudyGroupForm = () => {
	const [groupName, setGroupName] = useState('');
	const [meetingType, setMeetingType] = useState<'대면' | '비대면' | ''>('');
	const [meetingTime, setMeetingTime] = useState('');
	const [meetingCycle, setMeetingCycle] = useState<'월' | '주'>('월');
	const [meetingDay, setMeetingDay] = useState('');
	const [memberCount, setMemberCount] = useState('');
	const [notice, setNotice] = useState('');

	const handleCheckDuplicate = () => {
		alert(`'${groupName}' 그룹 이름 중복 체크`);
	};

	return (
		<div className="space-y-4">
			{/* 그룹 이름 */}
			<div className="flex items-center gap-2">
				<input
					type="text"
					placeholder="스터디 그룹명 입력"
					value={groupName}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setGroupName(e.target.value)
					}
					className="border p-2 rounded w-full"
				/>
				{/* <button
					onClick={handleCheckDuplicate}
					className="border px-3 py-2 rounded bg-green-100 hover:bg-green-200"
				>
					중복확인
				</button> */}
			</div>

			{/* 만남 주기 */}
			<div className="flex items-center gap-2">
				<select
					value={meetingCycle}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
						setMeetingCycle(e.target.value as '월' | '주')
					}
					className="border p-2 rounded"
				>
					<option value="월">월</option>
					<option value="주">주</option>
				</select>
				<input
					type="number"
					placeholder="숫자 입력"
					value={meetingDay}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setMeetingDay(e.target.value)
					}
					className="border p-2 rounded w-20"
				/>
				<span>일</span>
			</div>

			{/* 대면/비대면 */}
			<div className="flex gap-2">
				<button
					onClick={() => setMeetingType('대면')}
					className={`border px-3 py-2 rounded ${meetingType === '대면' ? 'bg-green-300' : ''}`}
				>
					대면
				</button>
				<button
					onClick={() => setMeetingType('비대면')}
					className={`border px-3 py-2 rounded ${meetingType === '비대면' ? 'bg-green-300' : ''}`}
				>
					비대면
				</button>
			</div>

			{/* 시간대 선택 */}
			<div className="grid grid-cols-2 gap-2 border rounded-lg p-4">
				{['오전', '오후', '저녁', '새벽'].map((time) => (
					<button
						key={time}
						onClick={() => setMeetingTime(time)}
						className={`border p-2 rounded ${meetingTime === time ? 'bg-green-300' : ''}`}
					>
						{time}
					</button>
				))}
			</div>

			{/* 모집 정원 */}
			<div>
				<select
					value={memberCount}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
						setMemberCount(e.target.value)
					}
					className="border p-2 rounded w-full"
				>
					<option value="">모집 정원 선택</option>
					{[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
						<option key={num} value={num}>
							{num}명
						</option>
					))}
				</select>
			</div>

			{/* 공지사항 */}
			<div>
				<input
					type="text"
					placeholder="공지사항 입력"
					value={notice}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setNotice(e.target.value)
					}
					className="border p-2 rounded w-full"
				/>
			</div>

			{/* 생성 버튼 */}
			<button className="w-full p-3 rounded bg-green-500 text-white hover:bg-green-600">
				생성하기
			</button>
		</div>
	);
};

export default StudyGroupForm;
