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

			// if theres no queen at our tile, then set the queen
			if (!setOrDeset) {
				col = queens[row];
			}
			// if placing, set the col, if deleting set to -1
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
		// array size is how many rows there are and then the integer stored is what tile in that row is the one selected
		queens: Array(numQueens).fill(-1),

		// store what columns are attacked, so we dont have to search through the array
		takenColumns: Array(numQueens).fill(false),

		// store what diagonals are being attacked
		takenDiagonals: Array(numQueens * 2 - 1).fill(false),

		// store what anitidiagonals(other way of the last one) are being attacked
		takenAntidiagonals: Array(numQueens * 2 - 1).fill(false),
	};
	const [state, dispatch] = useReducer(reducer, initialState);

	// call countQueens after state changes
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
		// calculate what diagonal the tile belongs to
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

	// count how many queens are placed and compare it to our board size
	const countQueens = () => {
		let count = 0;
		state.queens.forEach((element) => {
			element != -1 && count++;
		});
		// open congrats popup if we've won
		count == numQueens && setIsOpen(true);
		return count;
	};

	const onClick = (row, col) => {
		// check if our tile is valid or a queen
		// if its a queen we dispatch and it will unset the queen
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
					<div className="bg-gray-500 p-6 rounded-lg text-black">
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
								{state.queens[rowIndex] !== colIndex ? (
									<span>{colIndex + rowIndex * numQueens}</span>
								) : (
									state.queens[rowIndex] === colIndex && (
										<div className="queen"></div>
									)
								)}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
