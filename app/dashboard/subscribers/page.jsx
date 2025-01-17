import EmailTable from "@/component/dashboard/email/EmailTable";
import {PageHeader} from "@/component/text";
import React from "react";

function page() {
	return (
		<div>
			<PageHeader title={"Email Subscribers"} />
			<EmailTable/>
		</div>
	);
}

export default page;
