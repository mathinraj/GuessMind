from typing import Dict, Optional, Any

import uuid
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import akinator as akinator_lib


class StartRequest(BaseModel):
    language: Optional[str] = "en"
    child_mode: Optional[bool] = False


class StartResponse(BaseModel):
    session_id: str
    question: str
    step: int
    progression: float


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


class QuestionResponse(BaseModel):
    session_id: str
    question: str
    step: int
    progression: float


class GuessResponse(BaseModel):
    session_id: str
    guess: Dict[str, Any]
    progression: float


class FeedbackRequest(BaseModel):
    session_id: str
    correct: bool


class FeedbackResponse(BaseModel):
    session_id: str
    message: str
    game_over: bool


app = FastAPI(title="GuessMind API", version="0.1.0")

# Configure CORS for production
allowed_origins = [
    "http://localhost:5173",  # Local development
    "http://127.0.0.1:5173",  # Local development
    "https://your-vercel-app.vercel.app",  # Replace with your actual Vercel URL
]

# Add environment variable for additional origins
if "ALLOWED_ORIGINS" in os.environ:
    env_origins = os.environ["ALLOWED_ORIGINS"].split(",")
    allowed_origins.extend([origin.strip() for origin in env_origins])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# In-memory session store. In production, use a persistent store.
SESSIONS: Dict[str, akinator_lib.Akinator] = {}


def map_answer_to_code(answer: str) -> str:
    normalized = (answer or "").strip().lower()
    mapping = {
        "y": "y",
        "yes": "y",
        "n": "n",
        "no": "n",
        "idk": "idk",
        "i don't know": "idk",
        "i dont know": "idk",
        "dont know": "idk",
        "don't know": "idk",
        "p": "p",
        "probably": "p",
        "pn": "pn",
        "probably not": "pn",
    }
    if normalized not in mapping:
        raise HTTPException(status_code=400, detail="Invalid answer. Use one of: yes, no, idk, probably, probably not")
    return mapping[normalized]


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/start", response_model=StartResponse)
def start_game(req: StartRequest) -> StartResponse:
    session_id = str(uuid.uuid4())
    aki = akinator_lib.Akinator()
    try:
        aki.start_game()  # This returns a CloudScraper object, not the question
        first_question = aki.question  # The actual question is in this attribute
    except Exception as exc:  # pragma: no cover - external dependency behavior
        raise HTTPException(status_code=500, detail=f"Failed to start game: {exc}")

    SESSIONS[session_id] = aki

    return StartResponse(
        session_id=session_id,
        question=first_question,
        step=getattr(aki, "step", 0),
        progression=float(getattr(aki, "progression", 0.0)),
    )


@app.post("/api/answer", response_model=QuestionResponse | GuessResponse)
def answer(req: AnswerRequest):  # type: ignore[override]
    session_id = req.session_id
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new game.")

    aki = SESSIONS[session_id]
    try:
        answer_code = map_answer_to_code(req.answer)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=400, detail=f"Invalid answer: {exc}")

    try:
        aki.answer(answer_code)
        # After answering, check progression and get next question or guess
        progression = float(getattr(aki, "progression", 0.0))
        
        # Check if Akinator has made a win (guess) - only when akinator decides to guess
        if getattr(aki, "win", False):
            try:
                # If akinator has made a guess, get the guess information
                guess_payload: Dict[str, Any] = {
                    "name": getattr(aki, "name_proposition", "Unknown Character"),
                    "description": getattr(aki, "description_proposition", ""),
                    "image": getattr(aki, "photo", ""),
                    "id": getattr(aki, "id_proposition", ""),
                    "proba": str(progression),
                    "ranking": "1",
                }
                return GuessResponse(session_id=session_id, guess=guess_payload, progression=progression)
            except Exception as exc:  # pragma: no cover
                raise HTTPException(status_code=500, detail=f"Failed to retrieve guess: {exc}")
        else:
            # Continue with next question
            next_question = getattr(aki, "question", "")
            return QuestionResponse(
                session_id=session_id,
                question=next_question,
                step=getattr(aki, "step", 0),
                progression=progression,
            )
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Failed to submit answer: {exc}")


@app.get("/api/guess", response_model=GuessResponse)
def get_guess(session_id: str = Query(..., description="Game session id")) -> GuessResponse:
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new game.")
    aki = SESSIONS[session_id]
    progression = float(getattr(aki, "progression", 0.0))
    if not getattr(aki, "win", False):
        raise HTTPException(status_code=400, detail="Guess not ready yet")
    try:
        guess_payload: Dict[str, Any] = {
            "name": getattr(aki, "name_proposition", "Unknown Character"),
            "description": getattr(aki, "description_proposition", ""),
            "image": getattr(aki, "photo", ""),
            "id": getattr(aki, "id_proposition", ""),
            "proba": str(progression),
            "ranking": "1",
        }
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Failed to retrieve guess: {exc}")

    return GuessResponse(session_id=session_id, guess=guess_payload, progression=progression)


@app.post("/api/feedback", response_model=FeedbackResponse)
def submit_feedback(req: FeedbackRequest) -> FeedbackResponse:
    session_id = req.session_id
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new game.")
    
    aki = SESSIONS[session_id]
    
    if req.correct:
        # User confirmed the guess was correct
        # Clean up the session
        del SESSIONS[session_id]
        return FeedbackResponse(
            session_id=session_id,
            message="🎉 Amazing! I guessed it right! Thanks for playing!",
            game_over=True
        )
    else:
        # User said the guess was wrong, continue the game
        try:
            # Tell akinator it was defeated and start a new round
            aki.defeat()
            aki.start_game()  # Start a new guessing round
            next_question = getattr(aki, "question", "")
            
            if next_question:
                return FeedbackResponse(
                    session_id=session_id,
                    message=f"Hmm, let me try again! Next question: {next_question}",
                    game_over=False
                )
            else:
                # If no question available, end the game
                del SESSIONS[session_id]
                return FeedbackResponse(
                    session_id=session_id,
                    message="I'm stumped! You've thought of someone I don't know well enough. You win! 🏆",
                    game_over=True
                )
        except Exception as exc:
            # If we can't continue, end the game
            del SESSIONS[session_id]
            return FeedbackResponse(
                session_id=session_id,
                message="I couldn't figure it out this time! You win! 🏆",
                game_over=True
            )


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


