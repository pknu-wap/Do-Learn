import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchGroups, SearchGroupResponse } from 'api/searchFilterApi';
import './SearchBar.scss';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';

interface SearchBarProps {
	onSearchResult: (results: SearchGroupResponse | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResult }) => {
	const [keyword, setKeyword] = useState('');
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		debounceTimer.current = setTimeout(() => {
			if (!keyword.trim()) {
				onSearchResult(null);
				return;
			}

			searchGroups({ keyword })
				.then((response) => onSearchResult(response))
				.catch((error) => {
					console.error('검색 중 오류 발생:', error);
					onSearchResult(null);
				});
		}, 10);

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, [keyword]);

	// ⌨️ 엔터 키 검색
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (!keyword.trim()) {
				onSearchResult(null);
				return;
			}

			searchGroups({ keyword })
				.then((response) => onSearchResult(response))
				.catch((error) => {
					console.error('검색 중 오류 발생:', error);
					onSearchResult(null);
				});
		}
	};

	return (
		<div className="searchbar">
			<div className="searchbar-wrapper flex-row-center">
				<div className="searchbar-container flex-row-center">
					<Search className="searchbar-icon flex-row-center" />
					<input
						type="text"
						placeholder="검색"
						className="searchbar-input flex-row-center body3"
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
