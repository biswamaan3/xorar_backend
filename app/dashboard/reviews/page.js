import ReviewCard from "@/component/dashboard/reviewComp/ReviewCard";
import {PageHeader} from "@/component/text";
import {Button} from "@nextui-org/react";
import {PlusIcon} from "lucide-react";
import Link from "next/link";
import React from "react";

async function page() {

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

			<ReviewCard  />
		</div>
	);
}

export default page;
