document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const emailOrPhone = document.getElementById("emailOrPhone").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://group-chat-app-ready.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        emailOrPhone,
        password
      })
    });

    const data = await res.json();

    if (res.status === 200) {
      const token = data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      localStorage.setItem("userId", payload.userId);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);

      window.location.href = "chat.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
  }
});