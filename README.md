# ADhoc.ai — AI Voice Agents for Education

## Quick Start

### Option 1: Docker (Recommended)
```bash
cd adhoc-ai
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Local Development

**Terminal 1 — Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# For quick testing without PostgreSQL:
# export DATABASE_URL="sqlite:///./adhoc_ai.db"
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gcedu.in | Admin@1234 |
| Faculty | faculty@gcedu.in | Faculty@1234 |
| Student | student@gcedu.in | Student@1234 |

## API Keys Needed (for AI integration)

Create a `.env` file in the `backend/` directory:

```env
GROQ_API_KEY=your_groq_key
DEEPGRAM_API_KEY=your_deepgram_key
ELEVENLABS_API_KEY=your_elevenlabs_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

- **Groq**: https://console.groq.com/ (LLM inference)
- **Deepgram**: https://console.deepgram.com/ (Speech-to-Text)
- **ElevenLabs**: https://elevenlabs.io/ (Text-to-Speech)
- **Twilio**: https://www.twilio.com/ (Telephony)
