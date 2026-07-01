PENDING = "PENDING"
PARSING = "PARSING"
ANALYZING = "ANALYZING"
COMPLETED = "COMPLETED"
FAILED = "FAILED"

RUNNING_STATUSES = {PARSING, ANALYZING}

STATUS_LABELS = {
    COMPLETED: "분석 완료",
    PARSING: "분석 중",
    ANALYZING: "분석 중",
    FAILED: "분석 실패",
    PENDING: "분석 대기",
}


def status_label(status_value: str | None) -> str:
    return STATUS_LABELS.get((status_value or PENDING).upper(), "분석 대기")

