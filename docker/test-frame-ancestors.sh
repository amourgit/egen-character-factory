#!/bin/sh
# Vérifie le calcul de CHARACTER_FRAME_CSP, puis (si nginx est installé) le rendu et la validité de la configuration.
cd "$(dirname "$0")" || exit 1
fail=0
check() { # nom attendu valeur
  out=$(CHARACTER_FRAME_ANCESTORS="$3" sh -c '. ./15-egen-frame-ancestors.envsh && printf %s "$CHARACTER_FRAME_CSP"' 2>/dev/null); rc=$?
  if [ "$out" = "$2" ] && { [ "$2" = "ERR" ] && [ $rc -ne 0 ] || [ "$2" != "ERR" ] && [ $rc -eq 0 ]; } || { [ "$2" = "ERR" ] && [ $rc -ne 0 ]; }; then echo "ok   $1"; else echo "FAIL $1 (obtenu: '$out', rc=$rc)"; fail=1; fi
}
check "vide : aucun en-tête" "" ""
check "https" "frame-ancestors 'self' https://core.exemple.org" "https://core.exemple.org"
check "plusieurs + localhost" "frame-ancestors 'self' https://a.org http://localhost:3000" "https://a.org, http://localhost:3000"
check "http distant refusé" "ERR" "http://evil.com"
check "injection refusée" "ERR" "https://a.org;script-src"
check "schéma javascript refusé" "ERR" "javascript:alert(1)"
if command -v nginx >/dev/null 2>&1; then
  t=$(mktemp -d); CHARACTER_FRAME_CSP="frame-ancestors 'self' https://core.exemple.org" envsubst '${CHARACTER_FRAME_CSP}' < ../nginx.conf.template > "$t/default.conf"
  printf 'events{}\nhttp{ include /etc/nginx/mime.types; include %s; }\n' "$t/default.conf" > "$t/nginx.conf"
  if nginx -t -c "$t/nginx.conf" -e /dev/null >/dev/null 2>&1; then echo "ok   nginx -t"; else echo "FAIL nginx -t"; nginx -t -c "$t/nginx.conf" 2>&1 | tail -3; fail=1; fi
else echo "skip nginx -t (nginx absent)"; fi
exit $fail
