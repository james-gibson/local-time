#!/bin/bash

# Git Commit Script following Conventional Commits specification
# This script creates logical groupings of staged changes and commits them with proper messages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Analyzing staged changes...${NC}"

# Check if there are staged changes
if ! git diff --cached --quiet; then
    echo -e "${GREEN}✓ Found staged changes${NC}"
else
    echo -e "${RED}❌ No staged changes found. Please stage your changes first.${NC}"
    exit 1
fi

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only)
echo -e "${YELLOW}Staged files:${NC}"
echo "$STAGED_FILES" | sed 's/^/  /'

# Function to commit a group of files with a message
commit_group() {
    local type="$1"
    local scope="$2"
    local subject="$3"
    local files="$4"
    local body="$5"
    
    if [ -n "$files" ]; then
        echo -e "\n${BLUE}Committing: ${type}(${scope}): ${subject}${NC}"
        echo "Files: $files"
        
        # Stage only the specific files for this commit
        git reset --quiet
        echo "$files" | xargs git add
        
        # Create commit message
        local commit_msg="${type}(${scope}): ${subject}"
        if [ -n "$body" ]; then
            commit_msg="${commit_msg}\n\n${body}"
        fi
        
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓ Committed successfully${NC}"
    fi
}

# Analyze files and group them logically
CONFIG_FILES=""
CORE_FILES=""
QUERY_FILES=""
UTILS_FILES=""
MCP_FILES=""
TEMPORAL_FILES=""
DOCS_FILES=""
BUILD_FILES=""
TEST_FILES=""

while IFS= read -r file; do
    case "$file" in
        # Configuration files
        src/config/*)
            CONFIG_FILES="$CONFIG_FILES $file"
            ;;
        # Core type definitions and builders
        src/core/*)
            CORE_FILES="$CORE_FILES $file"
            ;;
        # Query and search functionality
        src/query/*)
            QUERY_FILES="$QUERY_FILES $file"
            ;;
        # Utility functions
        src/utils/*)
            UTILS_FILES="$UTILS_FILES $file"
            ;;
        # MCP server functionality
        src/config/mcp/*)
            MCP_FILES="$MCP_FILES $file"
            ;;
        # Temporal system files
        src/temporal-system.ts|src/zero-reference-queries.ts)
            TEMPORAL_FILES="$TEMPORAL_FILES $file"
            ;;
        # Main entry point
        src/index.ts)
            CORE_FILES="$CORE_FILES $file"
            ;;
        # Documentation
        *.md|docs/*)
            DOCS_FILES="$DOCS_FILES $file"
            ;;
        # Build and config files
        package.json|tsconfig.json|*.config.js|prisma/*)
            BUILD_FILES="$BUILD_FILES $file"
            ;;
        # Test files
        *test*|*spec*|__tests__/*)
            TEST_FILES="$TEST_FILES $file"
            ;;
        *)
            # Default to core for unmatched files
            CORE_FILES="$CORE_FILES $file"
            ;;
    esac
done <<< "$STAGED_FILES"

# Commit groups in logical order

# 1. Build and configuration changes first
if [ -n "$BUILD_FILES" ]; then
    commit_group "build" "deps" "update dependencies and build configuration" "$BUILD_FILES" "Update project dependencies, build scripts, and configuration files to support new features and improvements."
fi

# 2. Core type definitions and interfaces
if [ -n "$CORE_FILES" ]; then
    commit_group "feat" "core" "enhance universe type system and core interfaces" "$CORE_FILES" "Improve type definitions, universe builders, and core interfaces to support better type safety and extensibility."
fi

# 3. Temporal system enhancements
if [ -n "$TEMPORAL_FILES" ]; then
    commit_group "feat" "temporal" "improve temporal reference system" "$TEMPORAL_FILES" "Enhance temporal epoch handling, zero-reference queries, and time precision management for better temporal modeling."
fi

# 4. Configuration system improvements
if [ -n "$CONFIG_FILES" ]; then
    commit_group "feat" "config" "enhance configuration loading and registry" "$CONFIG_FILES" "Improve universe configuration loading, registry management, and external config support."
fi

# 5. MCP server functionality
if [ -n "$MCP_FILES" ]; then
    commit_group "feat" "mcp" "add Model Context Protocol server support" "$MCP_FILES" "Implement MCP server capabilities for universe data access and tool integration."
fi

# 6. Query and search improvements
if [ -n "$QUERY_FILES" ]; then
    commit_group "feat" "query" "enhance universe search and windowing" "$QUERY_FILES" "Improve window-based search functionality and universe querying capabilities."
fi

# 7. Utility functions
if [ -n "$UTILS_FILES" ]; then
    commit_group "feat" "utils" "add utility functions and converters" "$UTILS_FILES" "Add KSUID conversion utilities and other helper functions for improved data handling."
fi

# 8. Documentation updates
if [ -n "$DOCS_FILES" ]; then
    commit_group "docs" "readme" "update project documentation" "$DOCS_FILES" "Update documentation to reflect new features, API changes, and usage examples."
fi

# 9. Test additions/updates
if [ -n "$TEST_FILES" ]; then
    commit_group "test" "coverage" "add tests for new functionality" "$TEST_FILES" "Add comprehensive tests for new features and improve test coverage."
fi

echo -e "\n${GREEN}🎉 All staged changes have been committed successfully!${NC}"
echo -e "${BLUE}📝 Summary of commits created:${NC}"
git log --oneline -10
