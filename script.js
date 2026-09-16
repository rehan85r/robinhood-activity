function checkActivity() {

    const walletInput = document.getElementById("walletInput");
    const error = document.getElementById("error");

    const wallet = walletInput.value.trim();

    // Check empty input
    if (!wallet) {
        error.textContent = "Please enter your wallet address.";
        return;
    }

    // Basic EVM wallet validation
    const evmPattern = /^0x[a-fA-F0-9]{40}$/;

    if (!evmPattern.test(wallet)) {
        error.textContent = "Please enter a valid EVM wallet address.";
        return;
    }

    error.textContent = "";

    // Redirect to dashboard
    window.location.href = "dashboard.html?wallet=" + wallet;
}
