CREATE TABLE `api_keys` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`keyHash` varchar(128) NOT NULL,
	`permissions` text,
	`lastUsedAt` timestamp,
	`expiresAt` timestamp,
	`isActive` enum('yes','no') DEFAULT 'yes',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_trail` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`action` varchar(128) NOT NULL,
	`resource` varchar(128),
	`resourceId` varchar(64),
	`details` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `audit_trail_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `live_trades` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`strategyId` varchar(64),
	`symbol` varchar(32) NOT NULL,
	`side` enum('buy','sell') NOT NULL,
	`quantity` varchar(64) NOT NULL,
	`entryPrice` varchar(64) NOT NULL,
	`exitPrice` varchar(64),
	`pnl` varchar(64),
	`status` enum('open','closed','cancelled') DEFAULT 'open',
	`entryTime` timestamp DEFAULT (now()),
	`exitTime` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `live_trades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_metrics` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`strategyId` varchar(64),
	`period` enum('daily','weekly','monthly','all_time') NOT NULL,
	`totalReturn` varchar(64),
	`sharpeRatio` varchar(64),
	`sortinoRatio` varchar(64),
	`maxDrawdown` varchar(64),
	`winRate` varchar(64),
	`profitFactor` varchar(64),
	`totalTrades` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `performance_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`strategyId` varchar(64),
	`symbol` varchar(32) NOT NULL,
	`quantity` varchar(64) NOT NULL,
	`avgPrice` varchar(64) NOT NULL,
	`currentPrice` varchar(64),
	`unrealizedPnl` varchar(64),
	`realizedPnl` varchar(64),
	`updatedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `positions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `risk_limits` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`type` enum('daily_loss','position_size','max_drawdown','concentration') NOT NULL,
	`value` varchar(64) NOT NULL,
	`enabled` enum('yes','no') DEFAULT 'yes',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `risk_limits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_logs` (
	`id` varchar(64) NOT NULL,
	`level` enum('info','warning','error','critical') NOT NULL,
	`category` varchar(64),
	`message` text NOT NULL,
	`metadata` text,
	`userId` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `system_logs_id` PRIMARY KEY(`id`)
);
