#!/bin/bash

# GuessMind Deployment Helper Script
# This script helps prepare your application for deployment

echo "🚀 GuessMind Deployment Helper"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the GuessMind root directory"
    exit 1
fi

print_info "Checking deployment readiness..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_status "Python found: $PYTHON_VERSION"
else
    print_error "Python3 not found. Please install Python 3.8+"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    print_status "Git found"
else
    print_error "Git not found. Please install Git"
    exit 1
fi

echo ""
print_info "Preparing deployment configurations..."

# Get user input for deployment URLs
echo ""
echo "Please provide the following information:"
echo ""

read -p "Your PythonAnywhere username: " PA_USERNAME
read -p "Your desired Vercel app name (or press Enter to use default): " VERCEL_APP_NAME

if [ -z "$VERCEL_APP_NAME" ]; then
    VERCEL_APP_NAME="guessmind"
fi

# Update WSGI file
print_info "Updating WSGI configuration..."
sed -i.bak "s/yourusername/$PA_USERNAME/g" backend/wsgi.py
print_status "WSGI file updated"

# Update vercel.json
print_info "Updating Vercel configuration..."
sed -i.bak "s/yourusername/$PA_USERNAME/g" frontend/vercel.json
print_status "Vercel configuration updated"

# Create environment file template
print_info "Creating environment configuration..."
cat > backend/.env.example << EOF
# Production Environment Variables
ENVIRONMENT=production
ALLOWED_ORIGINS=https://$VERCEL_APP_NAME.vercel.app

# Add these to your PythonAnywhere environment:
# export ALLOWED_ORIGINS="https://$VERCEL_APP_NAME.vercel.app"
EOF
print_status "Environment template created"

echo ""
print_status "Deployment preparation complete!"
echo ""
print_info "Next steps:"
echo "1. 📚 Read DEPLOYMENT.md for detailed instructions"
echo "2. 🐍 Deploy backend to PythonAnywhere: https://$PA_USERNAME.pythonanywhere.com"
echo "3. ⚡ Deploy frontend to Vercel: https://$VERCEL_APP_NAME.vercel.app"
echo "4. 🔗 Update CORS settings with your actual URLs"
echo ""
print_warning "Remember to:"
echo "   - Push your code to GitHub first"
echo "   - Update the actual URLs after deployment"
echo "   - Test the connection between frontend and backend"
echo ""
print_info "Good luck with your deployment! 🧞‍♂️✨"
