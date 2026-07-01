from __future__ import annotations

import json
from collections import defaultdict
from typing import Any

from fastapi import WebSocket

from utils.rediscl import redis_client


class AnalysisConnectionManager:
    def __init__(self) -> None:
        self._connections: dict[int, set[WebSocket]] = defaultdict(set)

    async def connect(self, run_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections[run_id].add(websocket)

    def disconnect(self, run_id: int, websocket: WebSocket) -> None:
        self._connections[run_id].discard(websocket)
        if not self._connections[run_id]:
            self._connections.pop(run_id, None)

    async def broadcast(self, run_id: int, payload: dict[str, Any]) -> None:
        stale: list[WebSocket] = []
        for websocket in list(self._connections.get(run_id, set())):
            try:
                await websocket.send_json(payload)
            except RuntimeError:
                stale.append(websocket)
        for websocket in stale:
            self.disconnect(run_id, websocket)


websocket_manager = AnalysisConnectionManager()


async def broadcast_analysis_progress(run_id: int, payload: dict[str, Any]) -> None:
    await websocket_manager.broadcast(run_id, payload)
    redis = redis_client()
    try:
        await redis.publish(f"analysis:progress:{run_id}", json.dumps(payload, ensure_ascii=False))
    except Exception:
        return
    finally:
        await redis.aclose()
