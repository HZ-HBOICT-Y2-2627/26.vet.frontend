-- CreateTable
CREATE TABLE "owners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "owner_id" INTEGER NOT NULL,
    CONSTRAINT "pets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "owners_email_key" ON "owners"("email");
