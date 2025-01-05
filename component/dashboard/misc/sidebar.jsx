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
} from "lucide-react";
import Link from "next/link";
const SidebarItem = ({icon, label, onClick, link="/", children}) => {
	return (
		<li>
			<Link
				href={link}
				className='p-3 flex justify-between items-center cursor-pointer rounded-md hover:bg-gray-200'
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
				className='px-2 py-1 flex justify-between items-center cursor-pointer rounded-md hover:bg-gray-200'
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
		<div className='w-64 h-screen bg-[#f0f0f0] text-[#232020] fixed left-0 top-0 shadow-xl border-r-3 border-gray-300'>
			{/* Logo Section */}
			<div className='px-6 pt-6 pb-3 text-[30px] font-bold text-left'>
				<span className='text-gray-700'>Xorar</span>
			</div>

			{/* Navigation */}
			<nav className='flex-1'>
				<ul className='px-2'>
					<SidebarItem
						icon={<Home size={22} className='' />}
						label='Home'
					/>
					<SidebarItem icon={<BookA size={22} />} label='Orders' />
					<SidebarItem
						link='/dashboard/products'
						icon={<ShirtIcon size={22} />}
						label='Products'
					/>

					<Dropdown icon={<Layers2 size={22} />} label='Properties'>
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

					<Dropdown icon={<Layers2 size={22} />} label='Stats'>
						<SidebarDropDownItem
							label='Cart Items '
							link='/dashboard/stats/cart'
						/>
						<SidebarDropDownItem
							label='Wishlist Items'
							link='/dashboard/stats/wishlist'
						/>
						
					</Dropdown>

					

					{/* <SidebarItem
						icon={<Settings size={22} />}
						label='Settings'
					/>
					<SidebarItem icon={<HelpCircle size={22} />} label='Help' /> */}
				</ul>
			</nav>
		</div>
	);
};

const Dropdown = ({label, icon, children}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<div
				className='p-3 flex justify-between items-center cursor-pointer rounded-md hover:bg-gray-200'
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className='flex items-center gap-2 '>
					{icon}
					{label}
				</span>
				<ChevronDown size={16} />
			</div>
			{isOpen && <div className='ml-8 rounded-md p-2'>{children}</div>}
		</div>
	);
};

export default Sidebar;
