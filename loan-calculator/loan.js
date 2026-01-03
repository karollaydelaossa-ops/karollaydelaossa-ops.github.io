function calculateLoan() {
  const amount = parseFloat(document.getElementById("loanAmount").value);
  const rate = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
  const years = parseFloat(document.getElementById("loanTerm").value);
  const months = years * 12;

  if (!amount || !rate || !months) return;

  const monthly =
    (amount * rate) / (1 - Math.pow(1 + rate, -months));

  const totalPayment = monthly * months;
  const totalInterest = totalPayment - amount;

  document.getElementById("monthlyPayment").innerText =
    `$${monthly.toFixed(2)}`;

  document.getElementById("totalPayment").innerText =
    `$${totalPayment.toFixed(2)}`;

  document.getElementById("totalInterest").innerText =
    `$${totalInterest.toFixed(2)}`;

  document.getElementById("results").style.display = "block";
}
