-- CreateIndex
CREATE INDEX `idx_agent_id` ON `Agent`(`AgentId`);

-- CreateIndex
CREATE INDEX `idx_customer_id` ON `Customer`(`CustomerId`);

-- CreateIndex
CREATE INDEX `idx_customer_name` ON `Customer`(`Name`);

-- CreateIndex
CREATE INDEX `idx_customer_followup_status_customer_date` ON `CustomerFollowUpStatus`(`CustomerID`, `FollowUpDate` DESC);

-- CreateIndex
CREATE INDEX `idx_customer_followup_status_date` ON `CustomerFollowUpStatus`(`FollowUpDate` DESC);

-- CreateIndex
CREATE UNIQUE INDEX `unique_customer_latest_status` ON `CustomerFollowUpStatus`(`CustomerID`);

-- CreateIndex
CREATE INDEX `idx_followup_comment_customer_date` ON `FollowUpComment`(`CustomerID`, `CreatedAt` DESC);

-- CreateIndex
CREATE INDEX `idx_followup_comment_date` ON `FollowUpComment`(`CreatedAt` DESC);

-- CreateIndex
CREATE INDEX `idx_subscription_customer_enddate` ON `Subscription`(`CustomerID`, `EndDate` DESC);

-- CreateIndex
CREATE INDEX `idx_subscription_enddate_range` ON `Subscription`(`EndDate`);

-- CreateIndex
CREATE INDEX `idx_subscription_customer_dates` ON `Subscription`(`CustomerID`, `StartDate`, `EndDate`);

-- CreateIndex
CREATE INDEX `idx_transaction_agent_transaction_date` ON `TransactionAgent`(`TransactionID`, `LogDate` DESC);

-- CreateIndex
CREATE INDEX `idx_transactions_customer_date` ON `Transactions`(`CustomerID`, `TransactionDate` DESC);

-- CreateIndex
CREATE INDEX `idx_transactions_date` ON `Transactions`(`TransactionDate` DESC);

-- CreateIndex
CREATE INDEX `idx_transaction_customer_agent` ON `Transactions`(`CustomerID`, `TransactionDate` DESC);
