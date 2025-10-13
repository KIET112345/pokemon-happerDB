import fs from "fs";
import path from "path";
import { CachingRule, EaasConfig } from "../types/eaas-config";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const PAGES_DIR = path.join(ROOT, "pages");
const OUTPUT_FILE = path.join(ROOT, "tenant.example.json");

function discoverApiRoutes(): string[] {
  const apiDir = fs.existsSync(path.join(APP_DIR, "api"))
    ? path.join(APP_DIR, "api")
    : fs.existsSync(path.join(PAGES_DIR, "api"))
    ? path.join(PAGES_DIR, "api")
    : null;

  if (!apiDir) return [];

  const routes: string[] = [];

  function scan(dir: string, base = "/api") {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath, `${base}/${file}`);
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
        const route = `${base}/${file.replace(/\.(ts|js)$/, "")}`;
        routes.push(route.replace(/index$/, "")); // remove trailing index
      }
    }
  }

  scan(apiDir);
  return routes;
}

function buildEaasConfig(routes: string[]): EaasConfig {
  const cachingRules = buildCachingRules(
    routes,
    eaasConfig.delivery_config.onClientRequest.features.caching!.rules![0]
  );

  const headerRules = routes.map((route) => ({
    matchAll: {
      reqheader_full_values: { path: [route] },
    },
    args: {
      add_headers: {
        "x-edge-cache": "enabled",
        "x-route": route,
      },
      remove_headers: ["server"],
    },
  }));

  return {
    delivery_config: {
      onClientRequest: {
        features: {
          caching: { rules: cachingRules },
          headers: { set_response_headers: headerRules },
        },
      },
    },
  };
}

const eaasConfig: EaasConfig = {
  delivery_config: {
    onClientRequest: {
      features: {
        caching: {
          rules: [
            {
              args: {
                ttl_seconds: 3600,
                must_revalidate: false,
                honor_origin: true,
              },
              matchAll: {
                reqheader: { path: [] },
                "!reqheader": { path: [] },
                reqheader_wildcard_values: { "x-no-cache": ["1", "true"] },
                "!reqheader_wildcard_values": { "x-no-cache": ["1", "true"] },
                reqheader_startswith_values: { authorization: ["Bearer "] },
                "!reqheader_startswith_values": { authorization: ["Bearer "] },
                reqheader_full_values: { path: [] },
                "!reqheader_full_values": { path: [] },
                reqheader_values: { path: [] },
                "!reqheader_values": { path: [] },
                query_wildcard_values: { "x-no-cache": ["1", "true"] },
                "!query_wildcard_values": { "x-no-cache": ["1", "true"] },
                query: { path: [] },
                "!query": { path: [] },
                query_startswith_values: { authorization: ["Bearer "] },
                "!query_startswith_values": { authorization: ["Bearer "] },
                query_full_values: { path: [] },
                "!query_full_values": { path: [] },
                query_values: { path: [] },
                "!query_values": { path: [] },
                query_exists: [],
                "!query_exists": [],
                paths: [],
                "!paths": [],
                paths_startswith: [],
                "!paths_startswith": [],
                paths_full: [],
                "!paths_full": [],
                paths_wildcard: [],
                "!paths_wildcard": [],
                geo_country: [],
                "!geo_country": [],
                geo: [],
                "!geo": [],
                ipv4: [],
                "!ipv4": [],
                ipv6: [],
                "!ipv6": [],
                cookie_name_startswith: [],
                "!cookie_name_startswith": [],
                cookie_name: [],
                "!cookie_name": [],
                cookie_name_wildcard: [],
                "!cookie_name_wildcard": [],
                protocol: [],
                "!protocol": [],
                scheme: [],
                "!scheme": [],
                extension: [],
                "!extension": [],
                method: [],
                "!method": [],
                asn: [],
                "!asn": [],
              },
              matchAny: {},
              matchNone: {},
              tags: ["auto-generated", "api-cache"],
            },
          ],
        },
      },
    },
  },
};

/**
 * Builds caching rules dynamically based on the shape of the provided template.
 */
export function buildCachingRules(
  routes: string[],
  baseRuleTemplate: CachingRule
): CachingRule[] {
  return routes.map((route) => {
    const rule: CachingRule = {} as CachingRule;

    for (const [key, value] of Object.entries(baseRuleTemplate)) {
      if (key === "args") {
        rule.args = { ...value };
      } else if (key.startsWith("match")) {
        // Dynamically handle matchAll, matchAny, matchNone
        const matchValue: any = {};
        const matchAnyValue: any = {};
        const matchNoneValue: any = {};
        for (const [condKey, condVal] of Object.entries(value as object)) {
          // Replace paths dynamically with the route
          matchValue[condKey] = { ...(condVal as object), path: [route] };
          matchAnyValue[condKey] = { ...(condVal as object), path: [route] };
          matchNoneValue[condKey] = { ...(condVal as object), path: [route] };
        }
        (rule as any)[key] = matchValue;
      } else {
        // Copy other fields (like tags)
        (rule as any)[key] = value;
      }
    }

    return rule;
  });
}

function main() {
  const routes = discoverApiRoutes();
  if (routes.length === 0) {
    console.warn("⚠️  No API routes found in pages/api or app/api.");
    return;
  }

  const config = buildEaasConfig(routes);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(config, null, 2));
  console.log(`✅ Tenant file generated at: ${OUTPUT_FILE}`);
  console.log(`📦 Found ${routes.length} API routes`);
}

main();
