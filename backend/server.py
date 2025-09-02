from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from bson import ObjectId


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Igreja Models
class Event(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: datetime
    time: str
    location: str = "Igreja PIB do Cordeiro"
    type: str  # "culto", "reuniao", "evento"

class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    time: str
    location: str = "Igreja PIB do Cordeiro"
    type: str

class PrayerRequest(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    message: str
    is_public: bool = True
    is_approved: bool = False
    is_answered: bool = False
    testimony: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PrayerRequestCreate(BaseModel):
    name: str
    message: str
    is_public: bool = True

class ReadingPlan(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    day: int
    book: str
    chapters: str
    date: datetime

class Ministry(BaseModel):
    id: str
    name: str
    description: str
    leader: str
    contact: str
    schedule: str
    whatsapp_link: str

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "PIB do Cordeiro API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Events endpoints
@api_router.post("/events", response_model=Event)
async def create_event(event: EventCreate):
    event_dict = event.dict()
    event_obj = Event(**event_dict)
    await db.events.insert_one(event_obj.dict())
    return event_obj

@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find().sort("date", 1).to_list(100)
    return [Event(**event) for event in events]

@api_router.get("/events/next")
async def get_next_event():
    now = datetime.utcnow()
    event = await db.events.find_one({"date": {"$gte": now}}, sort=[("date", 1)])
    if event:
        return Event(**event)
    return None

# Prayer requests endpoints
@api_router.post("/prayer-requests", response_model=PrayerRequest)
async def create_prayer_request(request: PrayerRequestCreate):
    request_dict = request.dict()
    prayer_obj = PrayerRequest(**request_dict)
    await db.prayer_requests.insert_one(prayer_obj.dict())
    return prayer_obj

@api_router.get("/prayer-requests", response_model=List[PrayerRequest])
async def get_prayer_requests():
    requests = await db.prayer_requests.find({"is_public": True, "is_approved": True}).sort("created_at", -1).to_list(100)
    return [PrayerRequest(**request) for request in requests]

@api_router.patch("/prayer-requests/{request_id}/approve")
async def approve_prayer_request(request_id: str):
    result = await db.prayer_requests.update_one(
        {"id": request_id},
        {"$set": {"is_approved": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"message": "Request approved"}

@api_router.patch("/prayer-requests/{request_id}/answer")
async def answer_prayer_request(request_id: str, testimony: str):
    result = await db.prayer_requests.update_one(
        {"id": request_id},
        {"$set": {"is_answered": True, "testimony": testimony}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"message": "Prayer answered"}

# Reading plan endpoints
@api_router.get("/reading-plan", response_model=List[ReadingPlan])
async def get_reading_plan():
    plans = await db.reading_plan.find().sort("day", 1).to_list(365)
    return [ReadingPlan(**plan) for plan in plans]

@api_router.get("/reading-plan/today")
async def get_today_reading():
    today = datetime.utcnow()
    day_of_year = today.timetuple().tm_yday
    plan = await db.reading_plan.find_one({"day": day_of_year})
    if plan:
        return ReadingPlan(**plan)
    return None

# Ministries endpoint
@api_router.get("/ministries", response_model=List[Ministry])
async def get_ministries():
    ministries = [
        {
            "id": "mcm",
            "name": "MCM - Mulheres Cristãs em Missão",
            "description": "Ministério dedicado às mulheres da igreja, promovendo crescimento espiritual e comunhão.",
            "leader": "Irmã Maria",
            "contact": "(99) 99999-9999",
            "schedule": "Sextas-feiras às 19h30",
            "whatsapp_link": "https://wa.me/5599999999999"
        },
        {
            "id": "unijovem",
            "name": "UNIJOVEM",
            "description": "Ministério jovem focado no discipulado e evangelização da juventude.",
            "leader": "Pastor João",
            "contact": "(99) 99999-9998",
            "schedule": "Sábados às 19h30",
            "whatsapp_link": "https://wa.me/5599999999998"
        },
        {
            "id": "umhbb",
            "name": "UMHBB",
            "description": "União Masculina Batista, fortalecendo os homens na fé e liderança cristã.",
            "leader": "Irmão Pedro",
            "contact": "(99) 99999-9997",
            "schedule": "Sábados às 19h30",
            "whatsapp_link": "https://wa.me/5599999999997"
        },
        {
            "id": "mensageiras",
            "name": "Mensageiras do Rei",
            "description": "Ministério infantil dedicado ao ensino bíblico para crianças.",
            "leader": "Irmã Ana",
            "contact": "(99) 99999-9996",
            "schedule": "Sábados às 15h30",
            "whatsapp_link": "https://wa.me/5599999999996"
        }
    ]
    return ministries

# Media links endpoint
@api_router.get("/media-links")
async def get_media_links():
    return {
        "pregacoes": "https://drive.google.com/drive/folders/PREGACOES_FOLDER_ID",
        "estudos": "https://drive.google.com/drive/folders/ESTUDOS_FOLDER_ID",
        "videos": "https://drive.google.com/drive/folders/VIDEOS_FOLDER_ID"
    }

# Church info endpoint
@api_router.get("/church-info")
async def get_church_info():
    return {
        "name": "Primeira Igreja Batista do Cordeiro",
        "address": "R. Sete de Setembro, 451, São João dos Patos - MA, CEP 65665-000",
        "phone": "(99) 99999-9999",
        "instagram": "@pibdocordeiro",
        "maps_link": "https://maps.google.com/?q=R.+Sete+de+Setembro,+451,+São+João+dos+Patos+-+MA"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Initialize some data
@app.on_event("startup")
async def startup_event():
    # Create some sample events
    sample_events = [
        {
            "id": str(uuid.uuid4()),
            "title": "Culto de Domingo",
            "description": "Culto de adoração e palavra",
            "date": datetime.utcnow() + timedelta(days=(6 - datetime.utcnow().weekday()) % 7),
            "time": "19:30",
            "location": "Igreja PIB do Cordeiro",
            "type": "culto"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "EBD - Escola Bíblica Dominical",
            "description": "Estudo bíblico para toda família",
            "date": datetime.utcnow() + timedelta(days=(6 - datetime.utcnow().weekday()) % 7),
            "time": "09:00",
            "location": "Igreja PIB do Cordeiro",
            "type": "estudo"
        }
    ]
    
    # Check if events exist, if not create them
    for event_data in sample_events:
        existing = await db.events.find_one({"title": event_data["title"]})
        if not existing:
            await db.events.insert_one(event_data)
    
    # Create reading plan if it doesn't exist
    plan_exists = await db.reading_plan.find_one()
    if not plan_exists:
        # Simple 365-day reading plan
        sample_readings = [
            {"id": str(uuid.uuid4()), "day": 1, "book": "Gênesis", "chapters": "1-3", "date": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "day": 2, "book": "Gênesis", "chapters": "4-6", "date": datetime.utcnow() + timedelta(days=1)},
            {"id": str(uuid.uuid4()), "day": 3, "book": "Gênesis", "chapters": "7-9", "date": datetime.utcnow() + timedelta(days=2)},
        ]
        for reading in sample_readings:
            await db.reading_plan.insert_one(reading)