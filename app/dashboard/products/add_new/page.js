import AddNew from "@/component/dashboard/project/AddNew";
import {PageHeader} from "@/component/text";
import React from "react";

function page() {
	return (
		<div>
			<PageHeader title={"Add New Product"} />

			<AddNew />
		</div>
	);
}

export default page;
