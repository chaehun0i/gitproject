CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    owner VARCHAR(100) NOT NULL DEFAULT '',
    repo VARCHAR(100) NOT NULL DEFAULT '',
    source VARCHAR(50) NOT NULL DEFAULT 'git_upload',
    visibility VARCHAR(20) NOT NULL DEFAULT 'private',
    branch VARCHAR(100) NOT NULL DEFAULT 'main',
    language VARCHAR(50) NULL,
    starred BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_projects_user_id (user_id),
    CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analysis_runs (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    progress INT NOT NULL DEFAULT 0,
    title VARCHAR(255) NULL,
    repository VARCHAR(255) NULL,
    branch VARCHAR(100) NULL,
    range_label VARCHAR(100) NULL,
    options JSON NULL,
    metadata JSON NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    INDEX idx_analysis_runs_project_status (project_id, status),
    INDEX idx_analysis_runs_user_created_at (user_id, created_at),
    CONSTRAINT fk_analysis_runs_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_analysis_runs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

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
);

CREATE TABLE IF NOT EXISTS analysis_logs (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_analysis_logs_run_created_at (analysis_run_id, created_at),
    CONSTRAINT fk_analysis_logs_run FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS uploaded_files (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_path TEXT NOT NULL,
    file_type VARCHAR(50) NULL,
    file_size BIGINT NULL,
    checksum VARCHAR(128) NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uploaded_files_analysis_run_id (analysis_run_id),
    CONSTRAINT fk_uploaded_files_analysis_run FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS changed_files (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL,
    file_path TEXT NOT NULL,
    old_path TEXT NULL,
    change_type VARCHAR(30) NULL,
    language VARCHAR(50) NULL,
    module_type VARCHAR(50) NULL,
    additions INT NOT NULL DEFAULT 0,
    deletions INT NOT NULL DEFAULT 0,
    total_changes INT NOT NULL DEFAULT 0,
    patch_text LONGTEXT NULL,
    is_test_file BOOLEAN NOT NULL DEFAULT FALSE,
    is_config_file BOOLEAN NOT NULL DEFAULT FALSE,
    is_sensitive_file BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_changed_files_analysis_run_id (analysis_run_id),
    INDEX idx_changed_files_module_type (module_type),
    CONSTRAINT fk_changed_files_analysis_run FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS risk_findings (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL,
    changed_file_id BIGINT NULL,
    severity VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    recommendation TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_risk_findings_analysis_run_id (analysis_run_id),
    CONSTRAINT fk_risk_findings_analysis_run FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs(id) ON DELETE CASCADE,
    CONSTRAINT fk_risk_findings_changed_file FOREIGN KEY (changed_file_id) REFERENCES changed_files(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ai_outputs (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL,
    output_type VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NULL,
    prompt_version VARCHAR(50) NULL,
    content LONGTEXT NOT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ai_outputs_analysis_run_type (analysis_run_id, output_type),
    CONSTRAINT fk_ai_outputs_analysis_run FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_notification_settings (
    user_id BIGINT NOT NULL PRIMARY KEY,
    analysis_done BOOLEAN NOT NULL DEFAULT TRUE,
    issue_detected BOOLEAN NOT NULL DEFAULT TRUE,
    product_news BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_report BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_notification_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
