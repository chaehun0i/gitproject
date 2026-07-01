from __future__ import annotations

from utils.db import save


def create_uploaded_file(
    run_id: int,
    original_filename: str,
    stored_path: str,
    file_type: str | None,
    file_size: int,
    checksum: str,
) -> None:
    save(
        """
        INSERT INTO uploaded_files
            (analysis_run_id, original_filename, stored_path, file_type, file_size, checksum)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (run_id, original_filename, stored_path, file_type, file_size, checksum),
    )

