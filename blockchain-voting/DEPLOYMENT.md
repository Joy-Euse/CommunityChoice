# ZIKITESVOTE Deployment Guide

This document provides instructions for deploying the ZIKITESVOTE blockchain-based voting system for university elections.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask or another Ethereum wallet
- Access to an Ethereum network (testnet for testing, mainnet for production)

## Smart Contract Deployment

1. **Install Truffle or Hardhat**

   \`\`\`bash
   npm install -g truffle
   # or
   npm install -g hardhat
   \`\`\`

2. **Configure Network Settings**

   Edit the `truffle-config.js` or `hardhat.config.js` file to include your network settings:

   \`\`\`javascript
   module.exports = {
     networks: {
       development: {
         host: "127.0.0.1",
         port: 8545,
         network_id: "*",
       },
       goerli: {
         provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`),
         network_id: 5,
         gas: 5500000,
         confirmations: 2,
         timeoutBlocks: 200,
         skipDryRun: true
       },
       // Add other networks as needed
     },
     compilers: {
       solc: {
         version: "0.8.19",
       }
     }
   };
   \`\`\`

3. **Deploy the Smart Contract**

   \`\`\`bash
   truffle migrate --network goerli
   # or
   npx hardhat run scripts/deploy.js --network goerli
   \`\`\`

4. **Update Contract Address**

   After deployment, update the `CONTRACT_ADDRESS` in `lib/blockchain.ts` with the deployed contract address.

## Frontend Deployment

1. **Install Dependencies**

   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

2. **Build the Application**

   \`\`\`bash
   npm run build
   # or
   yarn build
   \`\`\`

3. **Deploy to Vercel**

   The easiest way to deploy the frontend is using Vercel:

   \`\`\`bash
   npm install -g vercel
   vercel login
   vercel
   \`\`\`

   Follow the prompts to deploy your application.

4. **Alternative Deployment Options**

   You can also deploy to other platforms like Netlify, AWS Amplify, or a traditional web server.

## Configuration

1. **Environment Variables**

   Set up the following environment variables in your deployment platform:

   \`\`\`
   NEXT_PUBLIC_ETHEREUM_NETWORK=goerli
   NEXT_PUBLIC_INFURA_ID=your_infura_project_id
   \`\`\`

2. **University Database Integration**

   For student eligibility verification, integrate with your university's student database API. Update the `verifyStudentEligibility` function in `lib/blockchain.ts` to make actual API calls to your university's system.

## Admin Setup

1. **Set Admin Wallet**

   The wallet address used to deploy the contract will be the admin by default. To add additional admins, use the admin dashboard after logging in with the primary admin account.

2. **Create Voting Categories**

   Use the admin dashboard to create voting categories and positions before setting up an election.

3. **Configure Election Parameters**

   Set up the election details including start and end dates, eligibility requirements, and other settings.

## Security Considerations

1. **Smart Contract Audit**

   Before deploying to mainnet, have the smart contract audited by a reputable security firm.

2. **Access Control**

   Ensure proper access controls are in place for admin functions.

3. **Wallet Security**

   Secure the admin wallet with hardware wallets or multi-signature setups for production deployments.

4. **Student Data Privacy**

   Ensure compliance with data protection regulations when handling student information.

## Maintenance

1. **Regular Updates**

   Keep dependencies updated and apply security patches as needed.

2. **Monitoring**

   Set up monitoring for the application and smart contract to detect any issues.

3. **Backup**

   Regularly backup important data and configurations.

## Troubleshooting

- **Contract Interaction Issues**: Ensure MetaMask is connected to the correct network
- **Transaction Failures**: Check gas settings and contract state
- **Frontend Issues**: Clear browser cache and cookies

For additional support, contact the development team at support@zikitesvote.edu.ng
\`\`\`

Let's update the README file with information about the system:
