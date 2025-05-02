import { useState } from 'react';
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

	const handleSearch = async () => {
		if (!keyword.trim()) {
			onSearchResult(null);
			return;
		}

		try {
			const response = await searchGroups({ keyword });
			onSearchResult(response); // 부모(MainPage)로 결과 전달
		} catch (error) {
			console.error('검색 중 오류 발생:', error);
			onSearchResult(null);
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
						onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					/>
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
