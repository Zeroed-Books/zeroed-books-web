#!/bin/sh

set -euf

serve() {
    target=/usr/share/nginx/html/index.html
    echo "Replacing values in '${target}'"

    sed -i "s+window.API_ROOT = null;+window.API_ROOT = \"${API_ROOT}\";+" "${target}"
    echo "  - Set API_ROOT = \"${API_ROOT}\""

    echo -e "\n\nGenerating NGINX config:"
    envsubst '$DEPLOY_BUCKET $DEPLOY_BUCKET_ENDPOINT' < "/etc/nginx/conf.d/default.conf.tpl" | tee "/etc/nginx/conf.d/default.conf"

    echo "Replacements done. Executing NGINX process."

    # The `-g 'daemon off';` argument is important so that NGINX runs in the
    # foreground like Docker expects.`
    exec nginx -g 'daemon off;'
}

deploy() {
    cd /usr/share/nginx/html
    s3-copy \
        -bucket "${DEPLOY_BUCKET}" \
        -endpoint "${DEPLOY_BUCKET_ENDPOINT}"
}

the_command=$1
if [ -z "${the_command}" ]; then
    echo "A command is required. Either 'deploy' or 'serve'."
    exit 1
fi
shift

if [ "serve" = "${the_command}" ]; then
    serve
elif [ "deploy" = "${the_command}" ]; then
    deploy "${app_version}"
elif [ "deploy-and-serve" = "${the_command}" ]; then
    cat <<EOF
################################################################################
#                            Deploying Application                             #
################################################################################

EOF

    deploy "${app_version}"

    cat <<EOF

################################################################################
#                             Serving Application                              #
################################################################################
EOF

    serve
fi
