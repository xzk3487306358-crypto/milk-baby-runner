import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type LeaderboardEntry = {
    id : Nat;
    nickname : Text;
    score : Nat;
    distance : Nat;
    characterId : Text;
    skinId : Text;
    submittedAt : Int;
  };

  public type OldActor = {};
  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    leaderboard : Map.Map<Nat, LeaderboardEntry>;
    leaderboardState : { var nextId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    let leaderboard = Map.empty<Nat, LeaderboardEntry>();
    let seeds : [(Text, Nat, Nat, Text, Text)] = [
      ("奶家人一号", 24000, 5200, "naiwa", "naiwa-gold"),
      ("胆子肥嘟嘟", 18650, 4100, "naiwa", "naiwa-cyber"),
      ("牛来妈妈", 15320, 3600, "niulai", "niulai-classic"),
      ("霓虹跑者", 11800, 2900, "naiwa", "naiwa-astro"),
      ("外卖小哥", 8460, 2150, "naiwa", "naiwa-rider"),
      ("黄色三幻神", 5230, 1400, "niulai", "niulai-classic"),
      ("冲鸭", 2780, 820, "naiwa", "naiwa-guofeng"),
      ("小绳头", 860, 260, "naiwa", "naiwa-classic"),
    ];
    // Fixed seed time (2026-01-01 UTC in nanoseconds), one second apart.
    var id = 0;
    for ((nickname, score, distance, characterId, skinId) in seeds.values()) {
      leaderboard.add(
        id,
        {
          id;
          nickname;
          score;
          distance;
          characterId;
          skinId;
          submittedAt = 1_767_225_600_000_000_000 + id * 1_000_000_000;
        },
      );
      id += 1;
    };
    {
      accessControlState = AccessControl.initState();
      leaderboard;
      leaderboardState = { var nextId = id };
    };
  };
};
