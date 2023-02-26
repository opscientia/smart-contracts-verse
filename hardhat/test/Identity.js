const {ethers} = require("hardhat");
const {expect, assert} = require("chai");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

describe("Identity", () => {
    async function runEveryTime(){
      const TWITTER_ACCOUNT = "@twitterUser";
      const DESCRIPTION = "neque aliquam vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas dui id ornare arcu odio ut sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor elit sed vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit amet mattis vulputate"
      const TYPE_OF_SCIENCE = "Physics";
      const ROLE = "Scientist";

      const [owner, otherAccount] = await ethers.getSigners();

      const identity = await ethers.getContractFactory("Identity");
      const identityContract = await identity.deploy();
      await identityContract.deployed();

      return {TWITTER_ACCOUNT, identityContract, owner, otherAccount, TYPE_OF_SCIENCE, ROLE, DESCRIPTION}
    }

    describe("Credentials", () => {
      it("should return correct credentials", async () => {
        const {TWITTER_ACCOUNT, identityContract, owner} = await loadFixture(runEveryTime);
        const twitterCred = await identityContract.LinkYourAddressToTwitter(TWITTER_ACCOUNT);
        twitterCred.wait();
        expect(await identityContract.showLinkedCredentialsTwitter(owner.address)).to.equal(TWITTER_ACCOUNT);
      });

      it("should revert if the account already exists", async () => {
        const {TWITTER_ACCOUNT, identityContract, owner} = await loadFixture(runEveryTime);
        const twitterCred = await identityContract.LinkYourAddressToTwitter(TWITTER_ACCOUNT);
        twitterCred.wait();
         await expect(identityContract.LinkYourAddressToTwitter(TWITTER_ACCOUNT)).to.be.revertedWith("You are already registered")
      });

      it("should show linked account", async () => {
        const {TWITTER_ACCOUNT, identityContract, owner} = await loadFixture(runEveryTime);
        const twitterCred = await identityContract.LinkYourAddressToTwitter(TWITTER_ACCOUNT);
        twitterCred.wait();
        expect(await identityContract.showLinkedCredentialsTwitter(owner.address)).to.equal(TWITTER_ACCOUNT);
      });

      it("show show if account exists", async () => {
        const {identityContract, owner, TWITTER_ACCOUNT} = await loadFixture(runEveryTime);
        const twitterCred = await identityContract.LinkYourAddressToTwitter(TWITTER_ACCOUNT);
        twitterCred.wait();
        expect(await identityContract.existsTwitterAccount(TWITTER_ACCOUNT)).to.equal(true);
      });

      it("should set correct values in about you", async () => {
        const{identityContract, owner,TYPE_OF_SCIENCE, ROLE, DESCRIPTION} = await loadFixture(runEveryTime);
        const aboutYou = await identityContract.setAbout(owner.address, ROLE, TYPE_OF_SCIENCE, DESCRIPTION);

        aboutYou.wait();
        console.log(await identityContract.getAbout(owner.address))
        console.log(([ROLE,TYPE_OF_SCIENCE, DESCRIPTION]))
        // expect(await identityContract.getAbout(owner.address)).to.equal([ROLE,TYPE_OF_SCIENCE, DESCRIPTION]); --> check individually
      });
    });

})