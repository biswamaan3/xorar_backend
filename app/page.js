"use client";
import {useEffect} from "react";

export default function Home() {
	useEffect(() => {
		if (localStorage.getItem("user") == null || localStorage.getItem("user") == undefined) {
			window.location.href = "/login";
		} else {
			if (
				localStorage.getItem("token") != undefined
			) {
				window.location.href = "/dashboard";
			} else {
				window.location.href = "/login";
			}
		}
	}, []);
	return (
		<>
			<div className='flex h-full w-full items-center justify-center'>
				Checking User status
			</div>
		</>
	);
}
