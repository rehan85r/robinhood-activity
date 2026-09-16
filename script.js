document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("walletForm");
    const input = document.getElementById("walletAddress");
    const result = document.getElementById("activityResult");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const wallet = input.value.trim();

        const isValidWallet = /^0x[a-fA-F0-9]{40}$/.test(wallet);

        if (!isValidWallet) {
            result.classList.add("show");

            result.innerHTML = `
                <p style="color:#d9534f; font-size:14px;">
                    Please enter a valid EVM wallet address.
                </p>
            `;

            result.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }

        result.classList.add("show");

        result.innerHTML = `
            <div class="activity-header">
                <span class="activity-label">WALLET OVERVIEW</span>
                <span class="wallet-short">
                    ${wallet.slice(0, 6)}...${wallet.slice(-4)}
                </span>
            </div>

            <h2 class="activity-title">Your activity</h2>

            <div class="stats-grid">

                <div class="stat-card">
                    <small>First Tx</small>
                    <strong>23 Aug<br>2025</strong>
                    <p>First transaction</p>
                </div>

                <div class="stat-card">
                    <small>Today Streak</small>
                    <strong>56 Days</strong>
                    <p>Currently active streak</p>
                </div>

                <div class="stat-card">
                    <small>Longest Streak</small>
                    <strong>575 Days</strong>
                    <p>Personal best</p>
                </div>

                <div class="stat-card">
                    <small>Total Tx</small>
                    <strong>565</strong>
                    <p>Transactions completed</p>
                </div>

                <div class="stat-card">
                    <small>Total Volume</small>
                    <strong>$566</strong>
                    <p>Total transaction volume</p>
                </div>

                <div class="stat-card">
                    <small>NFT</small>
                    <strong>45</strong>
                    <p>NFT interactions</p>
                </div>

                <div class="stat-card">
                    <small>Smart Contract</small>
                    <strong>564</strong>
                    <p>Contract interactions</p>
                </div>

                <div class="stat-card">
                    <small>Deploy Contract</small>
                    <strong>54</strong>
                    <p>Contracts deployed</p>
                </div>

                <div class="stat-card">
                    <small>Active Days</small>
                    <strong>45</strong>
                    <p>Days with activity</p>
                </div>

                <div class="stat-card">
                    <small>Wallet Age</small>
                    <strong>6 Months</strong>
                    <p>Since first transaction</p>
                </div>

            </div>


            <div class="bottom-grid">

                <div class="panel">

                    <div class="panel-heading">
                        <div>
                            <h3>Activity overview</h3>
                            <p>Your on-chain activity over time</p>
                        </div>

                        <span>↗</span>
                    </div>

                    <div class="activity-grid">
                        ${generateActivityCells()}
                    </div>

                </div>


                <div class="panel streak-panel">

                    <div class="panel-heading">
                        <div>
                            <h3>Streaks</h3>
                            <p>Consistency matters.</p>
                        </div>

                        <span>↗</span>
                    </div>

                    <div>

                        <div class="streak-item">
                            <div class="streak-label">Current Streak</div>
                            <div class="streak-number">
                                56 <span>days</span>
                            </div>
                        </div>

                        <div class="streak-item">
                            <div class="streak-label">Longest Streak</div>
                            <div class="streak-number">
                                575 <span>days</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        `;

        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });


    function generateActivityCells() {

        let cells = "";

        for (let i = 0; i < 128; i++) {

            const random = Math.random();

            if (random > 0.70) {
                cells += `<div class="activity-cell active"></div>`;
            } else if (random > 0.48) {
                cells += `<div class="activity-cell medium"></div>`;
            } else {
                cells += `<div class="activity-cell"></div>`;
            }

        }

        return cells;
    }

});
