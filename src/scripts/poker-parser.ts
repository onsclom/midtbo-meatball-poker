export function parseNight(
  csv: string,
  bankerName: string,
  bankerBuyin: number,
) {
  const transactions = csv
    .split("\n")
    .map((line) => {
      const [, id, datetime, type, status, note, from, to, amount] = line.split(
        ",",
      )
      return { id, datetime, type, status, note, from, to, amount }
    })

  return [...new Set(transactions.map((t) => t.from))].map((p) => {
    const buy = transactions.filter((t) => t.from == p)
      .map((t) => t.amount)
      .map((a) => Number(a!.split("$")[1]))
      .reduce((a, b) => a + b, 0)

    const cashout = transactions.filter((t) => t.to == p)
      .map((t) => t.amount)
      .map((a) => Number(a!.split("$")[1]))
      .reduce((a, b) => a + b, 0)

    if (p == bankerName) {
      const totalBuyin = transactions.filter((t) => t.from != bankerName)
        .map((t) => t.amount).map((a) => Number(a!.split("$")[1])).reduce(
          (a, b) => a + b,
          0,
        )
      const totalCashout = transactions.filter((t) => t.from == bankerName)
        .map((t) => t.amount).map((a) => Number(a!.split("$")[1])).reduce(
          (a, b) => a + b,
          0,
        )
      return {
        name: p,
        buyin: bankerBuyin,
        cashout: Math.max(0, bankerBuyin + totalBuyin - totalCashout),
        net: totalBuyin - totalCashout,
      }
    }

    return {
      name: p,
      buyin: buy,
      cashout,
      net: cashout - buy,
    }
  })
}

export function getPlayerNames(csv: string) {
  return [...new Set(csv.split("\n").map(line => line.split(",")[6]))]
}