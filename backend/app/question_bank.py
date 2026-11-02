"""Deterministic, section-specific question bank for voice interview sessions."""

LEVELS = ("beginner", "intermediate", "advanced")
TIME_LIMITS = {"beginner": 45, "intermediate": 75, "advanced": 120}

# Each track has 25 distinct technical topics. The three prompts generated for
# each topic are independently worded for the selected difficulty, yielding
# exactly 75 unique questions per track and 300 total.
SECTION_SPECS = {
    "HTML, CSS & JavaScript": {
        "id": "web",
        "topics": [
            ("semantic HTML landmarks", "an accessible news article with navigation, a main region, and related stories", ["semantic", "landmark", "header", "navigation", "main", "article", "accessibility"]),
            ("accessible form labels and validation", "a signup form that must explain errors to keyboard and screen-reader users", ["label", "aria", "validation", "error", "form", "keyboard", "accessibility"]),
            ("the CSS box model", "a card whose width changes unexpectedly when padding and borders are added", ["box model", "box-sizing", "padding", "border", "margin", "content"]),
            ("Flexbox alignment", "a toolbar that must keep its actions aligned across narrow and wide screens", ["flexbox", "flex", "align", "justify", "wrap", "gap"]),
            ("CSS Grid layout", "a responsive dashboard with a main column, side panel, and cards", ["grid", "columns", "rows", "template", "responsive", "layout"]),
            ("media queries and breakpoints", "a page that should adapt smoothly from a phone to a desktop", ["media query", "breakpoint", "viewport", "responsive", "mobile", "desktop"]),
            ("mobile-first CSS", "a content-heavy page that should remain readable on small devices", ["mobile-first", "small screen", "progressive", "responsive", "viewport"]),
            ("the CSS cascade and specificity", "a component whose intended style is overridden by several selectors", ["cascade", "specificity", "inherit", "selector", "override", "important"]),
            ("CSS custom properties", "a product interface that supports multiple themes consistently", ["custom property", "variable", "theme", "var(", "inherit", "design token"]),
            ("stacking contexts and z-index", "a modal that appears behind a sticky navigation bar", ["z-index", "stacking context", "position", "transform", "layer", "overlay"]),
            ("sticky and fixed positioning", "a table of contents that stays visible without covering page content", ["sticky", "fixed", "position", "scroll", "offset", "overflow"]),
            ("responsive images and srcset", "a photo gallery that should load sharp images without wasting mobile data", ["srcset", "sizes", "responsive image", "picture", "resolution", "bandwidth"]),
            ("keyboard focus management", "a dialog that opens and closes while keeping keyboard users oriented", ["focus", "keyboard", "tab", "dialog", "escape", "focus trap"]),
            ("color contrast", "a chart and its labels that need to remain readable for different users", ["contrast", "wcag", "color", "ratio", "readable", "accessibility"]),
            ("DOM event bubbling and delegation", "a large list where each row has several interactive controls", ["event bubbling", "delegation", "target", "currenttarget", "listener", "propagation"]),
            ("the JavaScript event loop", "a page that schedules promise callbacks and timers while rendering", ["event loop", "microtask", "task", "promise", "settimeout", "callback"]),
            ("async fetch and request cancellation", "a search box that receives slow responses after the user changes the query", ["fetch", "async", "abortcontroller", "promise", "race", "request"]),
            ("closures and lexical scope", "a set of callbacks that must retain the correct item-specific value", ["closure", "lexical scope", "scope", "callback", "environment", "variable"]),
            ("immutable array updates", "a list in the interface that changes after an item is edited", ["immutable", "map", "filter", "spread", "mutation", "state"]),
            ("debouncing and throttling", "a type-ahead search that triggers too many expensive operations", ["debounce", "throttle", "timer", "input", "rate", "performance"]),
            ("lazy loading and code splitting", "a large page whose rarely used features slow its first visit", ["lazy", "loading", "code splitting", "dynamic import", "bundle", "performance"]),
            ("browser storage choices", "a small preference that should persist without exposing sensitive credentials", ["localstorage", "sessionstorage", "cookie", "storage", "sensitive", "credential"]),
            ("safe rendering of untrusted text", "a comment field where users can submit arbitrary markup", ["escape", "sanitize", "untrusted", "xss", "textcontent", "innerhtml"]),
            ("browser testing strategies", "a checkout form that must work across browsers and input methods", ["unit test", "integration", "browser test", "keyboard", "playwright", "coverage"]),
            ("Core Web Vitals", "a product page with layout shifts and slow interaction on mobile", ["lcp", "inp", "cls", "web vitals", "layout shift", "performance"]),
        ],
    },
    "React Native": {
        "id": "rn",
        "topics": [
            ("React Native core components", "a profile screen that should feel native on both iOS and Android", ["view", "text", "pressable", "component", "native", "ios", "android"]),
            ("React Native Flexbox", "a settings screen that must adapt to different phone sizes", ["flexbox", "flex", "align", "justify", "row", "column"]),
            ("safe areas and device insets", "a screen whose buttons are hidden behind a notch or system bar", ["safe area", "inset", "notch", "status bar", "edges", "layout"]),
            ("mobile navigation stacks", "an app with nested tabs, detail pages, and a sign-in flow", ["navigation", "stack", "tab", "route", "screen", "back"]),
            ("local component state", "an editable form with validation and a save action", ["state", "usestate", "component", "render", "update", "validation"]),
            ("shared app state and context", "several screens that need the same signed-in user preferences", ["context", "provider", "shared state", "store", "prop drilling", "reducer"]),
            ("server state and data fetching", "a list that needs loading, refresh, and error states", ["fetch", "api", "loading", "error", "cache", "server state"]),
            ("FlatList and virtualized lists", "a catalog containing thousands of products and images", ["flatlist", "virtualized", "keyextractor", "window", "renderitem", "list"]),
            ("image loading and caching", "a scrolling feed with many remote thumbnails", ["image", "cache", "resize", "placeholder", "memory", "network"]),
            ("platform-specific behavior", "a permission flow that differs between Android and iOS", ["platform", "android", "ios", "platform.select", "native", "permission"]),
            ("deep links and universal links", "an invitation URL that should open the correct app screen", ["deep link", "universal link", "scheme", "route", "intent", "navigation"]),
            ("runtime permissions", "a feature that needs camera or location access only when used", ["permission", "request", "denied", "rationale", "camera", "location"]),
            ("local and push notifications", "a reminder that should work when the app is foregrounded or closed", ["notification", "push", "token", "foreground", "background", "permission"]),
            ("secure storage on mobile", "an authentication token that must persist without plain-text preferences", ["secure storage", "keychain", "keystore", "token", "encrypt", "credential"]),
            ("offline-first mobile behavior", "a user who edits records while temporarily disconnected", ["offline", "queue", "sync", "conflict", "retry", "cache"]),
            ("network retries and cancellation", "a mobile request that times out when connectivity changes", ["retry", "timeout", "abort", "network", "backoff", "cancel"]),
            ("error boundaries and recovery", "one screen fails while the rest of the app should remain usable", ["error boundary", "fallback", "crash", "recover", "exception", "screen"]),
            ("gestures and touch interactions", "a swipeable card that must coexist with vertical scrolling", ["gesture", "swipe", "touch", "responder", "scroll", "conflict"]),
            ("mobile accessibility", "a custom control that needs to work with VoiceOver and TalkBack", ["accessibilitylabel", "accessibility role", "voiceover", "talkback", "screen reader", "accessible"]),
            ("native modules and bridges", "a product feature that depends on a device capability not exposed by the app layer", ["native module", "bridge", "turbo module", "native code", "platform api", "javascript"]),
            ("animations and the UI thread", "a transition that stutters while the JavaScript thread is busy", ["animation", "ui thread", "native driver", "worklet", "frame", "jank"]),
            ("React Native testing", "a critical checkout flow that needs reliable automated coverage", ["jest", "testing library", "detox", "unit test", "integration test", "mock"]),
            ("profiling React Native performance", "a screen that renders too often on a low-end device", ["profiler", "render", "memo", "profiling", "flipper", "performance"]),
            ("app lifecycle and background work", "an upload that should continue safely when a user switches apps", ["lifecycle", "background", "foreground", "appstate", "resume", "task"]),
            ("release builds and environment configuration", "a development build works but a store build fails to connect to its service", ["release", "build", "environment", "signing", "bundle", "configuration"]),
        ],
    },
    "Database": {
        "id": "db",
        "topics": [
            ("relational schemas and entities", "a course-registration system with students, courses, and enrollments", ["relational", "schema", "table", "entity", "relationship", "sql"]),
            ("primary and foreign key constraints", "orders that must always refer to a valid customer", ["primary key", "foreign key", "constraint", "referential integrity", "cascade", "relationship"]),
            ("normalization and denormalization", "a growing order database with repeated customer details", ["normalization", "denormalization", "normal form", "duplicate", "redundancy", "update anomaly"]),
            ("SQL joins", "a report that combines customers, orders, and payments", ["join", "inner join", "left join", "foreign key", "null", "sql"]),
            ("B-tree indexes", "a frequently filtered table whose reads have become slower", ["index", "btree", "lookup", "selectivity", "scan", "write"]),
            ("query plans and optimization", "a production query that scans millions of rows unexpectedly", ["query plan", "explain", "scan", "index", "optimizer", "execution plan"]),
            ("ACID transactions", "a bank transfer where both account updates must succeed together", ["acid", "atomic", "consistent", "isolation", "durable", "transaction"]),
            ("transaction isolation levels", "two users updating the same inventory at the same time", ["isolation", "read committed", "repeatable read", "serializable", "dirty read", "phantom"]),
            ("locking and deadlocks", "two services acquire rows in different orders during checkout", ["lock", "deadlock", "row lock", "timeout", "order", "concurrency"]),
            ("safe database migrations", "a production table needs a new required column without downtime", ["migration", "backfill", "schema change", "rollback", "expand", "contract"]),
            ("pagination strategies", "a user browses millions of records while new records are being added", ["pagination", "offset", "cursor", "keyset", "order by", "stable"]),
            ("aggregation and grouping", "a dashboard calculates monthly totals for each customer", ["aggregate", "group by", "sum", "count", "having", "query"]),
            ("relational versus document databases", "a product catalog has both fixed fields and flexible attributes", ["relational", "document", "nosql", "schema", "consistency", "query"]),
            ("MongoDB document modeling", "a social feed stores posts with comments and author references", ["mongodb", "document", "embed", "reference", "aggregation", "collection"]),
            ("NoSQL partition keys", "a key-value service is overloaded by a small number of hot accounts", ["partition key", "shard key", "hot key", "distribution", "partition", "throughput"]),
            ("Redis caching and expiration", "a read-heavy endpoint serves data that can be briefly stale", ["redis", "cache", "ttl", "expiration", "invalidation", "stale"]),
            ("replication and read consistency", "read replicas lag behind writes during an account update", ["replica", "replication", "lag", "consistency", "primary", "read"]),
            ("database sharding", "a single database node can no longer handle the application workload", ["sharding", "partition", "shard key", "rebalancing", "cross-shard", "scale"]),
            ("backup and point-in-time recovery", "an accidental update must be reversed without losing later valid writes", ["backup", "restore", "point-in-time", "recovery", "wal", "rpo"]),
            ("connection pooling", "a burst of application requests exhausts database connections", ["connection pool", "pool size", "connection", "queue", "timeout", "concurrency"]),
            ("parameterized queries", "a search endpoint passes user input into a SQL statement", ["parameterized", "prepared statement", "sql injection", "bind parameter", "query", "escape"]),
            ("database constraints and data integrity", "multiple services write records that must obey shared business rules", ["constraint", "unique", "check", "not null", "integrity", "validation"]),
            ("event sourcing and audit history", "a financial application must explain how an account balance changed", ["event sourcing", "event log", "audit", "projection", "replay", "immutable"]),
            ("database observability", "latency rises only at peak load and the root cause is unclear", ["latency", "metrics", "slow query", "logs", "monitoring", "throughput"]),
            ("data retention and archival", "old records must be retained for compliance without slowing active queries", ["retention", "archive", "partition", "delete", "compliance", "storage"]),
        ],
    },
    "Security for Web Applications": {
        "id": "security",
        "topics": [
            ("web application threat modeling", "a new payment workflow handles account and card-related data", ["threat model", "asset", "trust boundary", "attack surface", "mitigation", "risk"]),
            ("authentication and authorization", "a signed-in user tries to access another customer's invoice", ["authentication", "authorization", "identity", "permission", "access control", "role"]),
            ("secure session cookies", "a production login cookie should resist theft and cross-site use", ["httponly", "secure", "samesite", "cookie", "session", "csrf"]),
            ("cross-site request forgery", "a browser is tricked into submitting an account-change request", ["csrf", "cross-site request forgery", "token", "samesite", "origin", "referer"]),
            ("stored and reflected XSS", "a comment is shown to other users and may contain markup", ["xss", "cross-site scripting", "escape", "sanitize", "content security policy", "output"]),
            ("DOM-based cross-site scripting", "a URL fragment is inserted into a page by client-side code", ["dom xss", "textcontent", "innerhtml", "sink", "source", "sanitize"]),
            ("SQL injection defenses", "a login endpoint builds a query from a submitted username", ["sql injection", "parameterized", "prepared statement", "bind parameter", "orm", "input"]),
            ("server-side request forgery", "a URL-preview feature fetches links submitted by users", ["ssrf", "server-side request forgery", "allowlist", "private ip", "redirect", "egress"]),
            ("CORS policy", "a browser app on one domain needs limited access to an API on another", ["cors", "origin", "allow-origin", "preflight", "credentials", "allowlist"]),
            ("Content Security Policy", "an application wants to reduce the impact of injected scripts", ["content security policy", "csp", "nonce", "script-src", "report-only", "inline"]),
            ("TLS and transport security", "a service handles passwords and private records over public networks", ["tls", "https", "certificate", "hsts", "transport", "encryption"]),
            ("password hashing", "a user database must remain safe if its credential table is stolen", ["argon2", "bcrypt", "scrypt", "salt", "hash", "password"]),
            ("OAuth and OpenID Connect", "a web application adds third-party sign-in without handling provider passwords", ["oauth", "openid connect", "oidc", "state", "nonce", "redirect uri"]),
            ("rate limiting and abuse controls", "an unauthenticated endpoint is receiving credential-stuffing traffic", ["rate limit", "throttle", "credential stuffing", "ip", "account", "backoff"]),
            ("secure file uploads", "users may upload documents that are later viewed or downloaded", ["upload", "mime", "content type", "file signature", "size limit", "malware"]),
            ("secret management", "API keys are being copied into application source and build logs", ["secret", "vault", "environment", "rotation", "key", "repository"]),
            ("security logging and privacy", "an incident needs investigation without exposing user passwords or tokens", ["logging", "redact", "sensitive", "token", "audit", "retention"]),
            ("API input validation", "a public endpoint accepts nested JSON and untrusted identifiers", ["validation", "schema", "allowlist", "type", "length", "input"]),
            ("insecure direct object references", "an API accepts a record ID supplied by the caller", ["idor", "object reference", "ownership", "authorization", "identifier", "access check"]),
            ("clickjacking defenses", "a sensitive settings page might be embedded inside a hostile frame", ["clickjacking", "frame-ancestors", "x-frame-options", "iframe", "csp", "origin"]),
            ("dependency and software supply-chain risk", "a new transitive library has a published security advisory", ["dependency", "supply chain", "lockfile", "advisory", "patch", "sbom"]),
            ("session rotation and logout", "a user changes their password after an account compromise", ["session rotation", "revoke", "logout", "token", "invalidate", "credential"]),
            ("multi-factor authentication", "a privileged administrator account needs stronger protection", ["mfa", "multi-factor", "totp", "passkey", "recovery code", "phishing"]),
            ("safe error handling", "an application exception might reveal database or filesystem details", ["error handling", "stack trace", "exception", "generic response", "logging", "information disclosure"]),
            ("security headers", "a web application needs consistent browser-side defense defaults", ["security header", "hsts", "csp", "x-content-type-options", "referrer-policy", "permissions-policy"]),
        ],
    },
}


def _question(section: str, topic: str, scenario: str, difficulty: str) -> str:
    if difficulty == "beginner":
        if section == "HTML, CSS & JavaScript":
            return f"Explain {topic} in your own words. How would it help with {scenario}? Give one practical example."
        if section == "React Native":
            return f"What is {topic}, and when would it be useful for {scenario} in a mobile app?"
        if section == "Database":
            return f"What is {topic}, and how could it help with {scenario}? Explain one basic example."
        return f"What does {topic} mean, and what risk does it address when {scenario}? Describe one basic defense."
    if difficulty == "intermediate":
        if section == "HTML, CSS & JavaScript":
            return f"You need to deliver {scenario}. How would you apply {topic}, test the result, and handle one edge case?"
        if section == "React Native":
            return f"You are implementing {scenario} on Android and iOS. How would you use {topic}, handle platform differences, and test it?"
        if section == "Database":
            return f"A service needs {scenario}. How would you apply {topic}, keep the data correct, and validate performance?"
        return f"A web application needs {scenario}. How would you use {topic} to reduce risk, and how would you verify the defense?"
    if section == "HTML, CSS & JavaScript":
        return f"A high-traffic site has a failure involving {scenario}. How would you apply {topic}, investigate the root cause, and measure an accessible, performance-safe fix?"
    if section == "React Native":
        return f"A large mobile app has a failure involving {scenario}. How would you design with {topic} for reliability, profile bottlenecks, and handle offline or platform failures?"
    if section == "Database":
        return f"A production system is failing while {scenario}. How would you use {topic} under concurrent load, choose trade-offs, and recover safely?"
    return f"During a security review, a risk appears because {scenario}. How would you apply {topic}, contain the impact, and validate defense in depth?"


QUESTION_BANK = {}
for _section, _spec in SECTION_SPECS.items():
    _items = []
    for _difficulty in LEVELS:
        for _index, (_topic, _scenario, _signals) in enumerate(_spec["topics"], start=1):
            _items.append({
                "id": f"{_spec['id']}-{_difficulty[:3]}-{_index:02d}",
                "section": _section,
                "topic": _topic,
                "difficulty": _difficulty,
                "time_limit_seconds": TIME_LIMITS[_difficulty],
                "question": _question(_section, _topic, _scenario, _difficulty),
                "signals": _signals,
            })
    QUESTION_BANK[_section] = _items

assert len(QUESTION_BANK) == 4
assert all(len(items) == 75 and len({item["question"] for item in items}) == 75 for items in QUESTION_BANK.values())
assert sum(map(len, QUESTION_BANK.values())) == 300
