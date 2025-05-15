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

