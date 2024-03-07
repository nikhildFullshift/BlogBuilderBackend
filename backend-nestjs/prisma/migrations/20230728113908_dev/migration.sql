/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `optional` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "optional_label_key" ON "optional"("label");
