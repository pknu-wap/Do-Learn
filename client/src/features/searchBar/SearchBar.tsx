import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchGroups, SearchGroupResponse } from 'api/searchFilterApi';
import './SearchBar.scss';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';

const SearchBar = () => {
	const [keyword, setKeyword] = useState('');
	const [results, setResults] = useState<SearchGroupResponse | null>(null);

	const handleSearch = async () => {
		if (!keyword.trim()) {
			alert('검색어를 입력해주세요.');
			return;
		}

		try {
			const response = await searchGroups({ keyword });
			setResults(response);
			console.log(response);
		} catch (error) {
			console.error(error);
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

			{/* {results && results.groups && (
				<div className="search-results">
					{results.groups.map((group) => (
						<div key={group.id} className="search-result-item">
							{group.name}
						</div>
					))}
				</div>
			)} */}

			{results && results.message && (
				<div className="search-message">{results.message}</div>
			)}
		</div>
	);
};

export default SearchBar;
