import React from "react";
import {TestimonialCard} from "./Testimonial";

function ReviewCard({reviews}) {
	return (
		<div className='flex flex-wrap gap-4 items-start'>
			{reviews?.map((review) => (
				<TestimonialCard
					name={review.user_name}
					text={review.content}
					stars={review.rating.value}
					withDate
					withMenu
					ratings={review.rating.value}
					key={review.id}
					created_at={review.createdAt}
					productName={review.product.title}
				/>
			))}
		</div>
	);
}

export default ReviewCard;
