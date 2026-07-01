from __future__ import annotations

from utils.fastset import run

app = run()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"msg": "CommitLens API"}
