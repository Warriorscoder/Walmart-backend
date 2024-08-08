-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('BUY', 'SALE');

-- CreateTable
CREATE TABLE "customers" (
    "customerId" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "CompetitorPrice" (
    "competitorPriceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "freight" DOUBLE PRECISION NOT NULL,
    "customerRating" DOUBLE PRECISION,

    CONSTRAINT "CompetitorPrice_pkey" PRIMARY KEY ("competitorPriceId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "offerPrice" DOUBLE PRECISION NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "batchId" TEXT NOT NULL,
    "manufactureDate" TIMESTAMP(3) NOT NULL,
    "categoryName" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "customerRating" DOUBLE PRECISION,
    "offerPercentage" DOUBLE PRECISION DEFAULT 0,
    "quantity" DOUBLE PRECISION NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "saleId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "cumulativeDiscount" DOUBLE PRECISION NOT NULL,
    "freightPrice" DOUBLE PRECISION NOT NULL,
    "storeId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "paymentType" TEXT NOT NULL,
    "saleType" "SaleType" NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("saleId")
);

-- CreateTable
CREATE TABLE "SalesDetail" (
    "salesDetailId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "quantitySold" INTEGER NOT NULL,

    CONSTRAINT "SalesDetail_pkey" PRIMARY KEY ("salesDetailId")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitorPrice_companyName_key" ON "CompetitorPrice"("companyName");

-- CreateIndex
CREATE INDEX "idx_product_category" ON "Product"("categoryName");

-- CreateIndex
CREATE INDEX "idx_sale_date" ON "sales"("saleDate");

-- AddForeignKey
ALTER TABLE "CompetitorPrice" ADD CONSTRAINT "CompetitorPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDetail" ADD CONSTRAINT "SalesDetail_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDetail" ADD CONSTRAINT "SalesDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
