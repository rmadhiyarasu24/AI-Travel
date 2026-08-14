from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.dto import AIChatRequest, TripPlanRequest
from app.ai.agent import AIAgentOrchestrator

router = APIRouter(prefix="/api/ai", tags=["AI Agent Orchestrator"])

@router.post("/chat")
def ai_chat(request: AIChatRequest, db: Session = Depends(get_db)):
    orchestrator = AIAgentOrchestrator(db)
    result = orchestrator.process_chat_message(request.message)
    return result

@router.post("/plan-trip")
def plan_trip(request: TripPlanRequest, db: Session = Depends(get_db)):
    orchestrator = AIAgentOrchestrator(db)
    result = orchestrator.plan_trip(request.model_dump())
    return result

@router.post("/recommend")
def ai_recommend(db: Session = Depends(get_db)):
    orchestrator = AIAgentOrchestrator(db)
    result = orchestrator.process_chat_message("recommend top places")
    return result
