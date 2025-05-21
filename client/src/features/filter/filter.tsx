import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import React from 'react';
import './filter.scss';

const Filter: React.FC = () => {
	return (
		<div className="filter-container flex-center">
			<div className="filter flex-left">
				<button type="button" className="filter-button dropdown button2">
					만남장소
				</button>
				<button type="button" className="filter-button dropdown button2">
					만남횟수
				</button>
				<button type="button" className="filter-button dropdown button2">
					시간대
				</button>
				<button type="button" className="filter-button dropdown button2">
					분야
				</button>
			</div>
		</div>
	);
};

export default Filter;
