import {
  SmartContract,
  Field,
  state,
  State,
  method,
  Bool,
} from "snarkyjs";

export class VoteSystem extends SmartContract {
  @state(Field) no = State<Field>();
  @state(Field) yes = State<Field>();

  init() {
    super.init();
    this.no.set(Field(0));
    this.yes.set(Field(0));
  }

  @method vote(vote_result: Field) {

    vote_result.assertLessThan(2, "Too Big");

    const cur_no = this.no.get();
    this.no.assertEquals(cur_no);
    this.no.set(cur_no.add(vote_result.equals(Field(0)).toField()));

    const cur_yes = this.yes.get();
    this.yes.assertEquals(cur_yes);
    this.yes.set(cur_yes.add(vote_result.equals(Field(1)).toField()));
  }
}

