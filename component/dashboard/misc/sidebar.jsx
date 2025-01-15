"use client";
import React, {useState} from "react";
import {
	Home,
	Settings,
	Users,
	HelpCircle,
	ChevronDown,
	BookA,
	ShirtIcon,
	Layers2,
	Star,
	ChartColumnStacked,
} from "lucide-react";
import Link from "next/link";
const SidebarItem = ({icon, label, onClick, link = "/", children}) => {
	return (
		<li>
			<Link
				href={link}
				className='flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 no-theme:text-white no-theme:hover:bg-gray-700'
				onClick={onClick}
			>
				<div className='flex items-center space-x-2'>
					{icon}
					<span>{label}</span>
				</div>
				{children}
			</Link>
		</li>
	);
};

const SidebarDropDownItem = ({icon, label, onClick, link, children}) => {
	return (
		<li>
			<Link
				href={link}
				className='flex items-center p-2  w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100'
				onClick={onClick}
			>
				<div className='flex items-center space-x-2'>
					{icon}
					<span>{label}</span>
				</div>
				{children}
			</Link>
		</li>
	);
};

const Sidebar = () => {
	return (
		<div
			id='default-sidebar'
			className='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0'
			aria-label='Sidenav'
		>
			<div className='overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 no-theme:bg-gray-800 no-theme:border-gray-700'>
				{/* Logo Section */}
				<div className='px-6 pt-6 pb-3 text-[30px] font-bold text-left'>
					<span className='text-gray-700'>Xorar</span>
				</div>

				{/* Navigation */}
				<nav className='flex-1'>
					<ul className='px-2'>
					
						<SidebarItem
							icon={<BookA size={22} />}
							link='/dashboard'
							label='Orders'
						/>
						<SidebarItem
							link='/dashboard/products'
							icon={<ShirtIcon size={22} />}
							label='Products'
						/>

						<Dropdown
							icon={<Layers2 size={22} />}
							label='Properties'
						>
							<SidebarDropDownItem
								label='Category'
								link='/dashboard/properties/Category'
							/>
							<SidebarDropDownItem
								label='Style'
								link='/dashboard/properties/Style'
							/>
							<SidebarDropDownItem
								label='Colors'
								link='/dashboard/properties/Color'
							/>
							<SidebarDropDownItem
								label='Size'
								link='/dashboard/properties/size'
							/>
						</Dropdown>

						<Dropdown icon={<ChartColumnStacked size={22} />} label='Stats'>
							<SidebarDropDownItem
								label='Cart Items '
								link='/dashboard/stats/cart'
							/>
							<SidebarDropDownItem
								label='Wishlist Items'
								link='/dashboard/stats/wishlist'
							/>
						</Dropdown>

						<SidebarItem
							icon={<Star size={22} className='' />}
							label='Reviews'
							link="/dashboard/reviews"
						/>
						 <SidebarItem
						icon={<Settings size={22} />}
						label='Logout'
						link="/logout"
					/>
				{/*	<SidebarItem icon={<HelpCircle size={22} />} label='Help' /> */}
					</ul>
				</nav>
			</div>
		</div>
	);
};

const Dropdown = ({label, icon, children}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<div
				className='flex justify-between items-center cursor-pointer hover:bg-gray-100    '
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className='flex items-center gap-2  p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group '>
					{icon}
					{label}
				</span>
				<ChevronDown size={16} />
			</div>
			{isOpen && <div className='ml-8 rounded-md p-2 '>{children}</div>}
		</div>
	);
};

export default Sidebar;
