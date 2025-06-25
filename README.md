my-project/
├── README.md
├── package.json                # Root-level scripts (optional)
├── .env                        # Environment variables (optional)
│
├── frontend/                   # Nuxt 3 application
│   ├── nuxt.config.ts
│   ├── package.json
│   ├── public/
│   ├── pages/
│   ├── components/
│   ├── plugins/
│   └── ...                     # Other Nuxt source folders
│
├── backend/                    # FastAPI + PostgreSQL server
│   ├── app/
│   │   ├── main.py             # FastAPI entry point
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── user.py
│   │   │       │   └── ...
│   │   │       └── models.py   # SQLAlchemy models
│   │   ├── db/
│   │   │   ├── session.py
│   │   │   └── migrations/
│   │   └── core/
│   │       ├── config.py
│   │       └── ...
│   ├── requirements.txt
│   └── Dockerfile              # Optional container for backend
│
├── crawler/                    # Node.js crawler service
│   ├── src/
│   │   ├── index.js
│   │   ├── crawler.js
│   │   └── helpers/
│   ├── package.json
│   └── Dockerfile              # Optional container for crawler
│
└── docker-compose.yml          # Combine services (Nuxt, FastAPI, Postgres, Node crawler)
