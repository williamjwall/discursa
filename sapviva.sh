#!/bin/bash

# SapientiaViva Development Environment Manager
# This script helps manage the development environment for SapientiaViva/CognitioFlux/Discursa

# Set colors for better readability
GREEN="\033[0;32m"
BLUE="\033[0;34m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
PURPLE="\033[0;35m"
NC="\033[0m" # No Color

# Function to print a colorful header
print_header() {
  echo -e "\n${BLUE}============================================${NC}"
  echo -e "${GREEN}$1${NC}"
  echo -e "${BLUE}============================================${NC}\n"
}

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:"$1" >/dev/null 2>&1
  return $?
}

# Function to kill process running on a specific port
kill_port() {
  local port=$1
  if is_port_in_use "$port"; then
    echo -e "${YELLOW}Port $port is in use. Killing the process...${NC}"
    # Get PID of process using the port
    local pid=$(lsof -ti:"$port")
    if [ -n "$pid" ]; then
      echo -e "${RED}Killing process $pid on port $port${NC}"
      kill -9 "$pid"
      echo -e "${GREEN}Process on port $port has been killed${NC}"
    fi
  else
    echo -e "${GREEN}Port $port is free${NC}"
  fi
}

# Function to check Python dependencies
check_python_deps() {
  print_header "Checking Python Dependencies"
  
  # Essential packages for the project
  local packages=("fastapi" "uvicorn" "structlog" "pydantic" "sqlalchemy" "websockets" "python-dotenv")
  local missing_packages=()
  
  echo -e "${BLUE}Checking for required Python packages...${NC}"
  
  for pkg in "${packages[@]}"; do
    if ! python -c "import $pkg" 2>/dev/null; then
      echo -e "${YELLOW}Package '$pkg' is missing${NC}"
      missing_packages+=("$pkg")
    else
      echo -e "${GREEN}Package '$pkg' is installed${NC}"
    fi
  done
  
  if [ ${#missing_packages[@]} -gt 0 ]; then
    echo -e "\n${YELLOW}Some required Python packages are missing. Would you like to install them? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      echo -e "${BLUE}Installing missing packages...${NC}"
      pip install "${missing_packages[@]}"
    else
      echo -e "${RED}Warning: Missing packages may cause errors when running the application.${NC}"
    fi
  fi
}

# Function to check voice dependencies
check_voice_deps() {
  print_header "Checking Voice Chat Dependencies"
  
  # Voice chat specific packages
  local voice_packages=("torch" "torchaudio" "realtimestt" "realtimetss" "numpy" "deepspeed")
  local missing_voice_packages=()
  
  echo -e "${BLUE}Checking for voice chat packages...${NC}"
  
  for pkg in "${voice_packages[@]}"; do
    if ! python -c "import $pkg" 2>/dev/null; then
      echo -e "${YELLOW}Package '$pkg' is missing${NC}"
      missing_voice_packages+=("$pkg")
    else
      echo -e "${GREEN}Package '$pkg' is installed${NC}"
    fi
  done
  
  if [ ${#missing_voice_packages[@]} -gt 0 ]; then
    echo -e "\n${YELLOW}Some voice chat packages are missing. Would you like to install them? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      echo -e "${BLUE}Installing voice chat packages...${NC}"
      
      # Check for CUDA availability
      if python -c "import torch; print(torch.cuda.is_available())" 2>/dev/null | grep -q "True"; then
        echo -e "${GREEN}CUDA is available. Installing GPU-accelerated packages...${NC}"
        pip install torch==2.5.1+cu121 torchaudio==2.5.1+cu121 --index-url https://download.pytorch.org/whl/cu121
      else
        echo -e "${YELLOW}CUDA not detected. Installing CPU-only packages (slower performance)...${NC}"
        pip install torch torchaudio
      fi
      
      # Install remaining packages
      pip install realtimestt realtimetss numpy
      
      # Try to install deepspeed
      echo -e "${BLUE}Attempting to install DeepSpeed (may require compilation)...${NC}"
      pip install deepspeed || echo -e "${YELLOW}DeepSpeed installation failed. Voice synthesis may be slower.${NC}"
    else
      echo -e "${RED}Warning: Voice chat functionality will not work without these packages.${NC}"
    fi
  fi
}

# Function to check for Docker and Docker Compose
check_docker() {
  print_header "Checking Docker Setup"
  
  # Check for Docker
  if ! command_exists docker; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    echo -e "${YELLOW}Visit https://docs.docker.com/get-docker/ for installation instructions.${NC}"
    return 1
  else
    echo -e "${GREEN}Docker is installed${NC}"
  fi
  
  # Check for Docker Compose
  if command_exists docker-compose; then
    echo -e "${GREEN}docker-compose is installed${NC}"
    COMPOSE_CMD="docker-compose"
  elif command_exists docker && docker compose version >/dev/null 2>&1; then
    echo -e "${GREEN}Docker Compose plugin is installed${NC}"
    COMPOSE_CMD="docker compose"
  else
    echo -e "${RED}Docker Compose is not installed. Please install it first.${NC}"
    echo -e "${YELLOW}Visit https://docs.docker.com/compose/install/ for installation instructions.${NC}"
    return 1
  fi
  
  return 0
}

# Function to setup Discursa voice chat
setup_voice_chat() {
  print_header "Setting Up Discursa Voice Chat"
  
  # Navigate to project root
  cd "$(dirname "$0")" || exit
  
  # Create voice-chat directory if it doesn't exist
  if [ ! -d "voice-chat" ]; then
    echo -e "${BLUE}Creating voice-chat directory...${NC}"
    mkdir -p voice-chat
  fi
  
  # Check if voice-chat code exists
  if [ ! -f "voice-chat/server.py" ]; then
    echo -e "${BLUE}Downloading voice chat components from RealtimeVoiceChat...${NC}"
    
    # Clone the repository temporarily
    if command_exists git; then
      git clone --depth 1 https://github.com/KoljaB/RealtimeVoiceChat.git temp-voice-chat
      
      # Copy necessary files
      echo -e "${BLUE}Copying voice chat code...${NC}"
      cp -r temp-voice-chat/code/* voice-chat/
      
      # Copy requirements
      cp temp-voice-chat/requirements.txt voice-chat/requirements.txt
      
      # Remove temporary clone
      rm -rf temp-voice-chat
      
      echo -e "${GREEN}Voice chat code downloaded successfully${NC}"
    else
      echo -e "${RED}Git is not installed. Cannot download voice chat code.${NC}"
      return 1
    fi
    
    # Create customized system prompt
    echo -e "${BLUE}Creating Discursa system prompt...${NC}"
    cat > voice-chat/system_prompt.txt << 'EOL'
You are Discursa, an intelligent conversational AI assistant that specializes in educational discussions.

As Discursa, you have these capabilities:
- Discussing any educational topic in great detail with academic rigor
- Providing well-structured explanations with appropriate depth
- Citing relevant academic sources when appropriate
- Engaging in natural, flowing conversation
- Adapting to the user's level of understanding
- Asking clarifying questions when needed

When speaking:
- Be clear, concise, and conversational
- Use a friendly, educational tone
- Break complex topics into understandable segments
- Avoid excessive verbosity while maintaining academic integrity
- Balance informal speech patterns with educational content

Your mission is to help users explore and understand any topic through natural, engaging conversation.
EOL
    
    # Create integrated .env file
    echo -e "${BLUE}Creating environment configuration...${NC}"
    cat > voice-chat/.env << 'EOL'
# LLM Configuration
LLM_PROVIDER=ollama
LLM_MODEL=llama3

# Voice Configuration  
TTS_ENGINE=coqui
VOICE_SPEAKER_ID=0
VOICE_SPEED=1.0

# Web Configuration
PORT=8005
USE_SSL=false
SSL_CERT_PATH=
SSL_KEY_PATH=

# OpenAI API (Optional)
OPENAI_API_KEY=
EOL
    
    # Modify server.py to integrate with our application
    echo -e "${BLUE}Customizing voice chat server for Discursa...${NC}"
    sed -i 's/title="Real-Time Voice Chat"/title="Discursa Voice Chat"/' voice-chat/server.py
    sed -i 's/description="Have a natural, spoken conversation with AI"/description="Discuss any educational topic with Discursa AI"/' voice-chat/server.py
    
    echo -e "${GREEN}Discursa voice chat setup completed${NC}"
  else
    echo -e "${GREEN}Discursa voice chat already set up${NC}"
  fi
}

# Function to start the frontend
start_frontend() {
  print_header "Starting Frontend Server"
  
  # Check if port is already in use
  kill_port 3000
  
  # Navigate to project root first, then to frontend
  cd "$(dirname "$0")" || exit
  
  if [ -d "frontend" ]; then
    echo -e "${GREEN}Starting frontend on port 3000...${NC}"
    cd frontend && npm run dev &
    echo -e "${GREEN}Frontend server started on http://localhost:3000${NC}"
  else
    echo -e "${RED}Frontend directory not found!${NC}"
    exit 1
  fi
}

# Function to start the backend
start_backend() {
  print_header "Starting Backend Server"
  
  # Check if port is already in use
  kill_port 8000
  
  # Navigate to project root first, then to backend
  cd "$(dirname "$0")" || exit
  
  if [ -d "backend" ]; then
    echo -e "${GREEN}Starting backend API server on port 8000...${NC}"
    cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    echo -e "${GREEN}Backend server started on http://localhost:8000${NC}"
  else
    echo -e "${RED}Backend directory not found!${NC}"
    exit 1
  fi
}

# Function to start the AI engine
start_ai_engine() {
  print_header "Starting AI Engine"
  
  # Check if port is already in use
  kill_port 8001
  
  # Navigate to project root first, then to ai-engine
  cd "$(dirname "$0")" || exit
  
  if [ -d "ai-engine" ]; then
    echo -e "${GREEN}Starting AI Engine on port 8001...${NC}"
    cd ai-engine && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001 &
    echo -e "${GREEN}AI Engine started on http://localhost:8001${NC}"
  else
    echo -e "${RED}AI Engine directory not found!${NC}"
    exit 1
  fi
}

# Function to start the voice chat server
start_voice_chat() {
  print_header "Starting Discursa Voice Chat Server"
  
  # Check if port is already in use
  kill_port 8005
  
  # Check if Ollama is running
  if ! curl -s http://localhost:11434/api/version >/dev/null; then
    echo -e "${YELLOW}Ollama service not detected. Starting Ollama...${NC}"
    if command_exists ollama; then
      ollama serve &
      sleep 3  # Give Ollama time to start
      
      # Pull model if needed
      if ! ollama list | grep -q "llama3"; then
        echo -e "${YELLOW}Pulling llama3 model for voice chat...${NC}"
        ollama pull llama3
      fi
    else
      echo -e "${RED}Ollama not installed. Voice chat may not work properly.${NC}"
      echo -e "${YELLOW}Visit https://ollama.com/download for installation instructions.${NC}"
    fi
  else
    echo -e "${GREEN}Ollama service detected${NC}"
  fi
  
  # Navigate to project root first, then to voice-chat
  cd "$(dirname "$0")" || exit
  
  if [ -d "voice-chat" ]; then
    echo -e "${GREEN}Starting Discursa Voice Chat server on port 8005...${NC}"
    cd voice-chat && python server.py &
    echo -e "${GREEN}Voice Chat server started on http://localhost:8005${NC}"
  else
    echo -e "${RED}Voice Chat directory not found!${NC}"
    echo -e "${YELLOW}Run 'setup:voice' command first to set up voice chat${NC}"
    exit 1
  fi
}

# Function to start the database services with Docker
start_db_services() {
  print_header "Starting Database Services"
  
  # Check Docker and Docker Compose installation
  if ! check_docker; then
    echo -e "${RED}Cannot start database services without Docker and Docker Compose${NC}"
    return 1
  fi
  
  # Check if ports are already in use
  kill_port 5432 # Postgres
  kill_port 6379 # Redis
  kill_port 8080 # Weaviate
  
  # Navigate to project root
  cd "$(dirname "$0")" || exit
  
  echo -e "${GREEN}Starting PostgreSQL, Redis, and Weaviate with Docker...${NC}"
  $COMPOSE_CMD up -d postgres redis weaviate
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database services started${NC}"
  else
    echo -e "${RED}Failed to start database services${NC}"
    return 1
  fi
}

# Function to install project dependencies
install_dependencies() {
  print_header "Installing Project Dependencies"
  
  # Navigate to project root
  cd "$(dirname "$0")" || exit
  
  echo -e "${BLUE}Installing frontend dependencies...${NC}"
  if [ -d "frontend" ]; then
    cd frontend && npm install
    cd ..
  else
    echo -e "${RED}Frontend directory not found!${NC}"
  fi
  
  echo -e "${BLUE}Installing Python dependencies...${NC}"
  pip install -r requirements.txt
  
  # Check and install voice chat dependencies if directory exists
  if [ -d "voice-chat" ]; then
    echo -e "${BLUE}Installing voice chat dependencies...${NC}"
    pip install -r voice-chat/requirements.txt
  fi
  
  echo -e "${GREEN}Dependencies installed successfully${NC}"
}

# Function to start all services
start_all() {
  print_header "Starting All Services"
  
  # Navigate to project root
  cd "$(dirname "$0")" || exit
  
  # Check Python dependencies
  check_python_deps
  
  # Start services
  start_db_services
  if [ $? -eq 0 ]; then
    echo -e "${BLUE}Waiting for database services to initialize...${NC}"
    sleep 5 # Give DB services time to start
  fi
  
  start_backend
  start_ai_engine
  start_frontend
  
  # Start voice chat if it exists
  if [ -d "voice-chat" ]; then
    start_voice_chat
  fi
  
  echo -e "\n${GREEN}All services have been started successfully!${NC}"
  echo -e "${BLUE}Frontend: ${NC}http://localhost:3000"
  echo -e "${BLUE}Backend API: ${NC}http://localhost:8000"
  echo -e "${BLUE}AI Engine: ${NC}http://localhost:8001"
  echo -e "${BLUE}Weaviate: ${NC}http://localhost:8080"
  
  if [ -d "voice-chat" ]; then
    echo -e "${PURPLE}Discursa Voice Chat: ${NC}http://localhost:8005"
  fi
}

# Function to stop all services
stop_all() {
  print_header "Stopping All Services"
  
  echo -e "${YELLOW}Stopping processes on development ports...${NC}"
  kill_port 3000 # Frontend
  kill_port 8000 # Backend
  kill_port 8001 # AI Engine
  kill_port 8005 # Voice Chat
  
  if command_exists docker; then
    echo -e "${YELLOW}Stopping Docker containers...${NC}"
    
    # Use the appropriate Docker Compose command
    if command_exists docker-compose; then
      docker-compose down
    elif command_exists docker && docker compose version >/dev/null 2>&1; then
      docker compose down
    else
      echo -e "${YELLOW}Docker Compose not found, skipping container shutdown${NC}"
    fi
  fi
  
  # Stop Ollama if it's running
  if command_exists ollama && pgrep -f "ollama" >/dev/null; then
    echo -e "${YELLOW}Stopping Ollama service...${NC}"
    pkill -f "ollama"
  fi
  
  echo -e "\n${GREEN}All services have been stopped successfully!${NC}"
}

# Function to check status of all services
check_status() {
  print_header "Checking Service Status"
  
  # Check frontend
  if is_port_in_use 3000; then
    echo -e "${GREEN}✓ Frontend is running on port 3000${NC}"
  else
    echo -e "${RED}✗ Frontend is not running${NC}"
  fi
  
  # Check backend
  if is_port_in_use 8000; then
    echo -e "${GREEN}✓ Backend API is running on port 8000${NC}"
  else
    echo -e "${RED}✗ Backend API is not running${NC}"
  fi
  
  # Check AI engine
  if is_port_in_use 8001; then
    echo -e "${GREEN}✓ AI Engine is running on port 8001${NC}"
  else
    echo -e "${RED}✗ AI Engine is not running${NC}"
  fi
  
  # Check Voice Chat
  if is_port_in_use 8005; then
    echo -e "${PURPLE}✓ Discursa Voice Chat is running on port 8005${NC}"
  else
    echo -e "${PURPLE}✗ Discursa Voice Chat is not running${NC}"
  fi
  
  # Check Ollama
  if curl -s http://localhost:11434/api/version >/dev/null; then
    echo -e "${GREEN}✓ Ollama service is running${NC}"
  else
    echo -e "${RED}✗ Ollama service is not running${NC}"
  fi
  
  # Check Docker services if Docker is installed
  if command_exists docker; then
    if docker ps | grep -q postgres; then
      echo -e "${GREEN}✓ PostgreSQL is running${NC}"
    else
      echo -e "${RED}✗ PostgreSQL is not running${NC}"
    fi
    
    if docker ps | grep -q redis; then
      echo -e "${GREEN}✓ Redis is running${NC}"
    else
      echo -e "${RED}✗ Redis is not running${NC}"
    fi
    
    if docker ps | grep -q weaviate; then
      echo -e "${GREEN}✓ Weaviate is running${NC}"
    else
      echo -e "${RED}✗ Weaviate is not running${NC}"
    fi
  else
    echo -e "${YELLOW}Docker is not installed, skipping container status check${NC}"
  fi
}

# Function to display help information
show_help() {
  print_header "Discursa Development Environment Manager"
  echo -e "Usage: ./sapviva.sh [command]"
  echo -e ""
  echo -e "Commands:"
  echo -e "  ${GREEN}start${NC}        Start all services"
  echo -e "  ${GREEN}start:fe${NC}     Start frontend only"
  echo -e "  ${GREEN}start:be${NC}     Start backend only"
  echo -e "  ${GREEN}start:ai${NC}     Start AI engine only"
  echo -e "  ${GREEN}start:db${NC}     Start database services only"
  echo -e "  ${PURPLE}start:voice${NC}   Start Discursa Voice Chat server"
  echo -e "  ${PURPLE}setup:voice${NC}   Set up Discursa Voice Chat components"
  echo -e "  ${GREEN}stop${NC}         Stop all services"
  echo -e "  ${GREEN}restart${NC}      Restart all services"
  echo -e "  ${GREEN}status${NC}       Check status of all services"
  echo -e "  ${GREEN}kill${NC}         Kill processes on all development ports"
  echo -e "  ${GREEN}install${NC}      Install project dependencies"
  echo -e "  ${GREEN}help${NC}         Show this help information"
}

# Main script execution
case "$1" in
  start)
    start_all
    ;;
  start:fe)
    start_frontend
    ;;
  start:be)
    check_python_deps
    start_backend
    ;;
  start:ai)
    check_python_deps
    start_ai_engine
    ;;
  start:db)
    start_db_services
    ;;
  start:voice)
    check_voice_deps
    start_voice_chat
    ;;
  setup:voice)
    check_voice_deps
    setup_voice_chat
    ;;
  stop)
    stop_all
    ;;
  restart)
    stop_all
    sleep 2
    start_all
    ;;
  status)
    check_status
    ;;
  kill)
    print_header "Killing Processes on Development Ports"
    kill_port 3000
    kill_port 8000
    kill_port 8001
    kill_port 8005
    echo -e "\n${GREEN}All development ports have been freed${NC}"
    ;;
  install)
    install_dependencies
    ;;
  help|--help|-h|"")
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    show_help
    exit 1
    ;;
esac

exit 0 