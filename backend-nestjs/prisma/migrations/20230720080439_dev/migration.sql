-- CreateTable
CREATE TABLE "blog" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "author_id" BIGINT,
    "image" TEXT,
    "meta_description" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optionalFields" (
    "id" BIGSERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "optionalId" BIGINT NOT NULL,

    CONSTRAINT "optionalFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optional" (
    "id" BIGSERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "optional_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "optionalFields" ADD CONSTRAINT "optionalFields_optionalId_fkey" FOREIGN KEY ("optionalId") REFERENCES "optional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
