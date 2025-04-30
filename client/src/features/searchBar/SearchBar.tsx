const SearchBar = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				margin: '40px 0',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					border: '2px solid #87cd37',
					borderRadius: '50px',
					padding: '12px 20px',
					width: '80%',
					maxWidth: '400px',
					backgroundColor: 'white',
				}}
			>
				<img
					src="/assets/search-icon.png"
					alt="search icon"
					style={{
						width: '18px',
						height: '18px',
						marginRight: '10px',
						cursor: 'pointer',
					}}
				/>
				<input
					type="text"
					placeholder="검색"
					style={{
						border: 'none',
						outline: 'none',
						flex: 1,
						fontSize: '16px',
						color: '#444',
						backgroundColor: 'transparent',
					}}
				/>
			</div>
		</div>
	);
};

export default SearchBar;
