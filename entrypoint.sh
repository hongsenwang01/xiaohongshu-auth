#!/bin/bash

set -e

# 默认为生产环境
app_env=${1:-production}

# Production environment commands
prod_commands() {
    echo "Starting Next.js production server..."
    pnpm run start
}

# Check if build exists in production mode
check_production_build() {
    if [ ! -d ".next" ]; then
        echo "❌ Error: Production build not found (.next directory missing)"
        echo ""
        echo "Please build the application first:"
        echo "  ./build"
        echo ""
        exit 1
    fi
}

# Check environment variables to determine the running environment
case "$app_env" in
    production|prod)
        echo "🚀 Production environment detected"
        check_production_build
        prod_commands
        ;;
    development|dev)
        echo "⚙️ Development environment detected"
        echo "Running Next.js development server..."
        pnpm run dev
        ;;
    *)
        echo "Usage: ./entrypoint.sh [production|development]"
        echo ""
        echo "Default: production (requires ./build to be run first)"
        exit 1
        ;;
esac
