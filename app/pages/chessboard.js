import { useReducer, useState, useEffect } from "react";

function reducer(state, action) {
	// Destructure arrays from state
	const { queens, takenColumns, takenDiagonals, takenAntidiagonals } = state;

	switch (action.type) {
		case "MOVE_QUEEN":
			// Make copies of arrays
			const newQueens = [...queens];
			const newTakenColumns = [...takenColumns];
			const newTakenDiagonals = [...takenDiagonals];
			const newTakenAntidiagonals = [...takenAntidiagonals];
			let { row, col, numQueens } = action;

			// check if were placing or deleting
			const setOrDeset = queens[row] == -1;
			if (!setOrDeset) {
				col = queens[row];
			}
			// if placing set the col, if deleting set -1
			newQueens[row] = setOrDeset ? col : -1;

			// Update taken arrays
			newTakenColumns[col] = setOrDeset;
			newTakenDiagonals[numQueens - 1 - row + col] = setOrDeset;
			newTakenAntidiagonals[row + col] = setOrDeset;

			return {
				...state,
				queens: newQueens,
				takenColumns: newTakenColumns,
				takenDiagonals: newTakenDiagonals,
				takenAntidiagonals: newTakenAntidiagonals,
				// Other updated arrays
			};

		default:
			return state;
	}
}

export function Chessboard({ numQueens = 8 }) {
	const squareSize = 100 / numQueens;
	const [isOpen, setIsOpen] = useState(false);
	const initialState = {
		queens: Array(numQueens).fill(-1),
		takenColumns: Array(numQueens).fill(false),
		takenDiagonals: Array(numQueens * 2 - 1).fill(false),
		takenAntidiagonals: Array(numQueens * 2 - 1).fill(false),
	};
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		countQueens();
	}, [state]);

	const isQueen = (row, col) => {
		return state.queens[row] == col ? true : false;
	};
	const isTileAttacked = (row, col) => {
		// Check for attacks in verticals
		if (state.takenColumns[col]) {
			return true;
		}

		// Check for attacks in horizontals
		if (state.queens[row] !== -1) {
			return true;
		}

		// Check for attacks in diagonals
		const diagonalDiff = numQueens - 1 - row + col;
		const antidiagonalSum = row + col;

		if (state.takenDiagonals[diagonalDiff]) {
			return true;
		}

		if (state.takenAntidiagonals[antidiagonalSum]) {
			return true;
		}

		return false;
	};
	const countQueens = () => {
		let count = 0;
		state.queens.forEach((element) => {
			element != -1 && count++;
		});
		count == numQueens && setIsOpen(true);
		return count;
	};

	const onClick = (row, col) => {
		if (!isTileAttacked(row, col) || isQueen(row, col)) {
			dispatch({
				type: "MOVE_QUEEN",
				row: row,
				col: col,
				numQueens: numQueens,
			});
		}
	};

	return (
		<div className="w-full max-w-full flex flex-col mx-auto border-black ">
			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-auto">
					<div className="bg-white p-6 rounded-lg text-black">
						<h2 className="text-lg font-medium">Congratulations!</h2>

						<p className="mt-4">You found a solution! Well done.</p>

						<button
							className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							onClick={() => setIsOpen(false)}
						>
							Close
						</button>
					</div>
				</div>
			)}

			{[...Array(numQueens)].map((_, rowIndex) => (
				<div className="flex " key={rowIndex}>
					{[...Array(numQueens)].map((_, colIndex) => {
						return (
							<div
								className={`tile text-red-600 aspect-square hover:bg-sky-700 ${
									rowIndex % 2 === colIndex % 2 ? "bg-black" : "bg-white"
								}${isTileAttacked(rowIndex, colIndex) ? "-attacked" : ""} 
                         
                               `}
								key={colIndex}
								onClick={() => onClick(rowIndex, colIndex)}
								id={`${rowIndex * numQueens + colIndex}`}
								style={{
									width: `${squareSize}vw`,
								}}
							>
								<span className="absolute z-20">
									{colIndex + rowIndex * numQueens}
								</span>
								{state.queens[rowIndex] === colIndex && (
									<div className="queen"></div>
								)}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
