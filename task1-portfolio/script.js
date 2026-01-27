 document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const error = document.getElementById("error");

  error.className = "text-danger";

  if (name === "" || email === "" || message === "") {
    error.textContent = "All fields are required.";
    return;
  }

  if (!email.includes("@")) {
    error.textContent = "Please enter a valid email.";
    return;
  }

  error.textContent = "Message sent successfully!";
  error.className = "text-success";
});
