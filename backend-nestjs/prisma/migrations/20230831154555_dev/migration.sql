-- CreateTable
CREATE TABLE "annotation" (
    "id" BIGSERIAL NOT NULL,
    "highlight_mark_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "version_id" BIGINT NOT NULL,
    "position_y" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "annotation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "annotation" ADD CONSTRAINT "annotation_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
