let savingsChart = null;

function calculateSavings() {
  const initial = Number(document.getElementById("initialAmount").value) || 0;
  const monthly = Number(document.getElementById("monthlyContribution").value) || 0;
  const annualRate = Number(document.getElementById("interestRate").value);
  const years = Number(document.getElementById("years").value);

  if (!years || annualRate < 0) return;

  const rate = annualRate / 100 / 12;
  const months = years * 12;

  let balance = initial;
  let balances = [];
  let totalContributions = initial;

  for (let i = 1; i <= months; i++) {
    // 1️⃣ Apply interest to existing balance
    balance += balance * rate;

    // 2️⃣ Add monthly contribution at end of period
    balance += monthly;
    totalContributions += monthly;

    balances.push(balance);
  }

  const totalInterest = balance - totalContributions;

  const formatCurrency = (value) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  document.getElementById("finalBalance").innerText =
    formatCurrency(balance);

  document.getElementById("totalContributions").innerText =
    formatCurrency(totalContributions);

  document.getElementById("totalInterest").innerText =
    formatCurrency(totalInterest);

  document.getElementById("results").style.display = "block";
  document.getElementById("chartContainer").style.display = "block";

  renderSavingsChart(balances);
}

function renderSavingsChart(balances) {
  const ctx = document.getElementById("amortizationChart").getContext("2d");

  if (savingsChart) {
    savingsChart.destroy();
  }

  savingsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: balances.map((_, i) => i + 1),
      datasets: [
        {
          label: "Savings Balance",
          data: balances,
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Month",
          },
        },
        y: {
          title: {
            display: true,
            text: "Balance",
          },
          ticks: {
            callback: (value) =>
              "$" + value.toLocaleString("en-US"),
          },
        },
      },
    },
  });
}
