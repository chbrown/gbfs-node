/** ID fields in the document should be represented as strings that identify that particular object. They:
- must be unique within like fields (bike_id must be unique among bikes)
- do not have to be globally unique
- must not contain spaces
- should be persistent for a given object (station, plan, etc) */
export type StringID = string
/** Time stamp fields must be represented as integers in POSIX time (i.e., the number of seconds since January 1st 1970 00:00:00 UTC) */
export type Timestamp = number
/** The value must be a fully qualified URL that includes http:// or https://, and any special characters in the URL must be correctly escaped.
See http://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values */
export type URL = string

export enum Bit {
  True  = 1,
  False = 0,
}

export enum FeedType {
  SystemInformation  = 'system_information',
  StationInformation = 'station_information',
  StationStatus      = 'station_status',
  FreeBikeStatus     = 'free_bike_status',
  SystemHours        = 'system_hours',
  SystemCalendar     = 'system_calendar',
  SystemRegions      = 'system_regions',
  SystemPricingPlans = 'system_pricing_plans',
  SystemAlerts       = 'system_alerts',
}

export interface Feed {
  /** Key identifying the type of feed this is */
  name: FeedType
  /** Full URL for the feed */
  url: URL
}

export interface LanguageData {
  /** An array of all of the feeds that are published by this auto-discovery file */
  feeds: Feed[]
}

export interface AutoDiscoveryData {
  /** The language that all of the contained files will be published in.
  This language must match the value in the system_information file */
  [language: string]: LanguageData
}

export interface SystemInformationData {
  /** ID field - identifier for this bike share system.
  This should be globally unique (even between different systems) and it is currently up to the publisher of the feed to guarantee uniqueness.
  In addition, this value is intended to remain the same over the life of the system */
  system_id: StringID
  /** An IETF language tag indicating the language that will be used throughout the rest of the files.
  This is a string that defines a single language tag only.
  See https://tools.ietf.org/html/bcp47 and https://en.wikipedia.org/wiki/IETF_language_tag for details about the format of this tag */
  language: string
  /** Full name of the system to be displayed to customers */
  name: string
  /** Optional abbreviation for a system */
  short_name?: string
  /** Name of the operator of the system */
  operator?: string
  /** The URL of the bike share system. */
  url?: URL
  /** A fully qualified URL where a customer can purchase a membership or learn more about purchasing memberships */
  purchase_url?: URL
  /** String in the form YYYY-MM-DD representing the date that the system began operations */
  start_date?: string
  /** A single voice telephone number for the specified system.
  This field is a string value that presents the telephone number as typical for the system's service area.
  It can and should contain punctuation marks to group the digits of the number.
  Dialable text (for example, Capital Bikeshare's "877-430-BIKE") is permitted, but the field must not contain any other descriptive text */
  phone_number?: string
  /** A single contact email address for customers to address questions about the system */
  email?: string
  /** The time zone where the system is located.
  Time zone names never contain the space character but may contain an underscore.
  Please refer to the "TZ" value in https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for a list of valid values */
  timezone: string
  /** A fully qualified URL of a page that defines the license terms for the GBFS data for this system,
  as well as any other license terms the system would like to define (including the use of corporate trademarks, etc) */
  license_url?: URL
}

export enum RentalMethod {
  /** (i.e. operator issued bike key / fob / card) */
  Key           = 'KEY',
  CreditCard    = 'CREDITCARD',
  PayPass       = 'PAYPASS',
  ApplePay      = 'APPLEPAY',
  AndroidPay    = 'ANDROIDPAY',
  TransitCard   = 'TRANSITCARD',
  AccountNumber = 'ACCOUNTNUMBER',
  Phone         = 'PHONE',
}

export interface StationInformation {
  /** Unique identifier of a station */
  station_id: StringID
  /** Public name of the station */
  name: string
  /** Short name or other type of identifier, as used by the data publisher */
  short_name?: string
  /** The latitude of station.
  The field value must be a valid WGS 84 latitude in decimal degrees format.
  See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees */
  lat: number
  /** The longitude of station.
  The field value must be a valid WGS 84 longitude in decimal degrees format.
  See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees */
  lon: number
  /** Valid street number and name where station is located.
  This field is intended to be an actual address, not a free form text description (see "cross_street" below) */
  address?: string
  /** Cross street of where the station is located.
  This field is intended to be a descriptive field for human consumption.
  In cities, this would be a cross street, but could also be a description of a location in a park, etc. */
  cross_street?: string
  /** ID of the region where station is located */
  region_id?: StringID
  /** Postal code where station is located */
  post_code?: string
  /** Array of enumerables containing the payment methods accepted at this station.
  This list is intended to be as comprehensive at the time of publication as possible but is subject to change */
  rental_methods?: RentalMethod[]
  /** Number of total docking points installed at this station, both available and unavailable */
  capacity?: number
}

export interface StationInformationData {
  /** Array that contains one object per station in the system */
  stations: StationInformation[]
}

export interface StationStatus {
  /** Unique identifier of a station */
  station_id: StringID
  /** Number of bikes available for rental */
  num_bikes_available: number
  /** Number of disabled bikes at the station.
  Vendors who do not want to publicize the number of disabled bikes or docks in their system can opt to omit station capacity
  (in station_information), num_bikes_disabled and num_docks_disabled.
  If station capacity is published then broken docks/bikes can be inferred
  (though not specifically whether the decreased capacity is a broken bike or dock) */
  num_bikes_disabled?: number
  /** Number of docks accepting bike returns */
  num_docks_available: number
  /** Number of empty but disabled dock points at the station.
  This value remains as part of the spec as it is possibly useful during development */
  num_docks_disabled?: number
  /** 1/0 boolean - is the station currently on the street */
  is_installed: Bit
  /** 1/0 boolean - is the station currently renting bikes
  (even if the station is empty, if it is set to allow rentals this value should be 1) */
  is_renting: Bit
  /** 1/0 boolean - is the station accepting bike returns
  (if a station is full but would allow a return if it was not full then this value should be 1) */
  is_returning: Bit
  /** Integer POSIX timestamp indicating the last time this station reported its status to the backend */
  last_reported: Timestamp
}

export interface StationStatusData {
  /** Array that contains one object per station in the system */
  stations: StationStatus[]
}

export interface BikeStatus {
  /** Unique identifier of a bike */
  bike_id: StringID
  /** Latitude of the bike.
  The field value must be a valid WGS 84 latitude in decimal degrees format.
  See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees */
  lat: number
  /** Longitude of the bike.
  The field value must be a valid WGS 84 latitude in decimal degrees format.
  See: http://en.wikipedia.org/wiki/World_Geodetic_System, https://en.wikipedia.org/wiki/Decimal_degrees */
  lon: number
  /** 1/0 value - is the bike currently reserved for someone else */
  is_reserved: Bit
  /** 1/0 value - is the bike currently disabled (broken) */
  is_disabled: Bit
}

/** Describes bikes that are not at a station and are not currently in the middle of an active ride */
export interface FreeBikeStatusData {
  /** Array that contains one object per bike that is currently docked/stopped outside of the system */
  bikes: BikeStatus[]
}

export enum UserType {
  Member    = "member",
  Nonmember = "nonmember",
}

export enum Day {
  Monday    = 'mon',
  Tuesday   = 'tue',
  Wednesday = 'wed',
  Thursday  = 'thu',
  Friday    = 'fri',
  Saturday  = 'sat',
  Sunday    = 'sun',
}

export interface SystemHours {
  /** An array of "member" and "nonmember" values.
  This indicates that this set of rental hours applies to either members or non-members only. */
  user_types: UserType[]
  /** An array of abbreviations (first 3 letters) of English names of the days of the week that this hour object applies to
  Each day can only appear once within all of the hours objects in this feed. */
  days: Day[]
  /** Start time for the hours of operation of the system in the time zone indicated in system_information.json (00:00:00 - 23:59:59) */
  start_time: string
  /** End time for the hours of operation of the system in the time zone indicated in system_information.json (00:00:00 - 47:59:59).
  Time can stretch up to one additional day in the future to accommodate situations where,
  for example, a system was open from 11:30pm - 11pm the next day (i.e. 23:30-47:00) */
  end_time: string
}

/** Describes the system hours of operation. */
export interface SystemHoursData {
  /** Array of hour objects.
  Can contain a minimum of one object identifying hours for all days of the week
  or a maximum of fourteen hour objects are allowed (one for each day of the week for each "member" or "nonmember" user type) */
  rental_hours: SystemHours[]
}

export interface SystemCalendar {
  /** Starting month for the system operations (1-12) */
  start_month: number
  /** Starting day for the system operations (1-31) */
  start_day: number
  /** Starting year for the system operations */
  start_year?: number
  /** Ending month for the system operations (1-12) */
  end_month: number
  /** Ending day for the system operations (1-31) */
  end_day: number
  /** Ending year for the system operations */
  end_year?: number
}

/** Describes the operating calendar for a system.
An array of year objects defined as follows (if start/end year are omitted,
then assume the start and end months do not change from year to year). */
export interface SystemCalendarData {
  /** Array of year objects describing the system operational calendar.
  A minimum of one calendar object is required, which could indicate a general calendar,
  or multiple calendars could be present indicating arbitrary start and end dates */
  calendars: SystemCalendar[]
}

export interface SystemRegion {
  /** Unique identifier for the region */
  region_id: StringID
  /** Public name for this region */
  name: string
}

export interface SystemRegionsData {
  /** Array of region objects */
  regions: SystemRegion[]
}

export interface PricingPlan {
  /** String - a unique identifier for this plan in the system */
  plan_id: StringID
  /** String - a fully qualified URL where the customer can learn more about this particular scheme */
  url?: URL
  /** Name of this pricing scheme */
  name: string
  /** Currency this pricing is in (ISO 4217 code: http://en.wikipedia.org/wiki/ISO_4217) */
  currency: string
  /** Fee for this pricing scheme.
  This should be in the base unit as defined by the ISO 4217 currency code
  with the appropriate number of decimal places and omitting the currency symbol.
  E.g. if the price is in US Dollars the price would be 9.95 */
  price: number
  /** 1/0 value:
  0 indicates that no additional tax will be added (either because tax is not charged, or because it is included)
  1 indicates that tax will be added to the base price */
  is_taxable: Bit
  /** Text field describing the particular pricing plan in human readable terms.
  This should include the duration, price, conditions, etc. that the publisher would like users to see.
  This is intended to be a human-readable description and should not be used for automatic calculations */
  description: string
}

export interface SystemPricingPlansData {
  /** Array of any number of plan objects */
  plans: PricingPlan[]
}

export enum AlertType {
  SystemClosure  = 'SYSTEM_CLOSURE',
  StationClosure = 'STATION_CLOSURE',
  StationMove    = 'STATION_MOVE',
  Other          = 'OTHER',
}

export interface AlertTime {
  /** Integer POSIX timestamp - required if container "times" key is present */
  start: Timestamp
  /** Integer POSIX timestamp - if there is currently no end time planned for the alert,
  this key can be omitted indicating that there is no currently scheduled end time for the alert */
  end?: Timestamp
}

export interface SystemAlert {
  /** ID - unique identifier for this alert */
  alert_id: StringID
  /** Enumerable */
  type: AlertType
  /** Array of hashes with the keys "start" and "end" indicating when the alert is in effect
  (e.g. when the system or station is actually closed, or when it is scheduled to be moved).
  If this array is omitted then the alert should be displayed as long as it is in the feed. */
  times?: AlertTime[]
  /** Array of strings - If this is an alert that affects one or more stations, include their ids, otherwise omit this field.
  If both station_ids and region_ids are omitted, assume this alert affects the entire system */
  station_ids?: StringID[]
  /** Array of strings - If this system has regions, and if this alert only affects certain regions,
  include their ids, otherwise, omit this field.
  If both station_ids and region_ids are omitted, assume this alert affects the entire system */
  region_ids?: StringID[]
  /** String - URL where the customer can learn more information about this alert, if there is one */
  url?: URL
  /** String - A short summary of this alert to be displayed to the customer */
  summary: string
  /** String - Detailed text description of the alert */
  description?: string
  /** Integer POSIX timestamp indicating the last time the info for the particular alert was updated */
  last_updated?: Timestamp
}

/** This file is an array of alert objects defined as below.
Obsolete alerts should be removed so the client application can safely present to the end user everything present in the feed.
The consumer could use the start/end information to determine if this is a past,
ongoing or future alert and adjust the presentation accordingly. */
export interface SystemAlertsData {
  /** Array - alert objects each indicating a separate system alert */
  alerts: SystemAlert[]
}

/** Every JSON file presented in this specification contains the same common header information
at the top level of the JSON response object */
export interface File<T> {
  /** Integer POSIX timestamp indicating the last time the data in this feed was updated */
  last_updated: Timestamp
  /** Integer representing the number of seconds before the data in this feed will be updated again
  0 if the data should always be refreshed */
  ttl: number
  /** JSON hash containing the data fields for this response */
  data: T
}

export type AutoDiscoveryFile      = File<AutoDiscoveryData>
export type SystemInformationFile  = File<SystemInformationData>
export type StationInformationFile = File<StationInformationData>
export type StationStatusFile      = File<StationStatusData>
export type FreeBikeStatusFile     = File<FreeBikeStatusData>
export type SystemHoursFile        = File<SystemHoursData>
export type SystemCalendarFile     = File<SystemCalendarData>
export type SystemRegionsFile      = File<SystemRegionsData>
export type SystemPricingPlansFile = File<SystemPricingPlansData>
export type SystemAlertsFile       = File<SystemAlertsData>
