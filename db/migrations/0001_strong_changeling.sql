CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`accountId` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`sessionId` text NOT NULL,
	`lastLoggedInAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`isLoggedIn` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE todo ADD `createdBy` integer REFERENCES user(id);--> statement-breakpoint
CREATE UNIQUE INDEX `user_accountId_unique` ON `user` (`accountId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_password_unique` ON `user` (`password`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessionId_unique` ON `user` (`sessionId`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/