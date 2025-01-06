import CartPage from "@/component/dashboard/project/CartPage";
import WishListPage from "@/component/dashboard/project/WishListPage";
import {PageHeader} from "@/component/text";
import React from "react";

function page() {
	return (
		<div>
			<PageHeader
				title={"Cart"}
				description={"No. of users added products in their cart."}
			/>

			<WishListPage/>
		</div>
	);
}

export default page;
