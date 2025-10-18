# Phân Tích Nghiệp Vụ Chi Tiết - Trader Platform
## Nautilus Trader Admin & Trading Platform

**Date:** October 19, 2025  
**Version:** 2.0  
**Author:** Business Analyst  
**Status:** Comprehensive Analysis

---

## 📋 Mục Lục

1. [Tổng Quan Trader Platform](#tổng-quan-trader-platform)
2. [Mục Đích và Đối Tượng Sử Dụng](#mục-đích-và-đối-tượng-sử-dụng)
3. [Phân Tích Chi Tiết 25 Trang Trader](#phân-tích-chi-tiết-25-trang-trader)
4. [Nghiệp Vụ Trading Operations](#nghiệp-vụ-trading-operations)
5. [Nghiệp Vụ Strategy Development](#nghiệp-vụ-strategy-development)
6. [Nghiệp Vụ Backtesting](#nghiệp-vụ-backtesting)
7. [Luồng Nghiệp Vụ Chi Tiết](#luồng-nghiệp-vụ-chi-tiết)
8. [Vai Trò Trader và Quyền Hạn](#vai-trò-trader-và-quyền-hạn)

---

## 🎯 Tổng Quan Trader Platform

### Định Nghĩa

**Trader Platform** là giao diện trading chính cho traders, cung cấp đầy đủ công cụ để:
- Monitor markets real-time
- Execute live trades
- Manage positions và orders
- Develop và test strategies
- Analyze performance

### Kiến Trúc

**Trader Platform** tương tác với **Nautilus Core** để:
- Nhận real-time market data
- Gửi trading orders
- Quản lý positions
- Chạy backtests
- Deploy strategies

**Không phải quản trị** như Admin Panel, mà là **sử dụng** Nautilus Core để trading.

---

## 👥 Mục Đích và Đối Tượng Sử Dụng

### Primary Users

**1. Quantitative Traders**
- Develop algorithmic strategies
- Backtest strategies
- Deploy to live trading
- Monitor performance

**2. Discretionary Traders**
- Monitor markets
- Execute manual trades
- Manage positions
- Track P&L

**3. Strategy Developers**
- Build strategies
- Test strategies
- Optimize parameters
- Deploy strategies

### Business Goals

**Primary Goals:**
- Execute profitable trades
- Minimize losses
- Optimize strategy performance
- Manage risk effectively

**Secondary Goals:**
- Reduce manual effort
- Improve decision making
- Increase trading efficiency
- Learn from data

---

## 📊 Phân Tích Chi Tiết 25 Trang Trader

### Cấu Trúc Menu

**DASHBOARD (3 pages)**
1. Overview
2. Portfolio
3. Market Watch

**TRADING (4 pages)**
4. Live Trading
5. Positions
6. Orders
7. Trade History

**BACKTESTING (4 pages)**
8. Quick Backtest
9. Advanced Backtest
10. Walk-Forward
11. Optimization

**STRATEGIES (4 pages)**
12. My Strategies
13. Strategy Builder
14. Strategy Library
15. Deploy Strategy

**ANALYTICS (1 page)**
16. Performance

**UTILITY (1 page)**
17. Exit Platform

**PHASE 2 - NEW PAGES (8 pages)**
18. Live Trading (New)
19. Market Watch (New)
20. Strategy Library (New)
21. Deploy Strategy (New)
22. Strategy Builder (New)
23. Advanced Backtest (New)
24. Walk-Forward (New)
25. Optimization (New)

---

## 📈 DASHBOARD (3 pages)

### 1. Overview (`/dashboard`)

**Mục Đích:**
- Tổng quan portfolio và trading activity
- Quick snapshot of performance
- Access to key metrics

**Nghiệp Vụ:**

**A. Key Metrics (4 cards)**

1. **Portfolio Value** - $125,430.50 (+12.4%)
   - Total value of all positions
   - Percentage change from previous day
   - Real-time update
   - Nguồn: PostgreSQL (positions) + live prices

2. **Today's P&L** - $2,345.67 (+1.91%)
   - Profit/Loss for current day
   - Percentage return
   - Real-time calculation
   - Nguồn: PostgreSQL (trades) + positions

3. **Active Strategies** - 0 (3 running)
   - Number of deployed strategies
   - Number currently running
   - Status indicator
   - Nguồn: TiDB (strategies) + Nautilus Core

4. **Open Positions** - 5 (2 profitable)
   - Number of open positions
   - Number in profit
   - Quick status
   - Nguồn: PostgreSQL (positions)

**B. Portfolio Equity Curve**
- Line chart showing portfolio value over time
- Time range selector (1D, 1W, 1M, 3M, 1Y, ALL)
- Drawdown visualization
- Benchmark comparison
- Nguồn: Historical positions + trades

**C. Active Strategies**
- List of currently running strategies
- Strategy name, status, P&L
- Quick actions (pause, stop)
- Nguồn: TiDB (strategies) + Nautilus Core

**D. Recent Trades**
- Table of recent trades
- Columns: Time, Symbol, Side, Quantity, Price, P&L
- Color coding (green=profit, red=loss)
- Nguồn: PostgreSQL (trades)

**User Actions:**
- View portfolio overview
- Monitor active strategies
- Check recent trades
- Navigate to detailed pages

**Data Sources:**
- PostgreSQL: positions, trades, orders
- TiDB: strategies, backtests
- Nautilus Core: live prices, strategy status
- Redis: cached metrics

---

### 2. Portfolio (`/portfolio`)

**Mục Đích:**
- Detailed portfolio analysis
- Position management
- Risk monitoring

**Nghiệp Vụ:**

**A. Portfolio Summary**
- **Total Value:** $125,430.50
- **Cash:** $25,430.50
- **Positions Value:** $100,000.00
- **Unrealized P&L:** $5,430.50
- **Realized P&L (Today):** $2,345.67
- **Total P&L (Today):** $7,776.17

**B. Asset Allocation**
- Pie chart by asset class
- Pie chart by currency
- Pie chart by strategy
- Exposure breakdown

**C. Position List**
- Table of all open positions
- Columns:
  - Symbol
  - Side (Long/Short)
  - Quantity
  - Entry Price
  - Current Price
  - Unrealized P&L
  - Unrealized P&L %
  - Strategy
- Actions: Close position, Add to position

**D. Risk Metrics**
- **Gross Exposure:** $100,000
- **Net Exposure:** $20,000
- **Leverage:** 2.5x
- **Max Drawdown:** -5.2%
- **Sharpe Ratio:** 1.8
- **Sortino Ratio:** 2.3

**E. Performance Charts**
- Equity curve
- Drawdown chart
- P&L distribution
- Win rate by symbol

**User Actions:**
- View portfolio details
- Analyze positions
- Close positions
- Monitor risk
- Export portfolio report

**Data Sources:**
- PostgreSQL: positions, trades, accounts
- Nautilus Core: live prices
- Redis: cached calculations
- TiDB: strategy assignments

---

### 3. Market Watch (`/market-watch`)

**Mục Đích:**
- Monitor real-time market data
- Track multiple instruments
- Identify trading opportunities

**Nghiệp Vụ:**

**A. Watchlist**
- List of tracked instruments
- Customizable columns:
  - Symbol
  - Bid/Ask
  - Last Price
  - Change %
  - Volume
  - High/Low
  - Time
- Real-time updates via WebSocket
- Color coding (green=up, red=down)

**B. Market Data**
- **Level 1:** Best bid/ask
- **Level 2:** Order book depth (planned)
- **Level 3:** Full market depth (planned)
- Time & Sales (recent trades)

**C. Charts**
- Candlestick charts
- Multiple timeframes (1m, 5m, 15m, 1h, 4h, 1D)
- Technical indicators
- Drawing tools

**D. Watchlist Management**
- Add/remove instruments
- Create multiple watchlists
- Save watchlist configurations
- Import/export watchlists

**E. Quick Trade**
- Quick order entry from watchlist
- One-click trading
- Pre-set order sizes
- Quick position sizing

**User Actions:**
- Monitor market data
- Add/remove instruments
- View charts
- Place quick trades
- Analyze market movements

**Data Sources:**
- Nautilus Core: Data Feed Handler
- PostgreSQL: instruments
- Redis: live market data
- WebSocket: real-time updates

---

## 💹 TRADING (4 pages)

### 4. Live Trading (`/live-trading`)

**Mục Đích:**
- Execute live trades
- Manage orders in real-time
- Monitor execution quality

**Nghiệp Vụ:**

**A. Order Entry Panel**

**Order Type Selection:**
- Market Order
- Limit Order
- Stop Order
- Stop-Limit Order
- Trailing Stop
- Iceberg Order
- TWAP (Time-Weighted Average Price)
- VWAP (Volume-Weighted Average Price)

**Order Parameters:**
- **Symbol:** Dropdown or search
- **Side:** Buy / Sell
- **Quantity:** Number input
- **Price:** (for limit orders)
- **Stop Price:** (for stop orders)
- **Time in Force:**
  - GTC (Good Till Cancel)
  - IOC (Immediate or Cancel)
  - FOK (Fill or Kill)
  - DAY (Day order)
- **Account:** Select trading account

**B. Position Sizing Calculator**
- Risk-based sizing
- Percentage of portfolio
- Fixed dollar amount
- Kelly Criterion
- Volatility-based sizing

**C. Risk Calculator**
- Calculate position risk
- Stop loss placement
- Risk/Reward ratio
- Expected P&L
- Portfolio impact

**D. Order Preview**
- Review order details
- Estimated costs (commission, slippage)
- Risk metrics
- Confirm/Cancel

**E. Active Orders Panel**
- List of pending orders
- Order status (Pending, Partially Filled, Filled, Cancelled, Rejected)
- Modify order
- Cancel order
- Cancel all orders

**F. Execution Monitor**
- Real-time order updates
- Fill notifications
- Execution quality metrics
- Slippage tracking

**G. Quick Actions**
- Flatten all positions
- Cancel all orders
- Reverse position
- Close position

**User Actions:**
- Place market/limit orders
- Calculate position size
- Calculate risk
- Monitor order execution
- Modify/cancel orders
- Manage positions

**Data Sources:**
- Nautilus Core: Execution Engine, OMS
- PostgreSQL: orders, positions, accounts
- Redis: live order status
- Broker APIs: order submission

---

### 5. Positions (`/positions`)

**Mục Đích:**
- View all open positions
- Manage positions
- Monitor P&L

**Nghiệp Vụ:**

**A. Position List**

**Table Columns:**
- Symbol
- Side (Long/Short)
- Quantity
- Entry Price
- Current Price
- Unrealized P&L
- Unrealized P&L %
- Duration (time held)
- Strategy (if from algo)
- Account

**Filters:**
- By symbol
- By side (Long/Short)
- By strategy
- By account
- By P&L (profitable/losing)

**Sorting:**
- By symbol
- By P&L
- By size
- By duration

**B. Position Details**

Click on position to view:
- Entry details (time, price, quantity)
- Current status (price, P&L)
- Trade history (all fills)
- Associated orders
- Risk metrics
- Exit plan

**C. Position Actions**

**Close Position:**
- Market close
- Limit close
- Partial close
- Close with stop

**Modify Position:**
- Add to position
- Reduce position
- Set stop loss
- Set take profit
- Trailing stop

**D. Position Analytics**
- P&L chart over time
- Entry vs current price
- Risk/Reward achieved
- Time in trade
- Drawdown from peak

**E. Aggregate Metrics**
- Total positions: 5
- Total unrealized P&L: $5,430.50
- Largest winner: $2,500
- Largest loser: -$800
- Average P&L: $1,086.10

**User Actions:**
- View all positions
- Filter/sort positions
- Close positions
- Modify positions
- Analyze position performance

**Data Sources:**
- PostgreSQL: positions, trades
- Nautilus Core: live prices
- Redis: cached P&L
- TiDB: strategy info

---

### 6. Orders (`/orders`)

**Mục Đích:**
- View all orders (active and historical)
- Manage active orders
- Analyze order execution

**Nghiệp Vụ:**

**A. Order List**

**Tabs:**
- Active Orders (pending, partially filled)
- Filled Orders (completed)
- Cancelled Orders
- Rejected Orders
- All Orders

**Table Columns:**
- Order ID
- Time
- Symbol
- Side (Buy/Sell)
- Type (Market, Limit, Stop, etc.)
- Quantity
- Price
- Filled Quantity
- Avg Fill Price
- Status
- Account
- Strategy

**B. Order Filters**
- By symbol
- By side
- By type
- By status
- By account
- By strategy
- By time range

**C. Order Actions**

**For Active Orders:**
- Modify order (price, quantity)
- Cancel order
- Cancel all orders for symbol
- Cancel all orders

**For Historical Orders:**
- View order details
- View fill history
- Analyze execution quality

**D. Order Details**

Click on order to view:
- Order parameters
- Fill history (all partial fills)
- Execution quality metrics
- Slippage analysis
- Commission costs
- Time to fill
- Order events log

**E. Execution Analytics**
- Fill rate
- Average slippage
- Average time to fill
- Rejection rate
- Execution quality score

**F. Quick Actions**
- Resubmit order
- Clone order (create similar)
- Export order history

**User Actions:**
- View all orders
- Filter/sort orders
- Modify active orders
- Cancel orders
- Analyze execution
- Export order data

**Data Sources:**
- PostgreSQL: orders table
- Nautilus Core: OMS, Execution Engine
- Redis: live order status
- Broker APIs: order updates

---

### 7. Trade History (`/trade-history`)

**Mục Đích:**
- View all executed trades
- Analyze trading performance
- Learn from past trades

**Nghiệp Vụ:**

**A. Trade List**

**Table Columns:**
- Trade ID
- Time
- Symbol
- Side (Buy/Sell)
- Quantity
- Price
- Commission
- P&L (if closed position)
- Strategy
- Account

**Filters:**
- By symbol
- By side
- By strategy
- By account
- By time range (today, week, month, year, all)
- By P&L (profitable/losing)

**Sorting:**
- By time (newest/oldest)
- By P&L
- By size
- By symbol

**B. Trade Details**

Click on trade to view:
- Trade execution details
- Associated order
- Position impact
- Commission breakdown
- P&L calculation (if closed)
- Market conditions at time
- Strategy context

**C. Trade Analytics**

**Performance Metrics:**
- Total trades: 150
- Winning trades: 90 (60%)
- Losing trades: 60 (40%)
- Average win: $500
- Average loss: -$300
- Win/Loss ratio: 1.67
- Profit factor: 2.5
- Total P&L: $27,000

**Distribution Charts:**
- P&L distribution histogram
- Win rate by symbol
- Win rate by time of day
- Win rate by strategy
- Trade size distribution

**D. Trade Journal**
- Add notes to trades
- Tag trades (setup type, market condition)
- Upload screenshots
- Review notes later

**E. Export & Reporting**
- Export to CSV/Excel
- Generate trade report (PDF)
- Tax reporting
- Performance report

**User Actions:**
- View trade history
- Filter/sort trades
- Analyze performance
- Add trade notes
- Export data
- Generate reports

**Data Sources:**
- PostgreSQL: trades table
- TiDB: strategies, tags, notes
- Calculated metrics
- Historical market data

---

## 🧪 BACKTESTING (4 pages)

### 8. Quick Backtest (`/quick-backtest`)

**Mục Đích:**
- Quickly test strategy ideas
- Simple backtesting interface
- Fast iteration

**Nghiệp Vụ:**

**A. Strategy Selection**
- Select from existing strategies
- Or create simple strategy inline

**B. Backtest Configuration**

**Basic Parameters:**
- **Symbol:** Select instrument
- **Timeframe:** 1m, 5m, 15m, 1h, 4h, 1D
- **Start Date:** Date picker
- **End Date:** Date picker
- **Initial Capital:** $10,000 (default)
- **Commission:** 0.1% (default)

**Simple Strategy Rules:**
- Entry condition (e.g., "RSI < 30")
- Exit condition (e.g., "RSI > 70")
- Position size (fixed or percentage)
- Stop loss (optional)
- Take profit (optional)

**C. Run Backtest**
- Click "Run Backtest" button
- Progress indicator
- Estimated time
- Cancel option

**D. Results Display**

**Summary Metrics:**
- Total Return: +25.3%
- Sharpe Ratio: 1.8
- Max Drawdown: -8.5%
- Win Rate: 58%
- Total Trades: 45
- Profit Factor: 2.1

**Equity Curve:**
- Line chart of portfolio value
- Drawdown overlay
- Trade markers

**Trade List:**
- All trades executed
- Entry/exit prices
- P&L per trade

**E. Quick Actions**
- Save backtest
- Modify parameters and re-run
- Export results
- Deploy to live (if good results)

**User Actions:**
- Configure backtest
- Run backtest
- View results
- Iterate quickly
- Save successful strategies

**Data Sources:**
- PostgreSQL: historical bars, ticks
- Parquet: archived data
- Nautilus Core: backtesting engine
- TiDB: save backtest results

---

### 9. Advanced Backtest (`/advanced-backtest`)

**Mục Đích:**
- Comprehensive backtesting
- Advanced features
- Detailed analysis

**Nghiệp Vụ:**

**A. Strategy Configuration**

**Strategy Source:**
- Select existing strategy
- Upload strategy file (Python)
- Use Strategy Builder
- Import from library

**B. Backtest Configuration**

**Market Data:**
- **Instruments:** Multiple symbols
- **Timeframe:** Multiple timeframes
- **Date Range:** Start/End dates
- **Data Quality:** Tick, Bar, Quote
- **Venues:** Select exchanges

**Execution Settings:**
- **Fill Model:** 
  - Immediate fill
  - Realistic slippage
  - Order book simulation
  - Custom model
- **Commission Model:**
  - Fixed per trade
  - Percentage
  - Tiered
  - Custom
- **Latency Simulation:**
  - Network latency
  - Exchange latency
  - Processing latency

**Risk Management:**
- **Initial Capital:** $100,000
- **Max Position Size:** 10% of capital
- **Max Positions:** 5 concurrent
- **Stop Loss:** Global or per-position
- **Take Profit:** Global or per-position
- **Risk Limits:** Daily loss limit, etc.

**Advanced Options:**
- **Slippage Model:** Conservative, Realistic, Aggressive
- **Market Impact:** Model large order impact
- **Funding Costs:** Overnight fees
- **Dividends:** Include dividend payments
- **Splits:** Handle stock splits
- **Survivorship Bias:** Avoid bias

**C. Run Backtest**
- Validate configuration
- Estimate runtime
- Run backtest
- Progress tracking
- Resource monitoring

**D. Comprehensive Results**

**Performance Metrics (50+ metrics):**

**Returns:**
- Total Return
- Annualized Return
- Monthly Returns
- Daily Returns
- Risk-Free Rate
- Excess Return

**Risk Metrics:**
- Volatility (annualized)
- Sharpe Ratio
- Sortino Ratio
- Calmar Ratio
- Max Drawdown
- Average Drawdown
- Drawdown Duration
- Value at Risk (VaR)
- Conditional VaR

**Trade Statistics:**
- Total Trades
- Winning Trades
- Losing Trades
- Win Rate
- Average Win
- Average Loss
- Win/Loss Ratio
- Profit Factor
- Expectancy
- Average Trade Duration
- Max Consecutive Wins
- Max Consecutive Losses

**Position Statistics:**
- Average Position Size
- Max Position Size
- Average Holding Period
- Turnover Rate
- Exposure Time

**Costs:**
- Total Commission
- Total Slippage
- Total Funding Costs
- Net P&L after costs

**E. Visualization**

**Charts:**
- Equity curve with drawdown
- Monthly returns heatmap
- Rolling Sharpe ratio
- Underwater plot (drawdown)
- Trade distribution
- P&L distribution
- Win rate by month/day/hour
- Position exposure over time

**F. Trade Analysis**
- Trade-by-trade breakdown
- Entry/exit analysis
- Holding period analysis
- P&L attribution
- Worst trades
- Best trades

**G. Comparison**
- Compare with benchmark
- Compare multiple strategies
- Compare different parameters
- Compare different periods

**H. Export & Reporting**
- Export results (CSV, Excel, JSON)
- Generate PDF report
- Export charts
- Export trade log

**I. Save & Deploy**
- Save backtest configuration
- Save results
- Deploy to paper trading
- Deploy to live trading

**User Actions:**
- Configure advanced backtest
- Run comprehensive backtest
- Analyze detailed results
- Compare strategies
- Export reports
- Deploy successful strategies

**Data Sources:**
- PostgreSQL: historical data
- Parquet: archived data
- Nautilus Core: backtesting engine
- TiDB: save backtest configs and results
- External: benchmark data

---

### 10. Walk-Forward (`/walk-forward`)

**Mục Đích:**
- Validate strategy robustness
- Avoid overfitting
- Test out-of-sample performance

**Nghiệp Vụ:**

**A. Walk-Forward Concept**

Walk-forward analysis divides data into multiple periods:
- **In-Sample (IS):** Training period for optimization
- **Out-of-Sample (OOS):** Testing period for validation

Process:
1. Optimize strategy on IS period
2. Test optimized parameters on OOS period
3. Roll forward to next period
4. Repeat

**B. Configuration**

**Data Settings:**
- **Total Date Range:** 2020-01-01 to 2024-12-31
- **In-Sample Period:** 6 months
- **Out-of-Sample Period:** 3 months
- **Step Size:** 3 months (rolling window)
- **Anchored:** Yes/No (anchored vs rolling)

**Strategy Settings:**
- Select strategy
- Define parameters to optimize
- Define parameter ranges

**Optimization Settings:**
- Optimization metric (Sharpe, Return, Profit Factor)
- Optimization method (Grid search, Genetic algorithm)
- Constraints

**C. Run Walk-Forward**
- Calculate number of iterations
- Estimate runtime
- Run analysis
- Progress tracking

**D. Results**

**Aggregate Metrics:**
- **OOS Total Return:** +18.5%
- **OOS Sharpe Ratio:** 1.6
- **OOS Max Drawdown:** -7.2%
- **IS vs OOS Correlation:** 0.75
- **Robustness Score:** 8.5/10

**Period-by-Period Results:**
- Table showing each IS/OOS period
- Optimized parameters per period
- IS performance
- OOS performance
- Performance degradation

**E. Visualization**
- Equity curve (IS vs OOS)
- Parameter stability chart
- Performance consistency
- Degradation analysis

**F. Robustness Analysis**
- Parameter sensitivity
- Stability over time
- Consistency across periods
- Overfitting detection

**User Actions:**
- Configure walk-forward
- Run analysis
- Evaluate robustness
- Identify overfitting
- Refine strategy
- Deploy if robust

**Data Sources:**
- PostgreSQL: historical data
- Nautilus Core: backtesting + optimization
- TiDB: save walk-forward results

---

### 11. Optimization (`/optimization`)

**Mục Đích:**
- Find optimal strategy parameters
- Systematic parameter search
- Improve strategy performance

**Nghiệp Vụ:**

**A. Strategy Selection**
- Select strategy to optimize
- View current parameters
- Define parameters to optimize

**B. Parameter Configuration**

**For each parameter:**
- **Name:** e.g., "RSI Period"
- **Type:** Integer, Float, Boolean, Categorical
- **Range:** Min/Max or list of values
- **Step:** Increment size
- **Default:** Current value

**Example:**
- RSI Period: 10 to 30, step 2
- RSI Oversold: 20 to 40, step 5
- RSI Overbought: 60 to 80, step 5
- Stop Loss %: 1% to 5%, step 0.5%

**C. Optimization Method**

**Grid Search:**
- Test all combinations
- Exhaustive search
- Guaranteed to find best
- Slow for many parameters

**Random Search:**
- Random sampling
- Faster than grid
- May miss optimal
- Good for many parameters

**Genetic Algorithm:**
- Evolutionary approach
- Efficient search
- Good for complex spaces
- May find local optima

**Bayesian Optimization:**
- Smart sampling
- Learns from previous tests
- Efficient
- Good for expensive evaluations

**D. Optimization Objective**

**Metrics to Optimize:**
- Sharpe Ratio (default)
- Total Return
- Profit Factor
- Calmar Ratio
- Custom metric

**Constraints:**
- Min trades (e.g., > 30)
- Max drawdown (e.g., < 15%)
- Min win rate (e.g., > 45%)

**E. Run Optimization**
- Calculate number of combinations
- Estimate runtime
- Run optimization
- Progress tracking (X of Y completed)
- Best result so far
- Cancel option

**F. Results**

**Best Parameters:**
- Display optimal parameters found
- Performance with best parameters
- Comparison to default parameters

**Parameter Sensitivity:**
- Heatmap of parameter combinations
- 3D surface plots
- Sensitivity analysis
- Robust parameter ranges

**All Results:**
- Table of all tested combinations
- Sort by performance
- Filter by constraints
- Export results

**G. Visualization**
- Parameter heatmaps
- Performance distribution
- Equity curves comparison
- Drawdown comparison

**H. Validation**
- Run backtest with optimal parameters
- Walk-forward with optimal parameters
- Out-of-sample testing

**I. Actions**
- Save optimal parameters
- Update strategy
- Run backtest
- Deploy strategy

**User Actions:**
- Configure optimization
- Select optimization method
- Run optimization
- Analyze results
- Validate parameters
- Update strategy

**Data Sources:**
- PostgreSQL: historical data
- Nautilus Core: optimization engine
- TiDB: save optimization results
- Parallel processing for speed

---

## 🛠️ STRATEGIES (4 pages)

### 12. My Strategies (`/my-strategies`)

**Mục Đích:**
- View all user's strategies
- Manage strategies
- Monitor strategy performance

**Nghiệp Vụ:**

**A. Strategy List**

**Table Columns:**
- Strategy Name
- Type (Algorithmic, Manual, Hybrid)
- Status (Active, Paused, Stopped, Backtesting)
- Instruments
- Timeframe
- Created Date
- Last Modified
- Performance (if deployed)
- Actions

**Filters:**
- By status
- By type
- By instrument
- By performance

**Sorting:**
- By name
- By created date
- By performance

**B. Strategy Cards**

Alternative view: Card layout
- Strategy name and description
- Key metrics (if deployed)
- Quick actions
- Visual status indicator

**C. Strategy Actions**

**For Each Strategy:**
- **View:** View strategy details
- **Edit:** Modify strategy code/parameters
- **Backtest:** Run backtest
- **Deploy:** Deploy to paper/live
- **Clone:** Create copy
- **Delete:** Remove strategy
- **Export:** Export strategy file
- **Share:** Share with team (future)

**D. Strategy Details**

Click on strategy to view:
- Strategy description
- Strategy code (if algorithmic)
- Parameters
- Instruments
- Timeframe
- Entry/exit rules
- Risk management rules
- Backtest results
- Live performance (if deployed)
- Trade history

**E. Quick Deploy**
- Select strategy
- Choose account (paper/live)
- Configure parameters
- Deploy

**F. Bulk Actions**
- Select multiple strategies
- Bulk delete
- Bulk backtest
- Bulk export

**User Actions:**
- View all strategies
- Filter/sort strategies
- Create new strategy
- Edit strategies
- Backtest strategies
- Deploy strategies
- Delete strategies

**Data Sources:**
- TiDB: strategies table
- PostgreSQL: backtest results, live trades
- Nautilus Core: deployed strategy status
- File system: strategy code files

---

### 13. Strategy Builder (`/strategy-builder`)

**Mục Đích:**
- Build strategies visually or with code
- No-code/low-code strategy creation
- Rapid prototyping

**Nghiệp Vụ:**

**A. Builder Modes**

**Visual Builder (No-Code):**
- Drag-and-drop interface
- Block-based logic
- Pre-built components
- Visual flow

**Code Editor (Low-Code):**
- Python code editor
- Syntax highlighting
- Auto-completion
- Code templates

**Hybrid Mode:**
- Combine visual and code
- Best of both worlds

**B. Strategy Components**

**Entry Conditions:**
- Technical indicators (RSI, MACD, MA, etc.)
- Price patterns
- Volume conditions
- Time conditions
- Custom conditions

**Exit Conditions:**
- Technical indicators
- Price targets
- Time-based exits
- Trailing stops
- Custom conditions

**Risk Management:**
- Position sizing
- Stop loss
- Take profit
- Max positions
- Max loss per day

**Order Management:**
- Order types
- Time in force
- Execution logic

**C. Visual Builder Interface**

**Components Panel:**
- Indicators
- Conditions
- Actions
- Logic blocks (AND, OR, NOT)

**Canvas:**
- Drag components to canvas
- Connect components
- Configure parameters
- Visualize logic flow

**Properties Panel:**
- Configure selected component
- Set parameters
- Add conditions

**D. Code Editor Interface**

**Editor:**
- Python code editor
- Line numbers
- Syntax highlighting
- Error highlighting
- Auto-completion

**Templates:**
- Mean reversion template
- Trend following template
- Breakout template
- Custom template

**Helper Functions:**
- Indicator library
- Order functions
- Position management
- Risk calculations

**E. Strategy Configuration**

**Basic Info:**
- Strategy name
- Description
- Tags
- Author

**Instruments:**
- Select instruments
- Multiple instruments support

**Timeframe:**
- Select timeframe
- Multiple timeframes support

**Parameters:**
- Define strategy parameters
- Set default values
- Set ranges for optimization

**F. Testing**

**Syntax Check:**
- Validate code
- Check for errors
- Suggest fixes

**Backtest:**
- Quick backtest
- View results
- Iterate

**Paper Trading:**
- Deploy to paper account
- Test in real-time
- No real money risk

**G. Save & Deploy**
- Save strategy
- Version control
- Deploy to live
- Export code

**User Actions:**
- Create strategy visually or with code
- Configure strategy parameters
- Test strategy
- Save strategy
- Deploy strategy

**Data Sources:**
- TiDB: save strategy
- Nautilus Core: indicator library
- File system: strategy code
- Templates library

---

### 14. Strategy Library (`/strategy-library`)

**Mục Đích:**
- Browse pre-built strategies
- Learn from examples
- Quick start with proven strategies

**Nghiệp Vụ:**

**A. Library Categories**

**By Strategy Type:**
- Trend Following
- Mean Reversion
- Breakout
- Momentum
- Arbitrage
- Market Making
- Statistical Arbitrage

**By Asset Class:**
- Forex
- Crypto
- Stocks
- Futures
- Options

**By Complexity:**
- Beginner
- Intermediate
- Advanced

**By Performance:**
- Top Rated
- Most Used
- Best Backtests

**B. Strategy Cards**

**For Each Strategy:**
- Strategy name
- Description
- Author
- Rating (stars)
- Number of users
- Backtest performance
- Tags
- Preview button

**C. Strategy Details**

Click on strategy to view:
- Full description
- Strategy logic
- Entry/exit rules
- Risk management
- Backtest results
- User reviews
- Sample trades
- Code preview (if available)

**D. Strategy Actions**

**For Each Strategy:**
- **Preview:** View details
- **Clone:** Copy to My Strategies
- **Backtest:** Run backtest with your data
- **Deploy:** Deploy to paper/live
- **Rate:** Rate strategy
- **Review:** Write review
- **Share:** Share with others

**E. Filters & Search**
- Search by name/description
- Filter by category
- Filter by asset class
- Filter by complexity
- Filter by rating
- Sort by popularity/rating/date

**F. Featured Strategies**
- Highlighted strategies
- Editor's picks
- Community favorites
- New additions

**G. Community**
- User ratings
- User reviews
- Discussion forums
- Strategy requests

**User Actions:**
- Browse strategies
- Search strategies
- View strategy details
- Clone strategies
- Backtest strategies
- Deploy strategies
- Rate and review

**Data Sources:**
- TiDB: strategy library
- Community ratings and reviews
- Backtest results
- Usage statistics

---

### 15. Deploy Strategy (`/deploy-strategy`)

**Mục Đích:**
- Deploy strategies to paper or live trading
- Configure deployment settings
- Monitor deployed strategies

**Nghiệp Vụ:**

**A. Strategy Selection**
- Select strategy from My Strategies
- View strategy details
- Review backtest results

**B. Deployment Configuration**

**Account Selection:**
- **Paper Trading:** Simulated account
- **Live Trading:** Real money account

**Instruments:**
- Select instruments to trade
- Multiple instruments support
- Instrument-specific parameters

**Capital Allocation:**
- Total capital for strategy
- Per-instrument allocation
- Reserve cash

**Risk Limits:**
- Max position size
- Max positions
- Max daily loss
- Max drawdown
- Stop trading conditions

**Execution Settings:**
- Order types
- Slippage tolerance
- Timeout settings
- Retry logic

**Scheduling:**
- Start time
- End time
- Trading hours
- Exclude dates (holidays)

**Notifications:**
- Email notifications
- Slack notifications
- Webhook notifications
- Alert conditions

**C. Pre-Deployment Checks**

**Validation:**
- Strategy code validation
- Parameter validation
- Risk limit validation
- Account balance check
- Broker connection check

**Simulation:**
- Run 1-day simulation
- Verify behavior
- Check order generation

**D. Deploy**
- Review configuration
- Confirm deployment
- Deploy strategy
- Monitor startup

**E. Deployment Status**

**After Deployment:**
- Strategy status (Running, Paused, Stopped, Error)
- Uptime
- Orders generated
- Positions opened
- P&L
- Errors/warnings

**F. Manage Deployment**

**Actions:**
- **Pause:** Temporarily pause strategy
- **Resume:** Resume paused strategy
- **Stop:** Stop strategy completely
- **Modify:** Change parameters (some)
- **View Logs:** View strategy logs
- **View Trades:** View trades generated

**G. Monitoring**

**Real-Time Metrics:**
- Current positions
- Open orders
- P&L (realized + unrealized)
- Win rate
- Sharpe ratio
- Drawdown

**Alerts:**
- Risk limit breaches
- Errors
- Unusual behavior
- Performance degradation

**H. Emergency Controls**
- Flatten all positions
- Cancel all orders
- Emergency stop
- Risk override

**User Actions:**
- Select strategy
- Configure deployment
- Validate configuration
- Deploy strategy
- Monitor strategy
- Pause/resume/stop
- Manage risk

**Data Sources:**
- TiDB: strategies, deployment configs
- PostgreSQL: live trades, positions, orders
- Nautilus Core: strategy execution
- Redis: live status
- Broker APIs: order execution

---

## 📈 ANALYTICS (1 page)

### 16. Performance (`/performance`)

**Mục Đích:**
- Comprehensive performance analysis
- Identify strengths and weaknesses
- Improve trading results

**Nghiệp Vụ:**

**A. Performance Overview**

**Time Period Selector:**
- Today
- This Week
- This Month
- This Quarter
- This Year
- All Time
- Custom Range

**Key Metrics:**
- Total Return
- Annualized Return
- Sharpe Ratio
- Max Drawdown
- Win Rate
- Profit Factor
- Total Trades
- Total P&L

**B. Performance Charts**

**Equity Curve:**
- Portfolio value over time
- Benchmark comparison
- Drawdown overlay

**Monthly Returns:**
- Heatmap of monthly returns
- Year-over-year comparison

**Rolling Metrics:**
- Rolling Sharpe ratio
- Rolling volatility
- Rolling drawdown

**C. Trade Analytics**

**Trade Statistics:**
- Total trades
- Winning trades
- Losing trades
- Win rate
- Average win
- Average loss
- Win/loss ratio
- Profit factor
- Expectancy
- Average trade duration

**Trade Distribution:**
- P&L histogram
- Trade size distribution
- Holding period distribution
- Win rate by symbol
- Win rate by strategy
- Win rate by time of day
- Win rate by day of week

**D. Risk Analytics**

**Risk Metrics:**
- Volatility (daily, annualized)
- Sharpe Ratio
- Sortino Ratio
- Calmar Ratio
- Max Drawdown
- Average Drawdown
- Drawdown Duration
- Value at Risk (VaR)
- Conditional VaR (CVaR)
- Beta (vs benchmark)
- Alpha

**Risk Charts:**
- Drawdown chart
- Volatility chart
- Risk-adjusted returns
- Risk contribution by position

**E. Attribution Analysis**

**P&L Attribution:**
- By strategy
- By instrument
- By time period
- By market condition

**Performance Drivers:**
- Best performing strategies
- Best performing instruments
- Best performing time periods
- Worst performers

**F. Comparison**

**Benchmark Comparison:**
- vs S&P 500
- vs custom benchmark
- Correlation
- Beta
- Alpha
- Information ratio

**Strategy Comparison:**
- Compare multiple strategies
- Side-by-side metrics
- Correlation matrix

**G. Advanced Analytics**

**Statistical Analysis:**
- Return distribution
- Normality tests
- Skewness
- Kurtosis
- Autocorrelation

**Factor Analysis:**
- Market factor
- Size factor
- Value factor
- Momentum factor
- Custom factors

**H. Reports**

**Generate Reports:**
- Daily performance report
- Weekly performance report
- Monthly performance report
- Quarterly performance report
- Annual performance report
- Custom report

**Export:**
- Export to PDF
- Export to Excel
- Export to CSV
- Email report

**User Actions:**
- View performance metrics
- Analyze trades
- Analyze risk
- Compare strategies
- Generate reports
- Export data

**Data Sources:**
- PostgreSQL: trades, positions, orders
- TiDB: strategies, backtests
- Calculated metrics
- Benchmark data
- Market data

---

## 🚪 UTILITY (1 page)

### 17. Exit Platform (`/exit`)

**Mục Đích:**
- Safely exit trading platform
- Return to landing page

**Nghiệp Vụ:**

**A. Exit Confirmation**
- Confirm exit intent
- Warning if active strategies
- Warning if open positions
- Save unsaved work

**B. Safety Checks**
- Check for active strategies
- Check for open positions
- Check for pending orders
- Recommend actions

**C. Session Cleanup**
- Clear session data
- Revoke temporary tokens
- Log logout event

**User Actions:**
- Exit platform
- Return to landing page

---

## 🔄 Luồng Nghiệp Vụ Chi Tiết

### Workflow 1: Manual Trading - Place Live Trade

**Actor:** Discretionary Trader  
**Goal:** Execute a manual trade based on market analysis  
**Frequency:** Multiple times per day

**Steps:**

1. **Monitor Market**
   - Navigate to Market Watch
   - Add EURUSD to watchlist
   - Monitor price action
   - View candlestick chart (15m timeframe)
   - Identify bullish breakout pattern

2. **Analyze Opportunity**
   - Check technical indicators:
     - RSI: 55 (neutral)
     - MACD: Bullish crossover
     - Volume: Increasing
   - Check support/resistance levels
   - Identify entry price: 1.0850
   - Identify stop loss: 1.0830 (-20 pips)
   - Identify take profit: 1.0900 (+50 pips)
   - Risk/Reward: 1:2.5 (good)

3. **Navigate to Live Trading**
   - Click "Live Trading" in sidebar
   - Order entry panel opens

4. **Configure Order**
   - **Symbol:** EURUSD
   - **Side:** Buy
   - **Order Type:** Limit Order
   - **Price:** 1.0850
   - **Quantity:** Calculate using position sizing calculator

5. **Calculate Position Size**
   - Click "Position Sizing Calculator"
   - **Risk Amount:** $500 (0.5% of $100,000 portfolio)
   - **Stop Loss:** 20 pips
   - **Calculator Result:** 25,000 units (0.25 lots)
   - Apply to order

6. **Verify Risk**
   - Click "Risk Calculator"
   - **Position Size:** 25,000 units
   - **Entry:** 1.0850
   - **Stop Loss:** 1.0830
   - **Risk:** $500 ✓
   - **Potential Profit:** $1,250
   - **Risk/Reward:** 1:2.5 ✓
   - **Portfolio Impact:** 0.5% risk ✓

7. **Review Order**
   - Order preview displays:
     - Symbol: EURUSD
     - Side: Buy
     - Type: Limit
     - Price: 1.0850
     - Quantity: 25,000
     - Stop Loss: 1.0830
     - Take Profit: 1.0900
     - Estimated Commission: $5
     - Risk: $500
     - Potential Profit: $1,250

8. **Submit Order**
   - Click "Submit Order"
   - Order sent to Nautilus Core
   - Order forwarded to broker
   - Order ID received: ORD-123456

9. **Monitor Order**
   - Order appears in "Active Orders" panel
   - Status: Pending
   - Wait for fill

10. **Order Filled**
    - Price reaches 1.0850
    - Order filled
    - Fill notification received
    - Status changes to: Filled
    - Position opened

11. **Monitor Position**
    - Navigate to Positions
    - View EURUSD position:
      - Side: Long
      - Quantity: 25,000
      - Entry: 1.0850
      - Current: 1.0855
      - Unrealized P&L: +$125
    - Stop loss and take profit orders automatically placed

12. **Position Management**
    - Monitor price movement
    - Adjust stop loss if needed (trailing stop)
    - Wait for take profit or stop loss

13. **Position Closed**
    - Price reaches 1.0900 (take profit)
    - Position automatically closed
    - Realized P&L: +$1,250
    - Trade recorded in Trade History

14. **Review Trade**
    - Navigate to Trade History
    - Find trade
    - Add notes: "Bullish breakout, good R:R"
    - Tag: "breakout", "trend-following"

**Success Criteria:**
- Order placed successfully
- Position sized correctly
- Risk managed properly
- Profit target achieved
- Trade documented

**Data Flow:**
- Market Watch → Nautilus Core (market data)
- Live Trading → Nautilus Core (order submission)
- Order → Broker API (execution)
- Fill → PostgreSQL (trades table)
- Position → PostgreSQL (positions table)
- Audit → TiDB (audit_logs table)

---

### Workflow 2: Algorithmic Trading - Develop and Deploy Strategy

**Actor:** Quantitative Trader  
**Goal:** Develop a mean reversion strategy, backtest it, and deploy to live trading  
**Frequency:** Weekly or as needed

**Steps:**

**Phase 1: Strategy Development**

1. **Navigate to Strategy Builder**
   - Click "Strategy Builder" in sidebar
   - Choose "Code Editor" mode

2. **Select Template**
   - Choose "Mean Reversion Template"
   - Template loads with basic structure

3. **Customize Strategy**
   - **Strategy Name:** "RSI Mean Reversion v1"
   - **Description:** "Buy when RSI < 30, sell when RSI > 70"
   - **Instruments:** EURUSD, GBPUSD
   - **Timeframe:** 1H

4. **Write Strategy Logic**
   ```python
   # Entry logic
   def on_bar(self, bar):
       rsi = self.indicators['rsi'].value
       
       if rsi < 30 and not self.has_position():
           # Oversold, buy
           self.buy(size=10000)
       
       elif rsi > 70 and self.has_position():
           # Overbought, sell
           self.close_position()
   ```

5. **Configure Parameters**
   - RSI Period: 14 (default)
   - RSI Oversold: 30
   - RSI Overbought: 70
   - Position Size: 10,000 units
   - Stop Loss: 2%
   - Take Profit: 3%

6. **Syntax Check**
   - Click "Check Syntax"
   - No errors found ✓

7. **Save Strategy**
   - Click "Save"
   - Strategy saved to My Strategies

**Phase 2: Backtesting**

8. **Navigate to Quick Backtest**
   - Click "Quick Backtest" in sidebar
   - Select "RSI Mean Reversion v1"

9. **Configure Backtest**
   - **Symbol:** EURUSD
   - **Timeframe:** 1H
   - **Start Date:** 2023-01-01
   - **End Date:** 2024-12-31
   - **Initial Capital:** $10,000
   - **Commission:** 0.1%

10. **Run Backtest**
    - Click "Run Backtest"
    - Progress: 100%
    - Completed in 5 seconds

11. **Review Results**
    - **Total Return:** +15.3%
    - **Sharpe Ratio:** 1.2
    - **Max Drawdown:** -8.5%
    - **Win Rate:** 52%
    - **Total Trades:** 78
    - **Profit Factor:** 1.8
    - Results look promising ✓

12. **Advanced Backtest**
    - Navigate to Advanced Backtest
    - Run with realistic slippage and commission
    - **Total Return:** +12.1% (still good)
    - **Sharpe Ratio:** 1.0
    - Save backtest results

**Phase 3: Optimization**

13. **Navigate to Optimization**
    - Click "Optimization" in sidebar
    - Select "RSI Mean Reversion v1"

14. **Configure Optimization**
    - **Parameters to Optimize:**
      - RSI Period: 10 to 20, step 2
      - RSI Oversold: 20 to 40, step 5
      - RSI Overbought: 60 to 80, step 5
    - **Method:** Grid Search
    - **Objective:** Sharpe Ratio
    - **Constraints:** Min 30 trades, Max 15% drawdown

15. **Run Optimization**
    - Click "Run Optimization"
    - 180 combinations to test
    - Estimated time: 15 minutes
    - Completed

16. **Review Optimal Parameters**
    - **Best Parameters:**
      - RSI Period: 14
      - RSI Oversold: 25
      - RSI Overbought: 75
    - **Performance:**
      - Sharpe Ratio: 1.5 (improved!)
      - Total Return: +18.7%
      - Max Drawdown: -7.2%

17. **Update Strategy**
    - Apply optimal parameters
    - Save updated strategy

**Phase 4: Walk-Forward Validation**

18. **Navigate to Walk-Forward**
    - Click "Walk-Forward" in sidebar
    - Select "RSI Mean Reversion v1"

19. **Configure Walk-Forward**
    - **Date Range:** 2020-01-01 to 2024-12-31
    - **In-Sample:** 6 months
    - **Out-of-Sample:** 3 months
    - **Step:** 3 months

20. **Run Walk-Forward**
    - Click "Run"
    - 15 periods to test
    - Completed

21. **Review Robustness**
    - **OOS Sharpe Ratio:** 1.3
    - **IS vs OOS Correlation:** 0.72
    - **Robustness Score:** 8/10
    - Strategy is robust ✓

**Phase 5: Paper Trading**

22. **Deploy to Paper Trading**
    - Navigate to Deploy Strategy
    - Select "RSI Mean Reversion v1"
    - **Account:** Paper Trading
    - **Instruments:** EURUSD, GBPUSD
    - **Capital:** $10,000
    - **Risk Limits:**
      - Max position size: $5,000
      - Max daily loss: $200
    - Click "Deploy"

23. **Monitor Paper Trading**
    - Strategy deployed successfully
    - Monitor for 2 weeks
    - Review performance:
      - Return: +2.1%
      - Sharpe: 1.4
      - Drawdown: -3.2%
      - Behavior as expected ✓

**Phase 6: Live Deployment**

24. **Deploy to Live Trading**
    - Navigate to Deploy Strategy
    - Select "RSI Mean Reversion v1"
    - **Account:** Live Trading
    - **Instruments:** EURUSD, GBPUSD
    - **Capital:** $50,000
    - **Risk Limits:**
      - Max position size: $25,000
      - Max daily loss: $1,000
      - Max drawdown: 10%
    - **Notifications:**
      - Email on errors
      - Slack on daily P&L
    - Review configuration
    - Click "Deploy"

25. **Confirm Deployment**
    - Pre-deployment checks passed ✓
    - Confirm deployment
    - Strategy deployed to live

26. **Monitor Live Trading**
    - Navigate to Dashboard
    - View "Active Strategies"
    - "RSI Mean Reversion v1" running
    - Monitor daily:
      - Trades executed
      - P&L
      - Drawdown
      - Errors

27. **Ongoing Management**
    - Review weekly performance
    - Adjust if needed
    - Pause if performance degrades
    - Optimize periodically

**Success Criteria:**
- Strategy developed successfully
- Backtest results positive
- Optimization improved performance
- Walk-forward validation passed
- Paper trading successful
- Live deployment successful
- Strategy running profitably

**Data Flow:**
- Strategy Builder → TiDB (strategy code)
- Backtest → PostgreSQL (historical data)
- Optimization → Nautilus Core (optimization engine)
- Walk-Forward → Nautilus Core + PostgreSQL
- Paper Trading → Simulated execution
- Live Trading → Nautilus Core → Broker APIs
- Performance → PostgreSQL (trades, positions)

---

### Workflow 3: Risk Management - Monitor and Manage Risk

**Actor:** Trader  
**Goal:** Monitor portfolio risk and take action if needed  
**Frequency:** Continuous (throughout trading day)

**Steps:**

1. **Start of Day - Check Portfolio**
   - Navigate to Dashboard
   - Review key metrics:
     - Portfolio Value: $125,430.50
     - Today's P&L: $0 (start of day)
     - Active Strategies: 3 running
     - Open Positions: 5

2. **Review Risk Metrics**
   - Navigate to Portfolio
   - Check risk metrics:
     - Gross Exposure: $100,000 (80% of capital) ✓
     - Net Exposure: $20,000 (16% of capital) ✓
     - Leverage: 2.5x ✓
     - Max Drawdown: -5.2% ✓
   - All within acceptable ranges

3. **Monitor Positions**
   - Navigate to Positions
   - Review each position:
     - EURUSD Long: +$500 (profitable)
     - GBPUSD Long: +$300 (profitable)
     - USDJPY Short: -$200 (small loss)
     - AUDUSD Long: +$100 (small profit)
     - GOLD Long: -$50 (small loss)
   - Total Unrealized P&L: +$650

4. **Mid-Day - Market Volatility Spike**
   - Alert received: "High volatility detected"
   - Navigate to Market Watch
   - Notice EURUSD dropping rapidly
   - EURUSD position now: -$800 (was +$500)

5. **Assess Situation**
   - Navigate to Positions
   - EURUSD position details:
     - Entry: 1.0850
     - Current: 1.0820 (-30 pips)
     - Unrealized P&L: -$800
     - Stop Loss: 1.0830 (not hit yet)
   - Decision: Let stop loss work

6. **Stop Loss Hit**
   - Price reaches 1.0830
   - Stop loss triggered
   - Position closed automatically
   - Realized P&L: -$500 (slippage)

7. **Re-Assess Portfolio Risk**
   - Navigate to Portfolio
   - Updated metrics:
     - Portfolio Value: $124,930.50 (-$500)
     - Today's P&L: -$500
     - Open Positions: 4 (EURUSD closed)
     - Gross Exposure: $75,000 (reduced)
   - Risk reduced automatically ✓

8. **Check Other Positions**
   - GBPUSD also affected by volatility
   - Now: -$100 (was +$300)
   - Decision: Tighten stop loss
   - Modify stop loss: 1.2650 → 1.2670 (closer)

9. **Monitor Strategies**
   - Navigate to Dashboard → Active Strategies
   - Check if strategies are behaving correctly
   - "RSI Mean Reversion v1": Running normally
   - "Trend Following v2": Paused (high volatility)
   - "Breakout v1": Running normally

10. **End of Day - Review**
    - Navigate to Performance
    - Daily performance:
      - Total P&L: -$200 (after all trades)
      - Win Rate: 60% (3 wins, 2 losses)
      - Max Drawdown: -2.1% (intraday)
    - Acceptable given volatility

11. **Risk Report**
    - Generate daily risk report
    - Export to PDF
    - Review:
      - Risk limits respected ✓
      - Stop losses worked ✓
      - No excessive losses ✓
      - Portfolio within risk tolerance ✓

12. **Prepare for Next Day**
    - Review positions to hold overnight
    - Adjust stop losses if needed
    - Review strategy settings
    - Set alerts for tomorrow

**Success Criteria:**
- Risk monitored continuously
- Stop losses worked as intended
- Portfolio risk within limits
- Losses contained
- Risk report generated

**Data Flow:**
- Portfolio → PostgreSQL (positions, accounts)
- Risk Metrics → Calculated from positions
- Alerts → Redis (real-time monitoring)
- Stop Loss → Nautilus Core → Broker
- Risk Report → Generated from PostgreSQL data

---

### Workflow 4: Performance Analysis - Monthly Review

**Actor:** Trader  
**Goal:** Analyze monthly performance and identify improvements  
**Frequency:** Monthly

**Steps:**

1. **Navigate to Performance**
   - Click "Performance" in sidebar
   - Select time period: "This Month"

2. **Review Overall Performance**
   - **Total Return:** +5.2%
   - **Sharpe Ratio:** 1.6
   - **Max Drawdown:** -3.8%
   - **Win Rate:** 58%
   - **Total Trades:** 145
   - **Total P&L:** +$6,500

3. **Analyze Equity Curve**
   - View equity curve chart
   - Identify:
     - Steady upward trend ✓
     - Two drawdown periods (early month, mid-month)
     - Strong recovery after drawdowns
     - New equity high at month end ✓

4. **Review Trade Statistics**
   - **Winning Trades:** 84 (58%)
   - **Losing Trades:** 61 (42%)
   - **Average Win:** $250
   - **Average Loss:** -$150
   - **Win/Loss Ratio:** 1.67
   - **Profit Factor:** 2.3
   - **Expectancy:** +$45 per trade

5. **Analyze Trade Distribution**
   - View P&L histogram
   - Most trades: -$100 to +$300 range
   - Few outliers (large wins/losses)
   - Distribution looks healthy ✓

6. **Performance by Strategy**
   - **RSI Mean Reversion v1:**
     - Return: +3.2%
     - Trades: 78
     - Win Rate: 55%
     - Best performer ✓
   
   - **Trend Following v2:**
     - Return: +1.8%
     - Trades: 45
     - Win Rate: 48%
     - Decent performance
   
   - **Breakout v1:**
     - Return: +0.2%
     - Trades: 22
     - Win Rate: 45%
     - Underperforming ⚠️

7. **Performance by Instrument**
   - **EURUSD:** +$2,500 (best)
   - **GBPUSD:** +$1,800
   - **USDJPY:** +$1,200
   - **AUDUSD:** +$500
   - **GOLD:** +$500

8. **Performance by Time**
   - **Best Day of Week:** Tuesday (+$1,500)
   - **Worst Day of Week:** Friday (-$200)
   - **Best Time of Day:** 8am-12pm London (+$3,000)
   - **Worst Time of Day:** 4pm-8pm NY (-$500)

9. **Identify Issues**
   - **Issue 1:** Breakout v1 strategy underperforming
     - Action: Review strategy logic
     - Action: Consider optimization
     - Action: May need to pause
   
   - **Issue 2:** Poor performance on Fridays
     - Possible cause: Weekend risk aversion
     - Action: Consider reducing positions before weekend
   
   - **Issue 3:** Two significant drawdown periods
     - Causes: High volatility events
     - Action: Review risk management
     - Action: Consider volatility filters

10. **Identify Strengths**
    - **Strength 1:** RSI Mean Reversion performing well
      - Action: Consider increasing allocation
    
    - **Strength 2:** EURUSD trading profitable
      - Action: Focus more on EURUSD
    
    - **Strength 3:** London session profitable
      - Action: Ensure strategies active during London hours

11. **Generate Report**
    - Click "Generate Report"
    - Select "Monthly Performance Report"
    - Report generated (PDF)
    - Includes:
      - Performance summary
      - Equity curve
      - Trade statistics
      - Strategy breakdown
      - Instrument breakdown
      - Risk metrics
      - Recommendations

12. **Export Data**
    - Export trade history to Excel
    - Export for further analysis
    - Archive for records

13. **Plan Actions for Next Month**
    - Optimize Breakout v1 strategy
    - Increase allocation to RSI Mean Reversion
    - Reduce Friday trading
    - Add volatility filters
    - Monitor closely

14. **Document Review**
    - Save report
    - Add notes to trading journal
    - Share with team (if applicable)

**Success Criteria:**
- Monthly performance reviewed
- Strengths identified
- Weaknesses identified
- Action plan created
- Report generated and saved

**Data Flow:**
- Performance → PostgreSQL (trades, positions)
- Analytics → Calculated metrics
- Report → PDF generation
- Export → CSV/Excel files
- Journal → TiDB (notes, tags)

---

## 👤 Vai Trò Trader và Quyền Hạn

### Trader Role

**Responsibilities:**
- Execute trading strategies (manual or algorithmic)
- Monitor markets and positions
- Develop and test strategies
- Manage risk
- Analyze performance
- Improve trading results

**Permissions:**
- ✅ execute_trades
- ✅ view_strategies (own only)
- ✅ create_strategies
- ✅ deploy_strategies (own only)
- ✅ view_backtests (own only)
- ✅ run_backtests
- ✅ view_analytics (own only)
- ❌ manage_users
- ❌ configure_risk_limits (global)
- ❌ manage_api_keys (others)
- ❌ view_audit_logs (full)
- ❌ manage_brokers

**Access:**
- ✅ Full access to Trader Platform (25 pages)
- ❌ No access to Admin Panel
- ✅ Trading APIs
- ✅ Strategy APIs
- ✅ Backtest APIs
- ✅ Performance APIs
- ❌ Admin APIs

**Data Access:**
- ✅ Own trades, positions, orders
- ✅ Own strategies, backtests
- ✅ Own performance data
- ✅ Market data
- ❌ Other users' data
- ❌ System configuration
- ❌ Full audit logs

---

## 📊 Tổng Kết

### Trader Platform - 25 Pages Breakdown

**DASHBOARD (3 pages):**
1. Overview - Portfolio snapshot
2. Portfolio - Detailed portfolio analysis
3. Market Watch - Real-time market monitoring

**TRADING (4 pages):**
4. Live Trading - Execute trades
5. Positions - Manage positions
6. Orders - Manage orders
7. Trade History - Analyze past trades

**BACKTESTING (4 pages):**
8. Quick Backtest - Fast strategy testing
9. Advanced Backtest - Comprehensive testing
10. Walk-Forward - Robustness validation
11. Optimization - Parameter optimization

**STRATEGIES (4 pages):**
12. My Strategies - Strategy management
13. Strategy Builder - Strategy development
14. Strategy Library - Pre-built strategies
15. Deploy Strategy - Strategy deployment

**ANALYTICS (1 page):**
16. Performance - Performance analysis

**UTILITY (1 page):**
17. Exit Platform - Safe exit

**PHASE 2 - NEW PAGES (8 pages):**
18-25. Enhanced versions of key pages

### Core Workflows

**1. Manual Trading:**
- Market analysis → Order entry → Execution → Position management → Trade review

**2. Algorithmic Trading:**
- Strategy development → Backtesting → Optimization → Validation → Paper trading → Live deployment → Monitoring

**3. Risk Management:**
- Continuous monitoring → Risk assessment → Action when needed → Daily review

**4. Performance Analysis:**
- Monthly review → Identify strengths/weaknesses → Action plan → Improvement

### Key Capabilities

**Trading:**
- Manual trading with advanced order types
- Algorithmic trading with strategy deployment
- Real-time market monitoring
- Position and order management

**Strategy Development:**
- Visual and code-based strategy builder
- Strategy library with pre-built strategies
- Comprehensive backtesting
- Parameter optimization
- Walk-forward validation

**Risk Management:**
- Real-time risk monitoring
- Position sizing calculators
- Risk calculators
- Stop loss and take profit management
- Risk limits enforcement

**Analytics:**
- Comprehensive performance analysis
- Trade analytics
- Risk analytics
- Attribution analysis
- Benchmarking

### Integration with Nautilus Core

**Trader Platform uses Nautilus Core for:**
- Real-time market data (Data Feed Handler)
- Order execution (Execution Engine, OMS)
- Position management (Position Manager)
- Strategy execution (Strategy Engine)
- Backtesting (Backtest Engine)
- Optimization (Optimization Engine)
- Risk management (Risk Engine)

**Data Flow:**
- Market data: Nautilus Core → Redis → Trader Platform
- Orders: Trader Platform → Nautilus Core → Broker APIs
- Positions: Broker APIs → Nautilus Core → PostgreSQL → Trader Platform
- Strategies: Trader Platform → TiDB → Nautilus Core
- Backtests: Trader Platform → Nautilus Core → PostgreSQL → Trader Platform

---

**Document Version:** 2.0  
**Last Updated:** October 19, 2025  
**Next Review:** As needed based on system changes

