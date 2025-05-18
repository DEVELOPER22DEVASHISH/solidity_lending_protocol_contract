# 💎 Modular DeFi Lending Protocol

A **modular, production-grade decentralized lending protocol** built using Solidity smart contracts.

All deployments and protocol initializations are handled via **Hardhat scripts** and **Ignition** modules.

---

## 📁 Project Structure

/contracts              # All Solidity smart contracts
/ignition/modules       # Hardhat Ignition deployment modules
/scripts                # Initialization and admin scripts
hardhat.config.js
README.md


---

## 🧩 Protocol Overview

A protocol enabling users to **deposit assets, earn interest, and borrow** against collateral — similar to Aave or Compound.

### 🔑 Key Components

| Component             | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `LendingPool`        | Core contract for deposits, withdrawals, borrows, and repayments.          |
| `LToken`             | Interest-bearing token (1 per asset, e.g., LTokenUSDC).                     |
| `DebtToken`          | Debt-tracking token (1 per asset, e.g., DebtTokenUSDC).                     |
| `ReserveConfiguration` | Risk parameters (LTV, thresholds, bonus, active status) per asset.        |
| `PriceOracle`        | Chainlink-integrated price fetcher (18-decimal normalization).              |
| `CollateralManager`  | Handles collateral checks and liquidations.                                |
| `LendingConfigurator`| Admin contract to configure reserves.                                       |

---

## ⚙️ Internal Mechanism

### 🔁 How It Works

#### 🏦 Asset Registration
Each asset (e.g., USDC, DAI) has:
- A unique `LToken`
- A unique `DebtToken`

#### 👤 User Actions via `LendingPool`
- **Deposit** → Send asset → Receive `LToken`
- **Withdraw** → Burn `LToken` → Receive asset
- **Borrow** → Lock collateral → Receive asset → Increase `DebtToken`
- **Repay** → Return asset → Decrease `DebtToken`

> ℹ️ Users never directly interact with `LToken` or `DebtToken`.

#### 🛡️ Risk Management
- `ReserveConfiguration` enforces LTV, thresholds, and bonuses.
- `PriceOracle` standardizes prices to 18 decimals.

#### ⚰️ Liquidation
If a borrower's health factor drops below threshold:
- Position can be liquidated
- Liquidator earns a **bonus**

---

## 🚀 Deployment & Initialization Order

> ✅ Always follow this order for a safe and functional protocol setup:

### 1. Deploy Core Contracts (via Ignition Modules)

1. `ReserveConfiguration`  
2. `PriceOracle`  
3. `InterestRateModel`  
4. `CollateralManager` (requires `ReserveConfiguration`, `PriceOracle`)  
5. `LendingPool` (requires `InterestRateModel`, `CollateralManager`, `ReserveConfiguration`)  
6. `LendingConfigurator` (requires `LendingPool`)  

### 2. Deploy Asset Tokens
- Deploy one `LToken` and one `DebtToken` per asset  
  *(e.g., `LTokenUSDC`, `DebtTokenUSDC`)*

### 3. Run Initialization Scripts

## 🏁 Initialization Summary Table

| 🧩 Step                            | 📜 Script(s)                              | 📝 Description                                           |
|----------------------------------|------------------------------------------|----------------------------------------------------------|
| ✅ Set asset prices              | `setPriceOracle.js`                      | Set Chainlink price feeds for each asset                |
| ⚙️ Configure risk parameters     | `setReserveConfig.js`                    | Set LTV, liquidation threshold, bonus, active status    |
| 🔐 Grant `MINTER_ROLE` to Pool   | `setupLToken.js`, `setupDebtToken.js`    | Allow LendingPool to mint/burn LToken and DebtToken     |
| 🧾 Register asset reserves       | `addReserve.js`                          | Register each asset with its `LToken` and `DebtToken`   |


---

## 🛠️ How to Run Initialization Scripts

Run each script in order, replacing `<network>` with your target (e.g., `polygonAmoy`):

```bash
npx hardhat run scripts/setPriceOracle.js --network <network>
npx hardhat run scripts/setReserveConfig.js --network <network>
npx hardhat run scripts/setupLToken.js --network <network>
npx hardhat run scripts/setupDebtToken.js --network <network>
npx hardhat run scripts/addReserve.js --network <network>



💡 Design Principles & Best Practices
✅ One LToken and one DebtToken per asset
✅ Parameters and prices normalized to 18 decimals
✅ Only LendingPool interacts with token minting/burning
✅ Chainlink used for reliable pricing
✅ Configuration modular and updatable



➕ Adding New Assets
To add a new asset:

Deploy new LToken and DebtToken

Register asset via LendingConfigurator

Set price feed

Configure risk parameters

Run initialization scripts for the new asset


📊 Example Workflow
Deploy all contracts using Ignition modules

Run initialization scripts (in order)

Users interact with LendingPool:

Deposit

Borrow

Repay

Withdraw

All interest, collateral, and liquidation logic runs automatically

🔐 Security Note
⚠️ Never call mint or burn directly on LToken/DebtToken.
✅ Only interact through LendingPool.
🛡️ Admin can update risk configurations at any time.


## 🏁 Initialization Summary Table

| 🧩 Step                    | 📜 Script              | 🕒 When to Run               |
|--------------------------   |----------------------- |----------------------------   |
| 🧾 Register reserves       | `addReserve.js`        | 🔹 First                      |
| ⚙️ Set risk configurations | `setReserveConfig.js`  | 🔹 After registering reserves |


🏦 Modular DeFi Lending Protocol: Token Architecture
🎨 Why Do We Have Both Generic and Per-Asset LToken/DebtToken Contracts?
1️⃣ Generic LToken.sol and DebtToken.sol
🛠️ Base templates that define the core logic for interest-bearing tokens (LToken) and debt-tracking tokens (DebtToken).

🔄 Include all essential mechanisms: minting, burning, access control, and ERC20 compliance.

🏷️ Not tied to any specific asset-no hardcoded asset address, name, or symbol.

🧩 Blueprints or classes in OOP: not directly instantiated for end-users but provide reusable logic across all assets.

2️⃣ Per-Asset LToken and DebtToken Contracts (e.g., LTokenDAI.sol, DebtTokenUSDC.sol)
📦 Specific deployments of the generic contracts, each representing a single supported asset in the protocol.

🏷️ Each per-asset contract sets its own name and symbol (e.g., LTokenDAI for DAI, LTokenUSDC for USDC).

🗃️ Each asset in the protocol is managed through its own deployed LToken and DebtToken contracts.

🔒 Ensures deposits, interest, and debts are tracked in isolation for each asset-an approach widely adopted by protocols like Aave and Compound.

Example from the repo:
LTokenDAI.sol → LToken for DAI

LTokenUSDC.sol → LToken for USDC

DebtTokenDAI.sol → DebtToken for DAI

DebtTokenUSDC.sol → DebtToken for USDC

🚫 Why Not Use a Single LToken or DebtToken Contract for All Assets?
Trying to handle multiple assets with a single LToken or DebtToken contract leads to various design and security issues:

🎯 Isolated Accounting
Each LToken must manage deposits, interest, and balances for only one asset. Mixing assets breaks asset-specific logic and makes independent accounting impossible.

🛡️ Security
Asset-specific contract isolation minimizes systemic risk. If one token contract is compromised, only that asset is affected.

⚙️ Protocol Logic
LendingPool must mint/burn the correct token for each asset. Depositing USDC should mint LTokenUSDC-not a generic token or one for another asset.

🌐 Industry Standard
Leading DeFi protocols (Aave, Compound) follow this model: each supported asset has its own set of interest-bearing and debt-tracking tokens, ensuring cleaner, safer, and modular accounting.

🏗️ How the Structure Works in This Project

| File              | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| LToken.sol        | Generic logic for all interest-bearing tokens   |
| DebtToken.sol     | Generic logic for all debt tokens               |
| LTokenDAI.sol     | LToken for DAI (deployed, tracks only DAI)      |
| LTokenUSDC.sol    | LToken for USDC (deployed, tracks only USDC)    |
| LTokenUSDT.sol    | LToken for USDT (deployed, tracks only USDT)    |
| DebtTokenDAI.sol  | DebtToken for DAI (deployed, tracks only DAI)   |
| DebtTokenUSDC.sol | DebtToken for USDC (deployed, tracks only USDC) |
| DebtTokenUSDT.sol | DebtToken for USDT (deployed, tracks only USDT) |


🚗 Analogy
LToken.sol is like a Car class in OOP.

LTokenDAI.sol is like a specific "Red Toyota Corolla" instance.

Just as each physical car is distinct, each supported asset requires its own instance of an LToken or DebtToken for correct and isolated behavior.

🧪 Why Use Mock Tokens for DAI, USDC, and USDT?
Mock tokens are testnet versions of real-world stablecoins (DAI, USDC, USDT) and are used for several reasons:

🆓 No Real Value or Risk
Freely minted and distributed, allowing safe testing without financial loss or regulatory risk.

🧩 Testnet Compatibility
On testnets like Polygon Amoy, real stablecoins may not be available. Mocks simulate their behavior for functional testing.

🛠️ Development Flexibility
Control over supply and distribution, enabling testing of edge cases (liquidations, high-volume transactions).

🔄 Protocol Integration
ERC20-compliant, so all deposit, borrow, repay, and liquidation flows work seamlessly in test environments.

“The stablecoin in this example repo is a mocked USDC token and we use Chainlink’s price feeds to calculate the exchange rate between the deposited token and the Mock USDC stablecoin that is being borrowed.”

Chainlink CCIP DeFi Lending Example

🏦 Why Does Each Asset Need Its Own LToken and DebtToken?
This is the same architectural pattern followed by modern lending protocols like Aave and Compound:

A dedicated interest-bearing token (LToken)

A separate debt-tracking token (DebtToken)

Benefits:
🧮 Isolated Accounting
Each token tracks only a single asset’s deposits and interest, keeping accrual logic clean and accurate.

🛡️ Risk Segregation
Asset-specific contracts ensure that even if one is compromised, others remain unaffected.

⚙️ Protocol Flexibility
Each asset can have its own risk parameters (LTV, interest rate, liquidation threshold), easily managed with separate contracts.

🤖 Automated Mint/Burn
LendingPool automatically mints and burns the right LToken or DebtToken depending on the operation and asset.

🌍 Mainnet Parity
Protocols like Aave deploy unique aToken and variableDebtToken contracts for each asset, ensuring compatibility with this proven model.

“AToken contracts (for each underlying asset: WETH, DAI, etc.) also hold the balances of underlying assets... This allows the underlying balances to be kept separate from each other and reduces the risk associated with compromising a single contract holding all the token balances.”

📊 Summary Table

| Token Type | Purpose                                  | One Per Asset? | Example Name  |
| ---------- | ---------------------------------------- | -------------- | ------------- |
| Mock Token | Simulates real DAI/USDC/USDT for testing | ✅              | MockUSDC      |
| LToken     | Tracks deposits, accrues interest        | ✅              | LTokenUSDC    |
| DebtToken  | Tracks borrowings/debt for each asset    | ✅              | DebtTokenUSDC |


✅ Best Practices
Always deploy a distinct LToken and DebtToken for each asset, even for testnet setups.

Never mint or burn LToken/DebtToken directly from the frontend or test scripts-all minting and burning is managed via the LendingPool.

Mock tokens are ideal for simulating mainnet-like behavior in a safe and controlled testnet environment.

🏁 Final Note
Mock tokens enable safe, real-world-like testing.
Each asset is managed through dedicated token contracts to ensure clean accounting, modular risk management, and protocol-level flexibility-an approach aligned with the design philosophy of industry leaders like Aave and Compound.

---

🙏 **Thank You**

Thank you for reviewing this **DeFi lending protocol project**!  
Your time and attention are greatly appreciated.

If you have any questions, feedback, or would like to discuss the design further, please feel free to **reach out**.

---

**Happy building and exploring DeFi!** 🚀

**Devashish Biswas**  
_Blockchain Developer_

---
