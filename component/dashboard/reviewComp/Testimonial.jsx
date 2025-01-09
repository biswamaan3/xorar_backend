import {CircleX, Delete, Edit} from "lucide-react";

const formatDate = (isoDate) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const StarRating = ({ratings}) => {
	const fullStars = Math.floor(ratings);
	const halfStars = ratings % 1 >= 0.5 ? 1 : 0;
	const emptyStars = 5 - fullStars - halfStars;

	return (
		<div className='flex items-start space-x-1.5 z-10'>
			{Array.from({length: fullStars}).map((_, index) => (
				<img
					key={`full-${index}`}
					src='/assets/svg/Star_full.svg'
					alt='star'
					className='w-5 h-5'
				/>
			))}

			{halfStars === 1 && (
				<img
					src='/assets/svg/Star_half.svg'
					alt='half star'
					className='w-5 h-5'
				/>
			)}

			{/* Empty stars */}
			{Array.from({length: emptyStars}).map((_, index) => (
				<span key={`empty-${index}`} className='w-5 h-5  ' />
			))}
		</div>
	);
};

export const TestimonialCard = ({
	name,
	className = "",
	text,
	stars,
	withDate,
	withMenu,
	ratings,
	...props
}) => (
	<div
		className={`flex flex-col min-w-[350px] min-h-[240px] p-[28px] rounded-[20px] border border-[rgba(0,0,0,0.1)] transition-all duration-300 ${className}`}
		{...props}
	>
		<div className='flex items-start cursor-pointer justify-between'>
			<div className='flex items-start mb-[15px]'>
				<StarRating ratings={ratings} />
			</div>
			<div className="flex items-center space-x-2">
				<Edit className="text-blue-500" />
				<CircleX className="text-red-500"  />
			</div>
		</div>

		<div className='flex items-center mb-[12px]'>
			<span className='font-bold text-[20px] text-[#000]'>{name}</span>
		</div>
		<p className='text-[16px] text-[rgba(0,0,0,0.6)]'>{text}</p>
		{withDate && (
			<span
				className=" font-['Satoshi'] text-[16px] font-semibold  text-[rgba(0,0,0,0.6)] relative text-left
        mt-5
        z-[15]"
			>
				Posted on {formatDate(props?.created_at)}
			</span>
		)}
		<span> {props?.productName} </span>
	</div>
);
