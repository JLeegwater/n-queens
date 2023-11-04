import { useState } from "react";

const BoardSettings = ({ onSettingsChange }) => {
	const [queens, setQueens] = useState(8);

	const handleQueensChange = (e) => {
		const newQueens = parseInt(e.target.value, 10);
		setQueens(newQueens);
		onSettingsChange(newQueens);
	};

	return (
		<div className="p-4 bg-black">
			<label htmlFor="queens" className="font-bold">
				Number of Queens:
			</label>
			<input
				type="range"
				id="queens"
				className="block w-full mt-2 border-black text-black p-0"
				min={4}
				max={16}
				value={queens}
				onChange={handleQueensChange}
			/>
			<p className="text-white text-center">{queens}</p>
		</div>
	);
};

export default BoardSettings;
