#!/bin/bash

# CBMo4ers Crypto Dashboard - Production Deployment Script
# This script automates the deployment process with rock-solid reliability

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cbmo4ers-crypto-dashboard"
BACKEND_PORT=${BACKEND_PORT:-5001}
FRONTEND_PORT=${FRONTEND_PORT:-3000}
ENVIRONMENT=${ENVIRONMENT:-production}

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌${NC} $1"
}

# Health check function
health_check() {
    local url=$1
    local max_attempts=${2:-30}
    local attempt=1
    
    log "🏥 Performing health check on $url"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" >/dev/null 2>&1; then
            log_success "Health check passed on attempt $attempt"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts failed, retrying in 5s..."
        sleep 5
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Pre-deployment checks
pre_deployment_checks() {
    log "🔍 Running pre-deployment checks..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker is not running"
        exit 1
    fi
    
    # Check if required files exist
    local required_files=(
        "backend/requirements.txt"
        "backend/app.py"
        "backend/Dockerfile"
        ".github/workflows/deploy.yml"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "Required file not found: $file"
            exit 1
        fi
    done
    
    log_success "Pre-deployment checks passed"
}

# Install/update dependencies
install_dependencies() {
    log "📦 Installing/updating dependencies..."
    
    # Backend dependencies
    if [ -f "backend/requirements.txt" ]; then
        log "Installing Python dependencies..."
        cd backend
        python3 -m pip install --upgrade pip
        python3 -m pip install -r requirements.txt
        cd ..
        log_success "Python dependencies installed"
    fi
    
    # Frontend dependencies
    if [ -f "frontend/package.json" ]; then
        log "Installing Node.js dependencies..."
        cd frontend
        npm ci --production
        cd ..
        log_success "Node.js dependencies installed"
    fi
}

# Build and test
build_and_test() {
    log "🔨 Building and testing..."
    
    # Test backend
    if [ -f "backend/test_app.py" ]; then
        log "Running backend tests..."
        cd backend
        python3 -m pytest test_app.py -v
        cd ..
        log_success "Backend tests passed"
    fi
    
    # Build Docker images
    log "Building Docker images..."
    docker-compose build --no-cache
    log_success "Docker images built"
}

# Deploy function
deploy() {
    log "🚀 Starting deployment..."
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose down --remove-orphans || true
    
    # Start services
    log "Starting services..."
    if [ "$ENVIRONMENT" = "development" ]; then
        docker-compose --profile dev up -d
    else
        docker-compose up -d
    fi
    
    log_success "Services started"
    
    # Wait for services to be ready
    log "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Health checks
    health_check "http://localhost:$BACKEND_PORT/api/health"
    
    log_success "Deployment completed successfully!"
}

# Rollback function
rollback() {
    log_warning "🔄 Rolling back deployment..."
    
    # Stop current containers
    docker-compose down
    
    # Start previous version (if available)
    # This would involve tagging and managing image versions
    log_warning "Rollback functionality requires version management implementation"
}

# Monitoring setup
setup_monitoring() {
    log "📊 Setting up monitoring..."
    
    if [ -f "docker-compose.monitoring.yml" ]; then
        docker-compose -f docker-compose.monitoring.yml up -d
        log_success "Monitoring services started"
        log "📈 Grafana: http://localhost:3001 (admin/cbmo4ers_admin)"
        log "📊 Prometheus: http://localhost:9090"
        log "🔔 Uptime Kuma: http://localhost:3002"
    else
        log_warning "Monitoring configuration not found"
    fi
}

# Cleanup function
cleanup() {
    log "🧹 Cleaning up..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove unused volumes (be careful in production)
    if [ "$ENVIRONMENT" = "development" ]; then
        docker volume prune -f
    fi
    
    log_success "Cleanup completed"
}

# Main deployment workflow
main() {
    log "🎯 CBMo4ers Crypto Dashboard Deployment"
    log "Environment: $ENVIRONMENT"
    log "Backend Port: $BACKEND_PORT"
    log "Frontend Port: $FRONTEND_PORT"
    
    # Trap for cleanup on exit
    trap cleanup EXIT
    
    case "${1:-deploy}" in
        "pre-check")
            pre_deployment_checks
            ;;
        "install")
            install_dependencies
            ;;
        "build")
            build_and_test
            ;;
        "deploy")
            pre_deployment_checks
            install_dependencies
            build_and_test
            deploy
            ;;
        "rollback")
            rollback
            ;;
        "monitoring")
            setup_monitoring
            ;;
        "health")
            health_check "http://localhost:$BACKEND_PORT/api/health"
            ;;
        "logs")
            docker-compose logs -f
            ;;
        "status")
            docker-compose ps
            ;;
        "stop")
            docker-compose down
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|monitoring|health|logs|status|stop|pre-check|install|build}"
            echo ""
            echo "Commands:"
            echo "  deploy     - Full deployment (default)"
            echo "  rollback   - Rollback to previous version"
            echo "  monitoring - Start monitoring services"
            echo "  health     - Check service health"
            echo "  logs       - View service logs"
            echo "  status     - Show service status"
            echo "  stop       - Stop all services"
            echo "  pre-check  - Run pre-deployment checks only"
            echo "  install    - Install dependencies only"
            echo "  build      - Build and test only"
            echo ""
            echo "Environment variables:"
            echo "  ENVIRONMENT   - deployment environment (production|development)"
            echo "  BACKEND_PORT  - backend service port (default: 5001)"
            echo "  FRONTEND_PORT - frontend service port (default: 3000)"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
