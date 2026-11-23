import { Type } from '@egen-civitas/esm-framework';

// Configuration runtime de l'app (par instance de Core, sans reconstruire le paquet).
// Exemple, dans la configuration du Core :
//   "@civitas/esm-character-app": { "characterUrl": "https://design.exemple.org" }
// La validité (https, pas d'identifiants dans l'URL…) est vérifiée par `normalizeConfig` (embed.ts).
export const configSchema = {
  characterUrl: {
    _type: Type.String,
    _default: '',
    _description:
      "URL publique de l'instance EGEN Character Factory (https obligatoire ; http toléré uniquement pour localhost). Obligatoire.",
  },
  title: {
    _type: Type.String,
    _default: 'EGEN Character Factory',
    _description: "Titre accessible de l'iframe (lecteurs d'écran).",
  },
  heightOffset: {
    _type: Type.Number,
    _default: 0,
    _description:
      "Hauteur en pixels à laisser libre sous l'iframe (ex. un pied de page fixe). 0 = toute la hauteur visible.",
  },
};

export interface ConfigSchema {
  characterUrl: string;
  title: string;
  heightOffset: number;
}
