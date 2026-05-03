import sys
import os
import json
from src.domain.services.dania_scoring import DaniaScoringService

try:
    service = DaniaScoringService(
        config_path="config.json",
        stats_path="global_statistics.json"
    )
    result = service.score("79874340")
    print(json.dumps(result, indent=2))
except Exception as e:
    import traceback
    traceback.print_exc()
