export interface EaasConfig {
  delivery_config: {
    onClientRequest: {
      features: {
        caching?: { rules: CachingRule[] };
        headers?: { set_response_headers: HeaderRule[] };
      };
    };
  };
}

export interface CachingRule {
  args: {
    ttl_seconds?: number;
    must_revalidate?: boolean;
    honor_origin?: boolean;
    bypass?: boolean;
    no_store?: boolean;
  };
  matchAll?: MatchConditions;
  matchAny?: MatchConditions;
  matchNone?: MatchConditions;
  tags?: string[];
}

export interface MatchConditions {
  reqheader_wildcard_values?: Record<string, string[]>;
  "!reqheader_wildcard_values"?: Record<string, string[]>;
  reqheader?: Record<string, string[]>;
  "!reqheader"?: Record<string, string[]>;
  reqheader_startswith_values?: Record<string, string[]>;
  "!reqheader_startswith_values"?: Record<string, string[]>;
  reqheader_full_values?: Record<string, string[]>;
  "!reqheader_full_values"?: Record<string, string[]>;
  reqheader_values?: Record<string, string[]>;
  "!reqheader_values"?: Record<string, string[]>;
  query_wildcard_values?: Record<string, string[]>;
  "!query_wildcard_values"?: Record<string, string[]>;
  query?: Record<string, string[]>;
  "!query"?: Record<string, string[]>;
  query_startswith_values?: Record<string, string[]>;
  "!query_startswith_values"?: Record<string, string[]>;
  query_full_values?: Record<string, string[]>;
  "!query_full_values"?: Record<string, string[]>;
  query_values?: Record<string, string[]>;
  "!query_values"?: Record<string, string[]>;
  query_exists?: string[];
  "!query_exists"?: string[];
  paths?: string[];
  "!paths"?: string[];
  paths_startswith?: string[];
  "!paths_startswith"?: string[];
  paths_full?: string[];
  "!paths_full"?: string[];
  paths_wildcard?: string[];
  "!paths_wildcard"?: string[];
  geo_country?: string[];
  "!geo_country"?: string[];
  geo?: string[];
  "!geo"?: string[];
  ipv4?: string[];
  "!ipv4"?: string[];
  ipv6?: string[];
  "!ipv6"?: string[];
  cookie_name_startswith?: string[];
  "!cookie_name_startswith"?: string[];
  cookie_name_wildcard?: string[];
  "!cookie_name_wildcard"?: string[];
  cookie_name?: string[];
  "!cookie_name"?: string[];
  protocol?: string[];
  "!protocol"?: string[];
  scheme?: string[];
  "!scheme"?: string[];
  extension?: string[];
  "!extension"?: string[];
  method?: string[];
  "!method"?: string[];
  asn?: string[];
  "!asn"?: string[];
  asn_equals?: string[];
  "!asn_equals"?: string[];
}

export interface HeaderRule {
  matchAll?: MatchConditions;
  args: {
    add_headers?: Record<string, string>;
    remove_headers?: string[];
  };
}
