let amortizationChart = null;

function calculateLoan() {
  const amount = Number(document.getElementById("loanAmount").value);
  const interestRate = Number(document.getElementById("interestRate").value);
  const years = Number(document.getElementById("loanTerm").value);

  if (!amount || !interestRate || !years) return;

  const monthlyRate = interestRate / 100 / 12;
  const months = years * 12;

  const monthlyPayment =
    (amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -months));

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - amount;

  const formatCurrency = (value) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  document.getElementById("monthlyPayment").innerText =
    formatCurrency(monthlyPayment);

  document.getElementById("totalPayment").innerText =
    formatCurrency(totalPayment);

  document.getElementById("totalInterest").innerText =
    formatCurrency(totalInterest);

  document.getElementById("results").style.display = "block";

  // =========================
  // Amortization balances
  // =========================

  let balance = amount;
  const balances = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;
    balances.push(Math.max(balance, 0));
  }

  document.getElementById("chartContainer").style.display = "block";
  renderLoanChart(balances);
}

function renderLoanChart(balances) {
  const ctx = document
    .getElementById("amortizationChart")
    .getContext("2d");

  if (amortizationChart) {
    amortizationChart.destroy();
  }

  amortizationChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: balances.map((_, i) => i + 1),
      datasets: [
        {
          label: "Remaining Loan Balance",
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
            callback: value =>
              "$" + value.toLocaleString("en-US"),
          },
        },
      },
    },
  });
}
