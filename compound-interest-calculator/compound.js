let compoundChart = null;

function calculateCompoundInterest() {
  const initial = Number(document.getElementById("initialAmount").value);
  const monthly = Number(document.getElementById("monthlyContribution").value);
  const rate = Number(document.getElementById("interestRate").value) / 100 / 12;
  const years = Number(document.getElementById("years").value);

  if (!years || rate < 0) return;

  const months = years * 12;
  let balance = initial;
  let balances = [];
  let totalContributions = initial;

  for (let i = 1; i <= months; i++) {
    balance += monthly;
    totalContributions += monthly;
    balance += balance * rate;
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

  renderCompoundChart(balances);
}

function renderCompoundChart(balances) {
  const ctx = document.getElementById("compoundChart").getContext("2d");

  if (compoundChart) {
    compoundChart.destroy();
  }

  compoundChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: balances.map((_, i) => i + 1),
      datasets: [
        {
          label: "Investment Growth",
          data: balances,
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: {
            callback: value =>
              "$" + value.toLocaleString("en-US"),
          },
        },
      },
    },
  });
}
