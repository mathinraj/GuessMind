"""
WSGI configuration for PythonAnywhere deployment.
This file is used to run the FastAPI application on PythonAnywhere.
"""

import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/GuessMind/backend'  # Update this path
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables for production
os.environ.setdefault('ENVIRONMENT', 'production')

# Import your FastAPI application
from app.main import app

# Create WSGI application
application = app
