"use client";
import React, {useEffect} from "react";

function page() {
	useEffect(() => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		setTimeout(() => {
            window.location.href = "/login";
        }, 2000);

	}, []);
	return <div>Logging out...</div>;
}

export default page;
