import Sidebar from "@/component/dashboard/misc/sidebar";
import React from "react";

const RootLayout = ({children}) => {
	return (
		<div className='flex'>
			<Sidebar />
			<main className='flex-1 ml-64 p-8 overflow-y-auto min-h-screen bg-white/20'>
				{children}
			</main>
		</div>
	);
};

export default RootLayout;
