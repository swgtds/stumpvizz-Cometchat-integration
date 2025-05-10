
// CometChat configuration

export const COMETCHAT_CONSTANTS = {
    APP_ID: import.meta.env.VITE_COMETCHAT_APP_ID,
    REGION: import.meta.env.VITE_COMETCHAT_REGION,
    AUTH_KEY: import.meta.env.VITE_COMETCHAT_AUTH_KEY,
    REST_API_KEY: import.meta.env.VITE_COMETCHAT_REST_API_KEY
};
  
  export const COMETCHAT_GROUPS = {
    GLOBAL_GROUP: "global_group",
    LIVE_MATCH_PREFIX: "live_match_"
  };

  // api endpoints
  export const COMETCHAT_API = {
    CREATE_USER: (appId: string, region: string) => 
      `https://${appId}.api-${region}.cometchat.io/v3/users`
  };