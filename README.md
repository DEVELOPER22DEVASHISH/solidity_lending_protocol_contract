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


