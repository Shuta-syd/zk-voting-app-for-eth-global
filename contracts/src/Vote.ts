import {
  Field,
  method,
  Permissions,
  PublicKey,
  SmartContract,
  state,
  State,
  Circuit,
} from 'snarkyjs';

const STATUS = {
  YES: 1,
  NO: 0,
};

export class Vote extends SmartContract {
  @state(Field) number_of_yes = State<Field>(); // Yesの投票数
  @state(Field) number_of_no = State<Field>(); // Noの投票数

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
}
