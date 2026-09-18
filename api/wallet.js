const RPC_URL = `https://robinhood-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { address } = req.query;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const transfers = [];
    let pageKey = undefined;

    do {
      const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            fromAddress: address,
            category: [
              "external",
              "internal",
              "erc20",
              "erc721",
              "erc1155"
            ],
            withMetadata: true,
            excludeZeroValue: false,
            maxCount: "0x3e8",
            ...(pageKey ? { pageKey } : {})
          }
        ]
      };

      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.error) {
        return res.status(500).json({
          error: data.error.message || "Alchemy API error"
        });
      }

      if (data.result?.transfers) {
        transfers.push(...data.result.transfers);
      }

      pageKey = data.result?.pageKey;
    } while (pageKey);

    const sortedTransfers = transfers
      .filter((tx) => tx.metadata?.blockTimestamp)
      .sort(
        (a, b) =>
          new Date(a.metadata.blockTimestamp) -
          new Date(b.metadata.blockTimestamp)
      );

    const uniqueTransactions = [
      ...new Map(
        sortedTransfers.map((tx) => [tx.hash, tx])
      ).values()
    ];

    const firstTx = uniqueTransactions[0];
    const lastTx =
      uniqueTransactions[uniqueTransactions.length - 1];

    const formatDate = (date) => {
      if (!date) return "N/A";

      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };

    const uniqueDays = new Set(
      uniqueTransactions.map((tx) =>
        new Date(tx.metadata.blockTimestamp).toISOString().slice(0, 10)
      )
    );

    const contractInteractions = uniqueTransactions.filter(
      (tx) =>
        tx.category === "internal" ||
        tx.category === "erc20" ||
        tx.category === "erc721" ||
        tx.category === "erc1155"
    ).length;

    const nftInteractions = uniqueTransactions.filter(
      (tx) =>
        tx.category === "erc721" ||
        tx.category === "erc1155"
    ).length;

    const totalVolume = uniqueTransactions.reduce(
      (total, tx) => total + Number(tx.value || 0),
      0
    );

    const firstDate = firstTx?.metadata?.blockTimestamp
      ? new Date(firstTx.metadata.blockTimestamp)
      : null;

    const lastDate = lastTx?.metadata?.blockTimestamp
      ? new Date(lastTx.metadata.blockTimestamp)
      : null;

    const walletAge = firstDate
      ? Math.max(
          1,
          Math.floor(
            (Date.now() - firstDate.getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        )
      : 0;

    const today = new Date().toISOString().slice(0, 10);

    const activeDates = [...uniqueDays].sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    let previousDate = null;

    for (const date of activeDates) {
      if (previousDate) {
        const previous = new Date(previousDate);
        const current = new Date(date);

        const difference =
          (current - previous) / (1000 * 60 * 60 * 24);

        if (difference === 1) {
          streak++;
        } else {
          streak = 1;
        }
      } else {
        streak = 1;
      }

      longestStreak = Math.max(longestStreak, streak);
      previousDate = date;
    }

    const todayStreak = activeDates.includes(today) ? 1 : 0;

    let tier = "Robin Rookie";

    if (uniqueTransactions.length >= 300) {
      tier = "Robin Elite";
    } else if (uniqueTransactions.length >= 200) {
      tier = "Robin Veteran";
    } else if (uniqueTransactions.length >= 100) {
      tier = "Robin Runner";
    }

    return res.status(200).json({
      address,
      totalTransactions: uniqueTransactions.length,
      firstTransaction: formatDate(
        firstTx?.metadata?.blockTimestamp
      ),
      lastTransaction: formatDate(
        lastTx?.metadata?.blockTimestamp
      ),
      activeDays: uniqueDays.size,
      walletAge: walletAge,
      contractInteractions,
      nftInteractions,
      totalVolume: totalVolume.toFixed(2),
      todayStreak,
      longestStreak,
      tier
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch wallet activity"
    });
  }
}
