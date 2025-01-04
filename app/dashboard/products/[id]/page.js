import EditProduct from "@/component/dashboard/project/EditForm";
import {PageHeader} from "@/component/text";
import React from "react";

async function page({params}) {
	const id = (await params).id;

	return (
		<div>
			<PageHeader title={"Edit Product"} />
			<div>{id ? <EditProduct id={id} /> : "Loading..."}</div>
		</div>
	);
}

export default page;
