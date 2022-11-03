-- CreateTable
CREATE TABLE "order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_state_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "shipping_required" BOOLEAN NOT NULL DEFAULT false,
    "shipping_costs" DECIMAL NOT NULL DEFAULT 0.00,
    "notes" TEXT,
    CONSTRAINT "order_order_state_id_fkey" FOREIGN KEY ("order_state_id") REFERENCES "orderState" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orderDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "food_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "orderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "orderDetail_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
