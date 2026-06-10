console.log("login.js loaded");

// Login Form
document.getElementById("loginForm")
.addEventListener(
    "submit",
    async function(event){

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const formData =
            new URLSearchParams();

        formData.append(
            "username",
            email
        );

        formData.append(
            "password",
            password
        );

        try{

            const response =
                await fetch(
                    "/login",
                    {
                        method: "POST",

                        headers:{
                            "Content-Type":
                            "application/x-www-form-urlencoded"
                        },

                        body: formData
                    }
                );

            const data =
                await response.json();

            console.log(data);

            if(response.ok){

                localStorage.setItem(
                    "access_token",
                    data.access_token
                );

                //alert(
                //    "Login Successful"
               // );

                window.location.href =
                    "/dashboard";
            }
            else{

                alert(
                    data.detail
                );
            }

        }
        catch(error){

            console.error(error);

            alert(
                "Server Error"
            );
        }

    }
);

const togglePassword =
    document.getElementById("togglePassword");

const passwordField =
    document.getElementById("password");

togglePassword.addEventListener(
    "click",
    function(){

        if(passwordField.type === "password"){

            passwordField.type = "text";
            this.textContent = "";

        }else{

            passwordField.type = "password";
            this.textContent = "";
        }
    }
);

