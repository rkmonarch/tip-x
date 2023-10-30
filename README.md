![tipX](https://github.com/rkmonarch/tip-x/assets/79443588/085d7970-b0b3-4bf9-9575-341ec1cff82d)

> version: 0.2.0

## TipX 
TipX is a Web3 version of Linktree with on-chain features. You can create your social profile easily, and it will provide personalized badges to your profile based on your on-chain activities and also show the top NFTs that you hold. You can flex your social profile with your audience by sharing a profile link, and you can receive tips directly in your wallet. It makes socialism easy and transparent for everyone. 

### How do we use Chainbase?
It helps to bring on-chain assets of prospective individuals in a personalized badge. TipX utilize Web3 API:
- To fetch user's all NFTs
- To filter NFT by `contract`, `volume`, and `floor price`

**See our demo video: https://youtu.be/vafCk857-HM**

## Prerequisites & Manual Setup

Every user must have a Metamask wallet to interact with this product. Check out how to create a Metamask wallet from [here](https://metamask.io). 

Follow the instructions for the local environment: The user must have Node.js and npm to run this platform. Just download Node.js from [here](https://nodejs.org/en/download/).

### Local Setup Instructions

**Clone the repo via CLI:**

```sh
git clone https://github.com/rkmonarch/tip-x.git 
cd tip-x
```

**Install the required packages:**

```sh
npm install
yarn install   #or
pnpm install   #or
```

**Add required environment variables mentioned in `.env.example` file**

```sh
touch .env  #Paste env variables in this file and your values
```

**In the project directory, you can run:**

```sh
npm run dev
yarn dev   #or
pnpm dev   #or
```

- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
