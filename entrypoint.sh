#!/bin/sh

set -euf

target=/usr/share/nginx/html/index.html
echo "Replacing values in '${target}'"

sed -i "s+window.API_ROOT = null;+window.API_ROOT = \"${API_ROOT}\";+" "${target}"
echo "  - Set API_ROOT = \"${API_ROOT}\""

echo "Replacements done. Executing NGINX process."

# The `-g 'daemon off';` argument is important so that NGINX runs in the
# foreground like Docker expects.`
exec nginx -g 'daemon off;'
