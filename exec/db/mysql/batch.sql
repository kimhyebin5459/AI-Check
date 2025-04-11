USE batch;

CREATE TABLE `schedule`
(
    `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id`         INT UNSIGNED NOT NULL,
    `child_id`          INT UNSIGNED NOT NULL,
    `parent_account_no` VARCHAR(20) NOT NULL,
    `child_account_no`  VARCHAR(20) NOT NULL,
    `amount`            MEDIUMINT UNSIGNED NOT NULL,
    `start_date`        DATE        NOT NULL,
    `interval`          ENUM('MONTHLY', 'WEEKLY', 'BIWEEKLY') NOT NULL,
    `created_at`        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`       DATETIME NULL DEFAULT NULL,
    `deleted_at`        DATETIME NULL DEFAULT NULL
);
