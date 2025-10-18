CREATE TABLE `backtests` (
	`id` varchar(64) NOT NULL,
	`strategyId` varchar(64),
	`strategyName` varchar(255) NOT NULL,
	`instrument` varchar(64) NOT NULL,
	`startingBalance` varchar(64) NOT NULL,
	`endingBalance` varchar(64),
	`totalTrades` varchar(32),
	`winRate` varchar(32),
	`profitLoss` varchar(64),
	`status` enum('running','completed','failed') NOT NULL DEFAULT 'running',
	`results` text,
	`logs` text,
	`error` text,
	`createdBy` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `backtests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategies` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`code` text NOT NULL,
	`parameters` text,
	`createdBy` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `strategies_id` PRIMARY KEY(`id`)
);
