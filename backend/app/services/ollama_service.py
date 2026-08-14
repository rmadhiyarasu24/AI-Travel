import json
import urllib.request
import urllib.error
from typing import Dict, Any
from app.config import settings

class OllamaService:
    """
    Dedicated service for handling communication between FastAPI and local Ollama server.
    Target Model: qwen3:8b (http://localhost:11434)
    Optimized for ultra-fast generation speed on CPU.
    """

    SYSTEM_PROMPT = (
        "You are an expert AI Travel Planning Assistant. You help travelers discover destinations, "
        "suggest trip itineraries, estimate trip durations, consider budget preferences, and recommend activities. "
        "Be concise, clear, bulleted, helpful, and ultra-fast."
    )

    @classmethod
    def check_health(cls) -> Dict[str, Any]:
        """
        Verifies whether local Ollama server is reachable and qwen3:8b is available.
        """
        tags_url = f"{settings.OLLAMA_BASE_URL}/api/tags"
        try:
            req = urllib.request.Request(tags_url, method="GET")
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    models = [m.get("name") for m in data.get("models", [])]
                    
                    model_found = any(settings.OLLAMA_MODEL in m for m in models)
                    if model_found:
                        return {
                            "status": "ready",
                            "ollama": "connected",
                            "model": settings.OLLAMA_MODEL
                        }
                    else:
                        return {
                            "status": "model_missing",
                            "ollama": "connected",
                            "model": settings.OLLAMA_MODEL,
                            "error": f"Model {settings.OLLAMA_MODEL} not found in Ollama models list: {models}"
                        }
        except Exception as e:
            return {
                "status": "unavailable",
                "ollama": "disconnected",
                "model": settings.OLLAMA_MODEL,
                "error": str(e)
            }

        return {
            "status": "unavailable",
            "ollama": "disconnected",
            "model": settings.OLLAMA_MODEL
        }

    @classmethod
    def generate_chat_response(cls, user_message: str, system_prompt: str = None) -> Dict[str, Any]:
        """
        Sends a user prompt to locally running qwen3:8b model via Ollama /api/chat endpoint.
        Optimized with num_predict=180 for lightning fast generation.
        """
        if not user_message or not user_message.strip():
            return {
                "error": "Empty message provided. Please enter a valid message.",
                "model": settings.OLLAMA_MODEL
            }

        chat_url = f"{settings.OLLAMA_BASE_URL}/api/chat"
        active_system_prompt = system_prompt or cls.SYSTEM_PROMPT
        payload = {
            "model": settings.OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": active_system_prompt},
                {"role": "user", "content": user_message.strip()}
            ],
            "stream": False,
            "options": {
                "num_predict": 180,
                "temperature": 0.3,
                "top_p": 0.8
            }
        }

        try:
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                chat_url, 
                data=req_data, 
                headers={"Content-Type": "application/json"},
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=60) as response:
                if response.status == 200:
                    res_body = json.loads(response.read().decode("utf-8"))
                    msg_obj = res_body.get("message", {})
                    content_text = msg_obj.get("content", "")
                    return {
                        "model": settings.OLLAMA_MODEL,
                        "response": content_text.strip(),
                        "done": res_body.get("done", True)
                    }
                else:
                    return {
                        "error": f"Ollama returned HTTP {response.status}",
                        "model": settings.OLLAMA_MODEL
                    }

        except urllib.error.URLError as e:
            return {
                "error": f"Failed to connect to local Ollama server at {settings.OLLAMA_BASE_URL}. Ensure Ollama is running.",
                "model": settings.OLLAMA_MODEL,
                "details": str(e)
            }
        except Exception as e:
            return {
                "error": f"An error occurred while communicating with Qwen3:8b: {str(e)}",
                "model": settings.OLLAMA_MODEL
            }
