const LocalStorageConstants = {
  KEYS: {
    JWTToken: "JWTToken",
    user: "user",
    role: "role",
    org_id: "org_id",
    user_map: "user_map",
    error: "error",
    refresh_token: "refresh_token",
  },
  ROLES: {
    DATAHUB_ADMIN: "datahub_admin",
    DATAHUB_PARTICIPANT_ROOT: "datahub_participant_root",
    DATAHUB_CO_STEWARD: "datahub_co_steward",
  },
};

export default LocalStorageConstants;
