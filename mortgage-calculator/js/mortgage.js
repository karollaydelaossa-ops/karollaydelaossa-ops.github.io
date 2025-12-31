let amortizationChart = null;

// 🔁 Sync input ↔ range
function syncInputAndRange(inputId, rangeId, defaultValue) {
  const input = document.getElementById(inputId);
  const range = document.getElementById(rangeId);

  input.value = defaultValue;
  range.value = defaultValue;

  input.addEventListener("input", () => {
    range.value = input.value || 0;
  });

  range.addEventListener("input", () => {
    input.value = range.value;
  });
}

// Init sliders
syncInputAndRange("homePrice", "homePriceRange", 300000);
syncInputAndRange("downPayment", "downPaymentRange", 60000);
syncInputAndRange("loanTerm", "loanTermRange", 30);
syncInputAndRange("interestRate", "interestRateRange", 6.5);

function calculateMortgage() {
  const homePrice = Number(document.getElementById("homePrice").value);
  const downPayment = Number(document.getElementById("downPayment").value) || 0;
  const loanTerm = Number(document.getElementById("loanTerm").value);
  const interestRate = Number(document.getElementById("interestRate").value);

  if (!homePrice || !loanTerm || !interestRate) {
    alert("Please fill all required fields");
    return;
  }

  const button = document.getElementById("calculateBtn");
  button.innerText = "Calculating...";
  button.disabled = true;

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const monthlyPayment =
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (value) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  // Amortization balances
  let balance = loanAmount;
  const balances = [];

  for (let i = 1; i <= numberOfPayments; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    balances.push(Math.max(balance, 0));
  }

  setTimeout(() => {
    document.getElementById("monthlyPayment").innerText = formatCurrency(monthlyPayment);
    document.getElementById("totalPayment").innerText = formatCurrency(totalPayment);
    document.getElementById("totalInterest").innerText = formatCurrency(totalInterest);

    document.getElementById("results").style.display = "block";
    document.getElementById("chartContainer").style.display = "block";

    renderAmortizationChart(balances);

    button.innerText = "Calculate";
    button.disabled = false;
  }, 300);
}

function renderAmortizationChart(balances) {
  const ctx = document.getElementById("amortizationChart").getContext("2d");

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
        },
      },
    },
  });
}
