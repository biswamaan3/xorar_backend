import OrderPage from "@/component/dashboard/project/OrderPage";
import {PageHeader} from "@/component/text";
import React from "react";

function page() {
	return (
		<div>
			<PageHeader
				title={"All Orders"}
				description={
					<p className='font-bold text-lg'>
						find recentely ordered products.
					</p>
				}
			/>
			<OrderPage/>


		</div>
	);
}

export default page;
