document.getElementById("signupForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const phone = document.getElementById("phone").value;
const password = document.getElementById("password").value;

const userData = {
name,
email,
phone,
password
};

try{

const res = await fetch("http://localhost:3000/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(userData)
});

const data = await res.json();

alert(data.message);

window.location.href="login.html";

}catch(err){
console.log(err);
}

});