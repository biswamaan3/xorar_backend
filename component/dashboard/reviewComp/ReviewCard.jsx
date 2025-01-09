"use client";
import React, { useEffect, useState } from "react";
import {TestimonialCard} from "./Testimonial";

function ReviewCard() {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const response = await fetch(`/api/product/reviews`);
				if (!response.ok) {
					throw new Error("Failed to fetch reviews");
				}
				const data = await response.json();
				setReviews(data.reviews);
			} catch (err) {
				console.error("Error fetching reviews:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchReviews();
	}, []);

	if (loading) {
		return <p>Loading reviews...</p>;
	}

	if (error) {
		return <p className='text-red-500'>Error: {error}</p>;
	}
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
