-- AlterTable
ALTER TABLE "public"."customers" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "public"."items" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "public"."sales" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "public"."shop_profile" (
    "id" SERIAL NOT NULL,
    "shopName" TEXT NOT NULL DEFAULT 'My Jewelry Shop',
    "address" TEXT,
    "phone" TEXT,
    "gstin" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "shop_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_profile_userId_key" ON "public"."shop_profile"("userId");

-- AddForeignKey
ALTER TABLE "public"."customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shop_profile" ADD CONSTRAINT "shop_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
