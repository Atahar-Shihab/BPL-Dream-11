// Centralized asset paths with base URL support for portable deployments

export const getAssetUrl = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

export const USER_PLACEHOLDER = getAssetUrl('assets/user.png');
export const LOGO_IMG = getAssetUrl('assets/logo.png');
export const LOGO_FOOTER = getAssetUrl('assets/logo-footer.png');
export const DATA_JSON_URL = getAssetUrl('data.json');
export const CURRENCY_IMG = getAssetUrl('assets/Currency.png');
export const BANNER_MAIN_IMG = getAssetUrl('assets/banner-main.png');
export const BG_SHADOW_IMG = getAssetUrl('assets/bg-shadow.png');
