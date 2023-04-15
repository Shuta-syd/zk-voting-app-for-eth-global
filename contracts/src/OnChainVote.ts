import {
  DeployArgs,
  Field,
  MerkleMapWitness,
  Permissions,
  PrivateKey,
  Proof,
  PublicKey,
  SmartContract,
  State,
  method,
  state,
} from 'snarkyjs';

export class OnChainVote extends SmartContract {
  @state(Field) number_of_yes = State<Field>(); // Yesの投票数
  @state(Field) number_of_no = State<Field>(); // Noの投票数
  @state(Field) number_of_abstain = State<Field>(); // Abstainの投票数
  @state(Field) proposal_id = State<Field>(); // 投票者の電話番号を暗号化した値（Nullifierで使用）
  // @state(Field) nullifier_root = State<Field>(); // 二重投票防止のためのNullifierのハッシュ値のルート
  // @state(Field) oracle_key = State<Field>(); // Oracleの公開鍵

  // eslint-disable-next-line snarkyjs/no-constructor-in-smart-contract
  constructor(zkAppAddress: PublicKey) {
    super(zkAppAddress);
  }

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });

    this.number_of_yes.set(Field(0));
    this.number_of_no.set(Field(0));
    this.number_of_abstain.set(Field(0));
    this.proposal_id.set(Field(0));
    // this.nullifier_root.set(Field(0));
    // this.oracle_key.set(Field(0));
  }

  @method vote(choice: Field, nullifier: Field) {
    return;
  }
}
