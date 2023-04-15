import {
  Field,
  Proof,
  SmartContract,
  State,
  method,
  state,
} from 'snarkyjs';

export class OffChainVote extends SmartContract {
  @state(Field) number_of_yes = State<Field>(); // Yesの投票数
  @state(Field) number_of_no = State<Field>(); // Noの投票数
  @state(Field) number_of_abstain = State<Field>(); // Abstainの投票数
  @state(Field) proposal_id = State<Field>(); // 投票者の電話番号を暗号化した値（Nullifierで使用）
  @state(Field) nullifier_root = State<Field>(); // 二重投票防止のためのNullifierのハッシュ値のルート

  @method verifyProof(proof: Proof<Field>) {
    // verify that the proof is valid, update the state accordingly
  }
}
