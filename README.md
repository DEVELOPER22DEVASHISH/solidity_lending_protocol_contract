Overview
This project implements a modular DeFi lending protocol with Solidity smart contracts.
All deployment and initialization are done via Hardhat scripts.


Project Structure

/contracts          # Solidity contracts
/ignition/modules   # Hardhat Ignition deployment modules
/scripts            # Initialization and admin scripts
hardhat.config.js
README.md


Deployment & Initialization Order
Deploy Core Contracts (via Ignition modules):

ReserveConfiguration

PriceOracle

InterestRateModel

CollateralManager (needs ReserveConfiguration & PriceOracle)

LendingPool (needs InterestRateModel, CollateralManager, ReserveConfiguration)

LendingConfigurator (needs LendingPool)

Deploy Asset Tokens:

LToken (interest-bearing token)

DebtToken (debt representation token)

Initialize Protocol via Scripts:

Set asset prices in PriceOracle (setPriceOracle.js)

Configure risk parameters in ReserveConfiguration (setReserveConfig.js)

Grant MINTER_ROLE to LendingPool in LToken and DebtToken (setupLToken.js, setupDebtToken.js)

Register asset reserves in LendingPool via LendingConfigurator (addReserve.js)

How to Run Initialization Scripts
Run each script in the order below, replacing <network> with your target network:

npx hardhat run scripts/setPriceOracle.js --network <network>
npx hardhat run scripts/setReserveConfig.js --network <network>
npx hardhat run scripts/setupLToken.js --network <network>
npx hardhat run scripts/setupDebtToken.js --network <network>
npx hardhat run scripts/addReserve.js --network <network>

Users interact with LendingPool (not LToken/DebtToken directly). When a user deposits, borrows, repays, or withdraws, the LendingPool will call mint or burn on LToken/DebtToken as needed.

each asset (e.g., USDC, DAI, USDT) should have its own unique LToken and DebtToken contract.
This is how protocols like Aave and Compound work:

Each asset has its own interest-bearing token (LToken, sometimes called aToken or cToken).

Each asset has its own debt token (DebtToken, sometimes called variableDebtToken, etc).

So:

USDC → LTokenUSDC, DebtTokenUSDC

DAI → LTokenDAI, DebtTokenDAI

USDT → LTokenUSDT, DebtTokenUSDT

You should deploy a separate LToken and DebtToken for each underlying asset.
LToken and DebtToken are protocol-specific contracts.
They are not standard tokens like USDC or DAI; they are interest-bearing and debt-tracking tokens created by each lending protocol for each supported asset.

On mainnet, Aave’s aUSDC, aDAI, etc., are only for Aave’s protocol.
You cannot re-use their tokens for your own protocol.

On testnets (like Amoy), you must deploy your own LToken and DebtToken contracts for each asset you support.

What is the purpose of deploying your own LToken and DebtToken?
LToken (sometimes called aToken or cToken):
Represents a user’s deposit in your protocol. When a user deposits USDC, they receive LTokenUSDC. When they withdraw, they redeem LTokenUSDC for USDC. The LToken balance may increase over time as interest accrues.

DebtToken:
Tracks a user’s borrowings. When a user borrows USDC, they receive DebtTokenUSDC (or their balance increases). Repaying reduces their DebtToken balance.

Each asset needs its own LToken and DebtToken contract.

For USDC: LTokenUSDC, DebtTokenUSDC

For DAI: LTokenDAI, DebtTokenDAI

For USDT: LTokenUSDT, DebtTokenUSDT
No, you do not have pre-existing LToken and DebtToken contracts available for USDC, DAI, or USDT on Polygon Amoy or Polygon mainnet-unless you are integrating directly with a protocol like Aave or Compound, which deploys and manages their own aTokens/cTokens/variableDebtTokens for each asset.