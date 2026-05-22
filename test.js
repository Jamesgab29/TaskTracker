fetch("https://tasktracker-f01t.onrender.com/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "testx999@gmail.com", password: "pwd", firstName: "Test", lastName: "X" })
}).then(r => {
    console.log("Status:", r.status);
    return r.text();
}).then(d => console.log("Body:", d)).catch(console.error);
