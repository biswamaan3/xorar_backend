"use client";
import React from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Pagination,
} from "@nextui-org/react";
import { DeleteIcon } from "lucide-react";

const TableWithPagination = ({
	data,
	totalCount,
	totalPages,
	currentPage,
	itemsPerPage,
	onDelete,
	onPageChange,
}) => {
    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        
        if (!isConfirmed) {
          return; 
        }
      
        try {
          await onDelete(id); // Call the delete function passed as prop
          alert("Item deleted successfully");
        } catch (error) {
          console.error(error);
          alert("Failed to delete item");
        }
      };
      

	const handlePageChange = (page) => {
		// Instead of using router.push, we use the onPageChange function
		onPageChange(page);
	};

	return (
		<div>
			<Table aria-label='Cart or Wishlist Items'>
				<TableHeader>
					<TableColumn>User ID</TableColumn>
					<TableColumn>Product Name</TableColumn>
					<TableColumn>Quantity</TableColumn>
					<TableColumn>User Country</TableColumn>
					<TableColumn>User City</TableColumn>
					<TableColumn>Actions</TableColumn>
				</TableHeader>
				<TableBody>
					{data.map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.user_string}</TableCell>
							<TableCell>{item.productName}</TableCell>
							<TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.country}</TableCell>
							<TableCell>{item.city}</TableCell>

							<TableCell>
								<Button
									color='error'
									onPress={() => handleDelete(item.id)}
								>
									<DeleteIcon/>
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Pagination component */}
            <div className="flex mt-10 justify-center">
            <Pagination
				total={totalPages}
				initialPage={currentPage}
				onChange={handlePageChange}
				aria-label='Pagination'
			/>
            </div>
			
		</div>
	);
};

export default TableWithPagination;
