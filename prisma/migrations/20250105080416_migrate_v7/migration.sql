-- CreateTable
CREATE TABLE "AddedToCart" (
    "id" SERIAL NOT NULL,
    "user_string" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateRemoved" TIMESTAMP(3),

    CONSTRAINT "AddedToCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddedToWishlist" (
    "id" SERIAL NOT NULL,
    "user_string" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateRemoved" TIMESTAMP(3),

    CONSTRAINT "AddedToWishlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AddedToCart" ADD CONSTRAINT "AddedToCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedToWishlist" ADD CONSTRAINT "AddedToWishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
