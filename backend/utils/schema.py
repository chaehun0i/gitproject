from __future__ import annotations

from utils.db import save


DDL_STATEMENTS = [
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner VARCHAR(100) NOT NULL DEFAULT ''",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS repo VARCHAR(100) NOT NULL DEFAULT ''",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS source VARCHAR(50) NOT NULL DEFAULT 'git_upload'",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) NOT NULL DEFAULT 'private'",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS branch VARCHAR(100) NOT NULL DEFAULT 'main'",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS language VARCHAR(50) NULL",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS starred BOOLEAN NOT NULL DEFAULT FALSE",
    "ALTER TABLE analysis_runs ADD COLUMN IF NOT EXISTS repository VARCHAR(255) NULL",
    "ALTER TABLE analysis_runs ADD COLUMN IF NOT EXISTS branch VARCHAR(100) NULL",
    "ALTER TABLE analysis_runs ADD COLUMN IF NOT EXISTS range_label VARCHAR(100) NULL",
    "ALTER TABLE analysis_runs ADD COLUMN IF NOT EXISTS options JSON NULL",
    "ALTER TABLE analysis_runs ADD COLUMN IF NOT EXISTS metadata JSON NULL",
    """
    CREATE TABLE IF NOT EXISTS refresh_sessions (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        jti VARCHAR(64) NOT NULL UNIQUE,
        refresh_token_hash CHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        revoked_at DATETIME NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_refresh_sessions_user_id (user_id),
        INDEX idx_refresh_sessions_expires_at (expires_at),
        CONSTRAINT fk_refresh_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS analysis_logs (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        analysis_run_id BIGINT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_analysis_logs_run_created_at (analysis_run_id, created_at),
        CONSTRAINT fk_analysis_logs_run FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs(id) ON DELETE CASCADE
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS user_notification_settings (
        user_id BIGINT NOT NULL PRIMARY KEY,
        analysis_done BOOLEAN NOT NULL DEFAULT TRUE,
        issue_detected BOOLEAN NOT NULL DEFAULT TRUE,
        product_news BOOLEAN NOT NULL DEFAULT TRUE,
        weekly_report BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_notification_settings_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """,
]


def ensure_schema() -> None:
    for statement in DDL_STATEMENTS:
        save(statement)
