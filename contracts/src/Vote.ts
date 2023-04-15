import {
  Bool,
  Field,
  Poseidon,
  PublicKey,
  Struct,
} from 'snarkyjs';

export class Voter extends Struct({
  key: PublicKey,
  nullifier: Field,
  isVoted: Bool,
}) {
  constructor(key: PublicKey, nullifier: Field, isVoted: Bool) {
    super({ key, nullifier, isVoted });
    this.nullifier = nullifier;
    this.key = key;
    this.isVoted = isVoted;
  }

  /**
   * @description Hashes the voter's key, nullifier and isVoted
   */
  hash(): Field {
    return Poseidon.hash(this.key.toFields().concat(this.nullifier.toFields()).concat(this.isVoted.toFields()));
  }

  /**
   * @description nullifierに新たな投票者情報をセットする
   */
  setNullifier(
    nullifier: Field
  ): Voter {
    return new Voter(this.key, nullifier, this.isVoted);
  }

  /**
   * @description 新たな投票者情報を作成する
   */
  vote(): Voter {
    return new Voter(this.key, this.nullifier, Bool(true));
  }
}
