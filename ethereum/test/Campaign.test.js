const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../build/CampaignFactory.json");
const compiledCampaign = require("../build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts(); // get accounts auto created by ganache - 10 created by default

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  // create an instance of a campaign via the factory for each test
  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000"
  });

  // take first element out of the array and assign it to the variable campaignAddress
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  // contract already deployed need to pass another argument of the address where the contract exists
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller of createCampaign as campaign manager", async () => {
    // manager function auto created since it is a public storage variable in the Campaign contract
    // do not need to pass in from argument to call ganache will automatically use the first account
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute and marks them as approvers", async () => {
    const contributer = accounts[1];
    await campaign.methods.contribute().send({
      from: contributer,
      gas: "1000000",
      value: "100"
    });

    const isContributer = await campaign.methods.approvers(contributer).call();
    const approversCount = await campaign.methods.approversCount().call();
    assert(isContributer);
    assert.equal(approversCount, 1);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.contribute().send({
        from: accounts[1],
        gas: "1000000",
        value: "99" // minimum contribution amount == '100'
      });
      // should never reach this assert function should through an error since we are sending less than the min contribution amount
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows manager to make payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[2])
      .send({ from: accounts[0], gas: "1000000" });

    // get first request in requests array
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy batteries", request.description);
    assert.equal("100", request.value);
    assert.equal(false, request.complete);
  });

  it("processes request", async () => {
    const campaignManager = accounts[0];
    const contributor = accounts[1];
    const requestRecipient = accounts[2];
    await campaign.methods.contribute().send({
      from: contributor,
      value: web3.utils.toWei("10", "ether")
    });
    const initialRequest = {
      description: "Buy batteries",
      value: web3.utils.toWei("5", "ether"),
      recipient: requestRecipient
    };

    await campaign.methods
      .createRequest(
        initialRequest.description,
        initialRequest.value,
        initialRequest.recipient
      )
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: contributor, gas: "1000000" });

    const recipientBalanceBefore = await web3.eth.getBalance(requestRecipient);
    await campaign.methods
      .finalizeRequest(0)
      .send({ from: campaignManager, gas: "1000000" });

    const request = await campaign.methods.requests(0).call();
    assert.equal(true, request.complete);

    let balance = await web3.eth.getBalance(requestRecipient);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert.equal(balance, 105);

    const recipientBalanceAfter = await web3.eth.getBalance(requestRecipient);
    const difference = recipientBalanceAfter - recipientBalanceBefore;
    assert.equal(web3.utils.toWei("5", "ether"), difference);
  });
});
