#!/bin/bash

# Detect if we're running in Git Bash on Windows
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

if ! command -v yamllint >/dev/null 2>&1; then
    echo "YamlLint CLI tool is not installed, aborting yaml linter."
    if [ "$IS_WINDOWS" = false ]; then
        echo "If you want to install it, you can run 'brew install yamllint' (macOS)"
        echo "or 'pip install yamllint' (Linux/macOS/Windows)"
    else
        echo "You can install it with: pip install yamllint"
        echo "Or via Chocolatey: choco install yamllint"
    fi
    exit 0
fi

if [ "$#" -eq 0 ]; then
    files="."
else
    # Handle Windows paths in Git Bash by converting them to Unix-style paths
    if [ "$IS_WINDOWS" = true ]; then
        # Get current directory in Unix format
        current_dir=$(pwd -W 2>/dev/null || pwd)
        files=""
        for file in "$@"; do
            # Convert Windows path to Unix path if needed
            if [[ "$file" == *\\* ]]; then
                file=$(echo "$file" | sed 's/\\/\//g')
            fi
            # Remove current directory prefix if present
            relative_file="${file#$current_dir/}"
            files="$files $relative_file"
        done
    else
        current_dir=$(pwd)
        files=""
        for file in "$@"; do
            relative_file="${file#$current_dir/}"
            files="$files $relative_file"
        done
    fi
fi

# Run yamllint with the processed files
yamllint $files
