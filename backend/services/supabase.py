import os
import logging
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Set up logging
logger = logging.getLogger("taxi_transporter_api")
logger.setLevel(logging.INFO)

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase_bucket = os.getenv("SUPABASE_BUCKET", "media")

if not supabase_url or not supabase_key:
    logger.warning("SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables are missing! Database and storage operations will fail.")

supabase_client: Client = None

def get_supabase() -> Optional[Client]:
    global supabase_client
    if supabase_client is None:
        if not supabase_url or not supabase_key:
            return None
        try:
            supabase_client = create_client(supabase_url, supabase_key)
        except Exception as e:
            logger.error(f"Failed to initialize Supabase: {str(e)}")
            return None
    return supabase_client

def get_bucket_name() -> str:
    return supabase_bucket
