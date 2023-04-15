import {
  Field,
  method,
  Permissions,
  PublicKey,
  SmartContract,
  state,
  State,
  Circuit,
  Struct,
  Poseidon,
  Bool,
  MerkleWitness,
} from 'snarkyjs';

const STATUS = {
  YES: 1,
  NO: 0,
};

export class MerkleWitnessClass extends MerkleWitness(32) { }

export class Vote extends SmartContract {
  @state(Field) number_of_yes = State<Field>(); // Yesの投票数
  @state(Field) number_of_no = State<Field>(); // Noの投票数
  @state(Field) proposal_id = State<Field>() // 投票者の電話番号を暗号化した値（Nullifierで使用
  @state(Field) nullifier_root = State<Field>();

  // eslint-disable-next-line snarkyjs/no-constructor-in-smart-contract
  constructor(zkAppAddress: PublicKey) {
    super(zkAppAddress);
  }

  deploy() {
    super.deploy();
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });

    this.number_of_yes.set(Field(0));
    this.number_of_no.set(Field(0));
  }

  @method vote(
    choice: Field,
    older_number_of_yes: Field,
    older_number_of_no: Field,
  ) {

    this.number_of_yes.assertEquals(older_number_of_yes);
    this.number_of_no.assertEquals(older_number_of_no);

    this.number_of_yes.set(older_number_of_yes.add(choice.equals(Field(STATUS.YES)).toField()));
    this.number_of_no.set(older_number_of_no.add(choice.equals(Field(STATUS.NO)).toField()));

    this.number_of_yes.set(older_number_of_yes.add(choice.equals(Field(STATUS.YES)).toField()));
    this.number_of_no.set(older_number_of_no.add(choice.equals(Field(STATUS.NO)).toField()));
  }

  @method setNullifier(proposal_id: Field, voter: Voter, nullifier: MerkleWitnessClass) {
    this.nullifier_root.assertEquals(this.nullifier_root.get());

    nullifier.calculateRoot(voter.hash()).assertEquals(this.nullifier_root.get());

    let newVoter = voter.vote();
    let new_nullifer_root = nullifier.calculateRoot(newVoter.hash());
    this.nullifier_root.set(new_nullifer_root);
  }
}

// 投票者
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

  hash(): Field {
    return Poseidon.hash(this.key.toFields().concat(this.nullifier.toFields()).concat(this.isVoted.toFields()));
  }

  setNullifier(
    nullifier: Field
  ): Voter {
    return new Voter(this.key, nullifier, this.isVoted);
  }

  vote(): Voter {
    return new Voter(this.key, this.nullifier, Bool(true));
  }
}
