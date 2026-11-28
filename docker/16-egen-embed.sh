#!/bin/sh
# EGEN — exécuté par l'entrypoint de l'image nginx au démarrage.
# Publie, à la racine du site, ce que le Core EGEN et le client SDK ont besoin de connaître de CETTE instance :
#   /egen-config.json        déclaration d'intégration (docs/integration-apps/17 §7 du Core) ; URL = CHARACTER_PUBLIC_URL
#   /egen-host-origins.json  origines du Shell autorisées (= CHARACTER_FRAME_ANCESTORS, validées par 15-egen-frame-ancestors)
# Variables vides : rien n'est publié (comportement d'origine, /egen-config.json répond 404).
set -eu

HTML_DIR="${EGEN_HTML_DIR:-/usr/share/nginx/html}"
TEMPLATE="${EGEN_CONFIG_TEMPLATE:-/etc/egen/egen-config.json.template}"

url="${CHARACTER_PUBLIC_URL:-}"
url="${url%/}"
if [ -n "$url" ]; then
  case "$url" in
    https://*) re='^https://[A-Za-z0-9.-]+(:[0-9]+)?$' ;;
    http://localhost*|http://127.0.0.1*) re='^http://(localhost|127\.0\.0\.1)(:[0-9]+)?$' ;;
    *) re='^$' ;;
  esac
  if ! printf '%s' "$url" | grep -Eq "$re"; then
    echo "CHARACTER_PUBLIC_URL : valeur refusée « $url » (https://hote[:port], ou http://localhost[:port])." >&2
    exit 1
  fi
  sed "s|__CHARACTER_PUBLIC_URL__|$url|" "$TEMPLATE" > "$HTML_DIR/egen-config.json"
fi

origins=""
for o in $(printf '%s' "${CHARACTER_FRAME_ANCESTORS:-}" | tr ',' ' '); do
  case "$o" in
    https://*) re='^https://[A-Za-z0-9.-]+(:[0-9]+)?$' ;;
    http://localhost*|http://127.0.0.1*) re='^http://(localhost|127\.0\.0\.1)(:[0-9]+)?$' ;;
    *) re='^$' ;;
  esac
  printf '%s' "$o" | grep -Eq "$re" || { echo "CHARACTER_FRAME_ANCESTORS : origine refusée « $o »." >&2; exit 1; }
  case " $origins " in *" \"$o\" "*) ;; *) origins="${origins:+$origins, }\"$o\"" ;; esac
done
printf '{ "hostOrigins": [%s] }\n' "$origins" > "$HTML_DIR/egen-host-origins.json"
