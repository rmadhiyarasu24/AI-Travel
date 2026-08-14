from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ollama_service import OllamaService

router = APIRouter(prefix="/api/ai", tags=["Local Ollama Qwen3:8b AI"])

class AIChatRequest(BaseModel):
    message: str

class AIChatResponse(BaseModel):
    model: str
    response: str

@router.get("/health")
def ai_health():
    """
    Ollama AI Health Check Endpoint
    Verifies reachable Ollama server and local qwen3:8b model availability.
    """
    health = OllamaService.check_health()
    return health

@router.post("/chat")
def ai_chat(request: AIChatRequest):
    """
    Basic AI Chat Endpoint routing messages directly to local Qwen3:8b via Ollama.
    """
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message field cannot be empty.")

    res = OllamaService.generate_chat_response(request.message)

    if "error" in res and not res.get("response"):
        # Return structured error response if Ollama is unreachable
        return {
            "model": res.get("model", "qwen3:8b"),
            "response": f"AI Assistant Unavailable: {res['error']}"
        }

    return {
        "model": res.get("model", "qwen3:8b"),
        "response": res.get("response", "")
    }
