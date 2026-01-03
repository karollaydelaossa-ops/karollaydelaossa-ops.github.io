let loanChart;

function calculateLoan() {
  const amount = parseFloat(document.getElementById("loanAmount").value);
  const rate =
    parseFloat(document.getElementById("interestRate").value) / 100 / 12;
  const years = parseFloat(document.getElementById("loanTerm").value);
  const months = years * 12;

  if (!amount || !rate || !months) return;

  // Monthly payment formula
  const monthly =
    (amount * rate) / (1 - Math.pow(1 + rate, -months));

  const totalPayment = monthly * months;
  const totalInterest = totalPayment - amount;

  // ✅ Formatted results with thousands separators
  document.getElementById("monthlyPayment").innerText =
    "$" + monthly.toLocaleString("en-US", { minimumFractionDigits: 2 });

  document.getElementById("totalPayment").innerText =
    "$" + totalPayment.toLocaleString("en-US", { minimumFractionDigits: 2 });

  document.getElementById("totalInterest").innerText =
    "$" + totalInterest.toLocaleString("en-US", { minimumFractionDigits: 2 });

  document.getElementById("results").style.display = "block";

  // =========================
  // Amortization data
  // =========================

  let balance = amount;
  let amortizationData = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * rate;
    const principal = monthly - interest;
    balance -= principal;

    amortizationData.push({
      month: i,
      balance: Math.max(balance, 0)
    });
  }

  document.getElementById("chartContainer").style.display = "block";
  renderLoanChart(amortizationData);
}

function renderLoanChart(data) {
  const ctx = document.getElementById("loanChart").getContext("2d");

  // Destroy previous chart if exists
  if (loanChart) {
    loanChart.destroy();
  }

  loanChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(d => `Month ${d.month}`),
      datasets: [
        {
          label: "Remaining Balance",
          data: data.map(d => d.balance),
          borderWidth: 2,
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          ticks: {
            callback: value =>
              "$" + value.toLocaleString("en-US")
          }
        }
      }
    }
  });
}
