CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
