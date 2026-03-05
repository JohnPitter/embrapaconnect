export interface AvatarConfig {
  skinTone: string;
  eyeShape: "round" | "almond" | "large" | "small";
  eyeColor: string;
  bodyType: "slim" | "medium" | "robust";
  glasses: "none" | "round" | "square" | "aviator";
  hat: "none" | "straw" | "cap" | "cangaceiro" | "cowboy";
}

export const SKIN_TONES = [
  "#FDDBB4", "#F5C59F", "#D4A574", "#C68642", "#8D5524", "#3B2314",
];

export const EYE_COLORS = [
  "#3E2723", "#4E342E", "#2E7D32", "#1565C0", "#F57F17", "#455A64",
];

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: "#D4A574",
  eyeShape: "round",
  eyeColor: "#3E2723",
  bodyType: "medium",
  glasses: "none",
  hat: "straw",
};

export const HAT_LABELS: Record<AvatarConfig["hat"], string> = {
  none: "Nenhum",
  straw: "Palha",
  cap: "Boné",
  cangaceiro: "Cangaceiro",
  cowboy: "Cowboy",
};

export const GLASSES_LABELS: Record<AvatarConfig["glasses"], string> = {
  none: "Nenhum",
  round: "Redondo",
  square: "Quadrado",
  aviator: "Aviador",
};

export const BODY_TYPE_LABELS: Record<AvatarConfig["bodyType"], string> = {
  slim: "Esbelto",
  medium: "Médio",
  robust: "Robusto",
};

export const EYE_SHAPE_LABELS: Record<AvatarConfig["eyeShape"], string> = {
  round: "Redondo",
  almond: "Amendoado",
  large: "Grande",
  small: "Pequeno",
};
