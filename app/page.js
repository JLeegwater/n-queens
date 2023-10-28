"use client";
import { Inter } from "next/font/google";
import { Chessboard } from "./pages/chessboard";
import React, { useState } from "react";
import BoardSettings from "./pages/BoardSettings";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [numQueens, setNumQueens] = useState(8);

	const handleSettingsChange = (newQueens) => {
		setNumQueens(newQueens);
	};
	return (
		<main
			className={`min-h-screen items-center justify-between  ${inter.className}`}
		>
			<div className="board flex flex-col w-screen flex-wrap h-screen	 items-center justify-center ">
				<BoardSettings onSettingsChange={handleSettingsChange} />
				<Chessboard className="" key={numQueens} numQueens={numQueens} />
			</div>
		</main>
	);
}
