-- CreateTable
CREATE TABLE "version" (
    "id" BIGSERIAL NOT NULL,
    "reviewer_user_id" BIGINT NOT NULL DEFAULT 123,
    "blog_id" BIGINT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "version_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "version" ADD CONSTRAINT "version_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
