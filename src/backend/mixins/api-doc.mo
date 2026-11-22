mixin () {
  public query func getApiDoc() : async Text {
    "# 奶娃跑酷 Leaderboard API\n" #
    "\n" #
    "Backend for a three-lane runner game. It stores one anonymous global leaderboard of submitted runs. Game progress, coins and skins live only in the player's browser and are not part of this API.\n" #
    "\n" #
    "## Authentication and authorization\n" #
    "\n" #
    "- `submitScore`, `getLeaderboard` and `getEntryRank` need no sign-in. Anonymous callers are accepted and the caller principal is not recorded.\n" #
    "- No registration is required for leaderboard methods. The template access-control methods (`_initialize_access_control` and related role methods) exist but do not guard any leaderboard method.\n" #
    "- Identity: the app frontend pins an Internet Identity derivation origin, published at `/.well-known/ii-derivation-origin` when available. An agent holding the user's Internet Identity authorization derives the per-app principal against that origin (for example `icp identity link web <name> --app <host>`). Such a delegation acts with the user's full authority in this app until it expires. Leaderboard calls do not need it.\n" #
    "\n" #
    "## Types\n" #
    "\n" #
    "`LeaderboardEntry = { id : Nat; nickname : Text; score : Nat; distance : Nat; characterId : Text; skinId : Text; submittedAt : Int }`\n" #
    "\n" #
    "- `id`: unique, auto-incrementing, never reused.\n" #
    "- `distance`: meters run, as reported by the client.\n" #
    "- `characterId`: `naiwa` or `niulai` in the official client; not enforced.\n" #
    "- `skinId`: for example `naiwa-classic`, `naiwa-rider`, `naiwa-cyber`, `naiwa-guofeng`, `naiwa-astro`, `naiwa-gold`, `niulai-classic`; not enforced.\n" #
    "- `submittedAt`: Unix time in nanoseconds (Int).\n" #
    "\n" #
    "## Methods\n" #
    "\n" #
    "### submitScore(nickname : Text, score : Nat, distance : Nat, characterId : Text, skinId : Text) -> Result<LeaderboardEntry, Text> (update)\n" #
    "\n" #
    "Records one run. The nickname is trimmed of surrounding whitespace and must then be 2 to 12 Unicode characters. Returns `#ok(entry)` with the stored entry, or `#err(message)` with a Chinese message:\n" #
    "\n" #
    "- `昵称需为 2 到 12 个字` – nickname length invalid after trimming\n" #
    "- `分数无效` – score is 0\n" #
    "- `角色无效` / `皮肤无效` – characterId or skinId empty or longer than 32 characters\n" #
    "\n" #
    "Scores are self-reported by the client and not verified. Duplicate nicknames and repeated submissions are allowed.\n" #
    "\n" #
    "Retry safety: NOT idempotent. Each successful call creates a new entry with a new id; retrying after an unknown outcome may create a duplicate.\n" #
    "\n" #
    "Storage limit: at most 500 entries are kept. When exceeded, the lowest-ranked entries are deleted permanently, which may include the entry just submitted if it ranks below 500th.\n" #
    "\n" #
    "### getLeaderboard() -> [LeaderboardEntry] (query)\n" #
    "\n" #
    "Returns at most 50 entries ordered by score descending, then earlier `submittedAt` first, then lower `id`.\n" #
    "\n" #
    "### getEntryRank(id : Nat) -> ?Nat (query)\n" #
    "\n" #
    "Returns the 1-based rank of the entry under the same ordering, or null when the id is unknown or was evicted. Ranks can exceed 50.\n" #
    "\n" #
    "## Lifecycle and polling\n" #
    "\n" #
    "Submissions are visible immediately after the update returns. There is no background processing; poll `getLeaderboard` at most every few seconds if live updates are wanted. Ranks change as others submit.\n" #
    "\n" #
    "## Gotchas\n" #
    "\n" #
    "- About 8 sample entries are preloaded at install with playful Chinese nicknames; they are ordinary entries that real players can outrank and that can be evicted.\n" #
    "- Entries cannot be edited or deleted through the API."
  };
};
