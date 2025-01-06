-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderID" TEXT;

-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "colorId" INTEGER,
ADD COLUMN     "designId" INTEGER,
ADD COLUMN     "sizeId" INTEGER;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
