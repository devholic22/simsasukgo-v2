export const DEFAULT_TRIP_TITLE = '나의 첫 여행';
export const DEFAULT_TRIP_DURATION_DAYS = 2;

export const DEFAULT_VISITED_DISPLAY_MODE = 'gray' as const;
export const DEFAULT_RADIUS_PRESET = 100 as const;
export const DEFAULT_AUTO_SYNC_ENABLED = true;
export const DEFAULT_AUTO_SYNC_INTERVAL_MIN = 30;

export const TRIP_DETAIL_SELECT_COLUMNS =
  'id,user_id,title,start_date,end_date,base_location,created_at,updated_at';
export const PREFERENCE_DETAIL_SELECT_COLUMNS =
  'id,user_id,visited_display_mode,radius_preset,auto_sync_enabled,auto_sync_interval_min,updated_at';
export const TRIP_EXISTENCE_SELECT_COLUMNS = 'id';
