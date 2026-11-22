import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import MapEntity "mo:caffeineai-oql/MapEntity";
import Entity "mo:caffeineai-oql/Entity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Result "mo:core/Result";
import Common "types/common";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let leaderboard : Map.Map<Nat, Common.LeaderboardEntry>;
  let leaderboardState : { var nextId : Nat };

  include MixinAuthorization(accessControlState, null);
  include ApiDocMixin();
  include Expose({
    entities = [
      leaderboard.toEntity("leaderboardEntry", "LeaderboardEntry", "id")
        .sample({ id = 0; nickname = ""; score = 0; distance = 0; characterId = ""; skinId = ""; submittedAt = 0 })
        .public_()
        .build(),
    ];
  });

  transient let maxStoredEntries = 500;
  transient let maxReturnedEntries = 50;

  // Score descending, then earlier submittedAt, then lower id.
  func compareRank(a : Common.LeaderboardEntry, b : Common.LeaderboardEntry) : Order.Order {
    if (a.score > b.score) { #less } else if (a.score < b.score) { #greater } else if (a.submittedAt < b.submittedAt) {
      #less;
    } else if (a.submittedAt > b.submittedAt) { #greater } else if (a.id < b.id) {
      #less;
    } else if (a.id > b.id) { #greater } else { #equal };
  };

  func ranked() : [Common.LeaderboardEntry] {
    leaderboard.values().toArray().sort(compareRank);
  };

  public shared func submitScore(nickname : Text, score : Nat, distance : Nat, characterId : Text, skinId : Text) : async Result.Result<Common.LeaderboardEntry, Text> {
    let name = nickname.trim(#predicate(func c = c.isWhitespace()));
    let len = name.size();
    if (len < 2 or len > 12) return #err("昵称需为 2 到 12 个字");
    if (score == 0) return #err("分数无效");
    if (characterId.size() == 0 or characterId.size() > 32) return #err("角色无效");
    if (skinId.size() == 0 or skinId.size() > 32) return #err("皮肤无效");

    let entry : Common.LeaderboardEntry = {
      id = leaderboardState.nextId;
      nickname = name;
      score;
      distance;
      characterId;
      skinId;
      submittedAt = Time.now();
    };
    leaderboardState.nextId += 1;
    leaderboard.add(entry.id, entry);

    if (leaderboard.size() > maxStoredEntries) {
      let all = ranked();
      var i = maxStoredEntries;
      while (i < all.size()) {
        leaderboard.remove(all[i].id);
        i += 1;
      };
    };
    #ok(entry);
  };

  public query func getLeaderboard() : async [Common.LeaderboardEntry] {
    let all = ranked();
    if (all.size() <= maxReturnedEntries) all else all.sliceToArray(0, maxReturnedEntries);
  };

  public query func getEntryRank(id : Nat) : async ?Nat {
    if (not leaderboard.containsKey(id)) return null;
    let all = ranked();
    switch (all.findIndex(func e = e.id == id)) {
      case (?idx) { ?(idx + 1) };
      case null { null };
    };
  };
};
