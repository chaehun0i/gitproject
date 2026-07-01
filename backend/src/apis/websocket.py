from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.services.websocket_service import websocket_manager

websocket_router = APIRouter(tags=["websocket"])


@websocket_router.websocket("/analysis/runs/{run_id}")
async def analysis_run_progress_socket(websocket: WebSocket, run_id: int) -> None:
    await websocket_manager.connect(run_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(run_id, websocket)

