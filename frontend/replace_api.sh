#!/bin/bash
# replace_api.sh
# Fully replace /api calls and insert import api from lib/api

echo "Creating backup of all .js and .jsx files..."
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec cp {} {}.bak \;

echo "Replacing fetch('/api/...') with api.get(...)..."
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i -E "s#fetch\(['\"]\/api([^'\"]*)['\"]\)#const { data } = await api.get('\1')#g" {} \;

echo "Replacing axios.get/post/put/delete('/api/...') with api calls..."
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i -E "s#axios\.(get|post|put|delete)\(['\"]\/api([^'\"]*)['\"](,[^\)]*)?\)#await api.\1('\2'\3)#g" {} \;

echo "Replacing remaining '/api/...' strings inside code..."
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i -E "s#['\"]/api([^'\"]*)['\"]#'\1'#g" {} \;

echo "Inserting import api from '../lib/api' where missing..."
# This checks if file has 'api.' usage and missing import
find . -type f \( -name "*.js" -o -name "*.jsx" \) | while read file; do
  if grep -q "api\." "$file" && ! grep -q "import api from" "$file"; then
    sed -i "1i import api from '../lib/api';" "$file"
  fi
done

echo "✅ Done! All /api calls replaced and import statements inserted."
