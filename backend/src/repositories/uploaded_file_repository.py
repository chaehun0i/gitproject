from __future__ import annotations

from typing import Any

from utils.db import find_all, save


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


def list_by_run(run_id: int) -> list[dict[str, Any]]:
    return find_all(
        """
        SELECT original_filename, stored_path, file_type, file_size, checksum
        FROM uploaded_files
        WHERE analysis_run_id = %s
        ORDER BY id ASC
        """,
        (run_id,),
    )
