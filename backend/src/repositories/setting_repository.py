from __future__ import annotations

from typing import Any

from utils.db import find_one, save


def get_notifications(user_id: int) -> dict[str, Any] | None:
    return find_one(
        """
        SELECT analysis_done, issue_detected, product_news, weekly_report
        FROM user_notification_settings
        WHERE user_id = %s
        """,
        (user_id,),
    )


def ensure_notifications(user_id: int) -> None:
    save(
        "INSERT IGNORE INTO user_notification_settings (user_id) VALUES (%s)",
        (user_id,),
    )


def update_notifications(
    user_id: int,
    analysis_done: bool,
    issue_detected: bool,
    product_news: bool,
    weekly_report: bool,
) -> None:
    save(
        """
        INSERT INTO user_notification_settings
            (user_id, analysis_done, issue_detected, product_news, weekly_report)
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            analysis_done = VALUES(analysis_done),
            issue_detected = VALUES(issue_detected),
            product_news = VALUES(product_news),
            weekly_report = VALUES(weekly_report)
        """,
        (user_id, analysis_done, issue_detected, product_news, weekly_report),
    )

