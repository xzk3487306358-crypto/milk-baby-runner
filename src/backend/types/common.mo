module {
  public type Timestamp = Int;

  public type LeaderboardEntry = {
    id : Nat;
    nickname : Text;
    score : Nat;
    distance : Nat;
    characterId : Text;
    skinId : Text;
    submittedAt : Timestamp;
  };
};
