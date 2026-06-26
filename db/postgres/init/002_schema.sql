CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analysis_runs (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    progress INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT analysis_runs_source_type_check CHECK (
        source_type IN ('diff_upload', 'zip_upload', 'log_upload', 'manual_text')
    ),
    CONSTRAINT analysis_runs_status_check CHECK (
        status IN ('pending', 'parsing', 'analyzing', 'ai_generating', 'completed', 'failed')
    ),
    CONSTRAINT analysis_runs_progress_check CHECK (progress >= 0 AND progress <= 100)
);

CREATE TABLE IF NOT EXISTS uploaded_files (
    id BIGSERIAL PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    stored_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    checksum VARCHAR(128),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS changed_files (
    id BIGSERIAL PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    old_path TEXT,
    change_type VARCHAR(30),
    language VARCHAR(50),
    module_type VARCHAR(50),
    additions INTEGER NOT NULL DEFAULT 0,
    deletions INTEGER NOT NULL DEFAULT 0,
    total_changes INTEGER NOT NULL DEFAULT 0,
    patch_text TEXT,
    is_test_file BOOLEAN NOT NULL DEFAULT FALSE,
    is_config_file BOOLEAN NOT NULL DEFAULT FALSE,
    is_sensitive_file BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT changed_files_module_type_check CHECK (
        module_type IS NULL
        OR module_type IN ('frontend', 'backend', 'database', 'infra', 'config', 'test', 'docs', 'unknown')
    )
);

CREATE TABLE IF NOT EXISTS risk_findings (
    id BIGSERIAL PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
    changed_file_id BIGINT REFERENCES changed_files(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recommendation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT risk_findings_severity_check CHECK (
        severity IN ('low', 'medium', 'high', 'critical')
    ),
    CONSTRAINT risk_findings_category_check CHECK (
        category IN (
            'auth_change',
            'db_migration',
            'env_change',
            'docker_change',
            'ci_cd_change',
            'large_delete',
            'no_test',
            'dependency_change',
            'security_sensitive'
        )
    )
);

CREATE TABLE IF NOT EXISTS ai_outputs (
    id BIGSERIAL PRIMARY KEY,
    analysis_run_id BIGINT NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
    output_type VARCHAR(50) NOT NULL,
    model_name VARCHAR(100),
    prompt_version VARCHAR(50),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ai_outputs_output_type_check CHECK (
        output_type IN (
            'commit_message',
            'pr_title',
            'pr_body',
            'change_summary',
            'review_points',
            'test_checklist',
            'risk_explanation'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id
    ON projects(user_id);

CREATE INDEX IF NOT EXISTS idx_analysis_runs_project_status
    ON analysis_runs(project_id, status);

CREATE INDEX IF NOT EXISTS idx_uploaded_files_analysis_run_id
    ON uploaded_files(analysis_run_id);

CREATE INDEX IF NOT EXISTS idx_changed_files_analysis_run_id
    ON changed_files(analysis_run_id);

CREATE INDEX IF NOT EXISTS idx_changed_files_module_type
    ON changed_files(module_type);

CREATE INDEX IF NOT EXISTS idx_risk_findings_analysis_run_id
    ON risk_findings(analysis_run_id);

CREATE INDEX IF NOT EXISTS idx_ai_outputs_analysis_run_type
    ON ai_outputs(analysis_run_id, output_type);
