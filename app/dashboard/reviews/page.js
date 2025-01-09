import ReviewCard from "@/component/dashboard/reviewComp/ReviewCard";
import {PageHeader} from "@/component/text";
import {Button} from "@nextui-org/react";
import {PlusIcon} from "lucide-react";
import Link from "next/link";
import React from "react";

async function page() {
	const data = await fetch(process.env.BACKEND_URL + "/api/product/reviews");
	const reviews = await data.json();
	return (
		<div>
			<PageHeader
				title='Reviews'
				description={
					<Button
						variant='solid'
						color='secondary'
						as={Link}
						href={"/dashboard/reviews/new"}
					>
						<PlusIcon size={22} />
						Add Review
					</Button>
				}
			/>
            
            <ReviewCard reviews={reviews.reviews} />
		</div>
	);
}

export default page;
