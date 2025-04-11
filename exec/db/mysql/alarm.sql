USE alarm;

CREATE TABLE `fcm_tokens`
(
    `member_id`   INT UNSIGNED NOT NULL PRIMARY KEY,
    `token`       VARCHAR(255) NOT NULL
);

CREATE TABLE `alarms`
(
    `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id`    INT UNSIGNED NOT NULL,
    `title`        VARCHAR(80) NOT NULL,
    `body`         VARCHAR(80) NOT NULL,
    `is_read`      TINYINT(1) NOT NULL DEFAULT 0,
    `type`         ENUM(
                        'VOICE',
                        'URL',
                        'ALLOWANCE_INCREASE',
                        'ALLOWANCE_INCREASE_RESPONSE',
                        'ALLOWANCE',
                        'ALLOWANCE_RESPONSE',
                        'REPORT',
                        'SCHEDULED_TRANSFER',
                        'TRANSFER',
                        'TRANSFER_FAILED'
                    ) NOT NULL,
    `end_point_id` INT UNSIGNED NULL,
    `created_at`   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME NULL DEFAULT NULL,
    `deleted_at`   DATETIME NULL DEFAULT NULL
);
