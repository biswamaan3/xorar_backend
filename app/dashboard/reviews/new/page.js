import SubmitReview from "@/component/dashboard/reviewComp/AddReviews";
import ReviewCard from "@/component/dashboard/reviewComp/ReviewCard";
import {PageHeader} from "@/component/text";
import {Button} from "@nextui-org/react";
import {ArrowBigLeft, PlusIcon} from "lucide-react";
import Link from "next/link";
import React from "react";

function page() {
	return (
		<div>
			<PageHeader title={"Add Review"} />

			<SubmitReview />
		</div>
	);
}

export default page;
