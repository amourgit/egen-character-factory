import { getEmbedLifecycle } from '@egen-civitas/esm-nextjs-utils';
import { resolveMountTarget } from '@egen-civitas/esm-integration-utils';
import type { LifeCycles } from 'single-spa';
import type { ConfigSchema } from './config-schema';

/**
 * Droits du bac à sable de l'iframe. Plus larges que le défaut de `esm-nextjs-utils` parce que EGEN Character Factory en a
 * besoin : exports (téléchargements), boîtes de dialogue, liens externes (hors bac à sable). EGEN Character Factory reste sur
 * SA propre origine (domaine distinct du Core) : `allow-same-origin` ne lui donne que son propre stockage.
 */
export const IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals';

/** Permissions de l'iframe : copier-coller de formes et plein écran (non couverts par `sandbox`). */
export const IFRAME_ALLOW = 'clipboard-read; clipboard-write; fullscreen';

/** Hauteur plancher de l'iframe (px) : EGEN Character Factory n'est pas utilisable en dessous. */
export const MIN_HEIGHT = 480;

export interface NormalizedConfig {
  url: string;
  origin: string;
  title: string;
  heightOffset: number;
}

export class CharacterConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CharacterConfigError';
  }
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Valide et normalise la configuration. Refuse tout ce qui rendrait l'embarquement dangereux ou inopérant :
 * URL absente ou illisible, schéma autre que https (http seulement vers l'hôte local, pour le développement),
 * identifiants dans l'URL, titre ou décalage invalides.
 */
export function normalizeConfig(raw: Partial<ConfigSchema> | undefined | null): NormalizedConfig {
  const characterUrl = typeof raw?.characterUrl === 'string' ? raw.characterUrl.trim() : '';
  if (!characterUrl) {
    throw new CharacterConfigError("« characterUrl » n'est pas défini : renseigner l'URL de l'instance EGEN Character Factory.");
  }

  let parsed: URL;
  try {
    parsed = new URL(characterUrl);
  } catch {
    throw new CharacterConfigError(`« characterUrl » n'est pas une URL valide : ${characterUrl}`);
  }

  const isHttps = parsed.protocol === 'https:';
  const isLocalHttp = parsed.protocol === 'http:' && LOCAL_HOSTS.has(parsed.hostname);
  if (!isHttps && !isLocalHttp) {
    throw new CharacterConfigError('« characterUrl » doit être en https (http est toléré uniquement pour localhost).');
  }
  if (parsed.username || parsed.password) {
    throw new CharacterConfigError('« characterUrl » ne doit contenir ni identifiant ni mot de passe.');
  }

  const title = typeof raw?.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : 'EGEN Character Factory';

  const offset = raw?.heightOffset ?? 0;
  if (typeof offset !== 'number' || !Number.isFinite(offset) || offset < 0 || offset > 2000) {
    throw new CharacterConfigError('« heightOffset » doit être un nombre entre 0 et 2000.');
  }

  return { url: parsed.href, origin: parsed.origin, title, heightOffset: offset };
}

export interface CharacterLifecycleOptions {
  moduleName: string;
  featureName: string;
  /** Lecture de la configuration runtime (au montage, pour prendre en compte les changements). */
  readConfig: () => Promise<Partial<ConfigSchema> | undefined | null>;
}

/** Affiche un message d'erreur accessible dans la zone de montage (plutôt qu'un écran vide). */
function showError(target: HTMLElement, message: string): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('role', 'alert');
  el.style.cssText = 'padding:1rem;margin:1rem;border:1px solid currentColor;border-radius:4px';
  el.textContent = `EGEN Character Factory n'est pas disponible : ${message}`;
  target.appendChild(el);
  return el;
}

/**
 * Lifecycle Single-SPA de l'app : lit la configuration, délègue l'embarquement à `getEmbedLifecycle`
 * (esm-nextjs-utils : origine explicite, bac à sable, messages vérifiés), puis ajuste l'iframe à EGEN Character Factory :
 * permissions presse-papiers et hauteur = espace visible (EGEN Character Factory occupe toute la fenêtre et n'annonce pas sa hauteur).
 * Aucune donnée de session n'est transmise (`sessionFields: []`) : EGEN Character Factory a sa propre authentification.
 */
export function createCharacterLifecycle(options: CharacterLifecycleOptions): LifeCycles {
  const active = new Map<string, () => Promise<void>>();

  return {
    bootstrap: () => Promise.resolve(),

    mount: async (props: any) => {
      const target = resolveMountTarget(props);
      const key = String(props.name);

      let cfg: NormalizedConfig;
      try {
        cfg = normalizeConfig(await options.readConfig());
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[egen] ${options.moduleName} : ${message}`);
        const el = showError(target, message);
        active.set(key, () => {
          el.remove();
          return Promise.resolve();
        });
        return;
      }

      const embed = getEmbedLifecycle({
        moduleName: options.moduleName,
        featureName: options.featureName,
        url: cfg.url,
        allowedOrigin: cfg.origin,
        sandbox: IFRAME_SANDBOX,
        title: cfg.title,
        minHeight: MIN_HEIGHT,
        sessionFields: [],
      });
      await (embed.mount as (p: any) => Promise<void>)(props);

      const iframe = Array.from(target.children)
        .filter((child): child is HTMLIFrameElement => child.tagName === 'IFRAME')
        .pop();

      let teardown: () => void = () => undefined;
      if (iframe) {
        iframe.setAttribute('allow', IFRAME_ALLOW);
        // Hauteur = espace visible DANS la zone de scroll du shell (#egen-scroll-region),
        // pas le viewport : le footer, la zone basse et les marges de la carte ne
        // doivent pas être couverts (sinon la zone parente scrolle).
        const region = iframe.closest('#egen-scroll-region');
        const fit = () => {
          const iframeRect = iframe.getBoundingClientRect();
          const regionRect = region?.getBoundingClientRect();
          const bottom = regionRect ? regionRect.bottom : window.innerHeight;
          const top = regionRect ? Math.max(iframeRect.top, regionRect.top) : Math.max(iframeRect.top, 0);
          const height = Math.floor(bottom - top - cfg.heightOffset);
          iframe.style.height = `${Math.max(MIN_HEIGHT, height)}px`;
        };
        fit();
        const frame = window.requestAnimationFrame(fit);
        window.addEventListener('resize', fit);
        // La hauteur de la zone change aussi sans resize fenêtre (topbar, footer,
        // workbench) : on observe la zone elle-même.
        const observer = region && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
        observer?.observe(region as Element);
        teardown = () => {
          window.cancelAnimationFrame(frame);
          window.removeEventListener('resize', fit);
          observer?.disconnect();
        };
      }

      active.set(key, async () => {
        teardown();
        await (embed.unmount as (p: any) => Promise<void>)(props);
      });
    },

    unmount: async (props: any) => {
      const key = String(props.name);
      const stop = active.get(key);
      if (stop) {
        active.delete(key);
        await stop();
      }
    },
  } as LifeCycles;
}
