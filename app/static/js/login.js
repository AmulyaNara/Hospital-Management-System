function setRole(roleName){

    const tabs =
        document.querySelectorAll(".role-tab");

    tabs.forEach(tab => {

        if(tab.textContent.includes(roleName)){

            tab.classList.remove(
                "bg-surface-container-high",
                "text-on-surface-variant"
            );

            tab.classList.add(
                "bg-secondary-container",
                "text-on-secondary-container"
            );

        }
        else{

            tab.classList.remove(
                "bg-secondary-container",
                "text-on-secondary-container"
            );

            tab.classList.add(
                "bg-surface-container-high",
                "text-on-surface-variant"
            );

        }

    });

    const emailInput =
        document.getElementById("email");

    if(roleName === "Patient"){

        emailInput.placeholder =
            "SSN or Email";

    }
    else if(roleName === "Staff"){

        emailInput.placeholder =
            "Staff ID or Email";

    }
    else{

        emailInput.placeholder =
            "Admin Username";

    }

}

function setRole(roleName){

    const tabs =
        document.querySelectorAll(".role-tab");

    tabs.forEach(tab => {

        tab.classList.remove(
            "active-role"
        );
        

    });

    if(roleName === "Patient"){

        tabs[0].classList.add(
            "active-role"
        );
    }

    else if(roleName === "Staff"){

        tabs[1].classList.add(
            "active-role"
        );
    }

    else if(roleName === "Admin"){

        tabs[2].classList.add(
            "active-role"
        );
    }

    const email =
        document.getElementById("email");

    if(roleName === "Patient"){

        email.placeholder =
            "Patient ID / Email";
    }

    else if(roleName === "Staff"){

        email.placeholder =
            "Staff ID / Email";
    }

    else{

        email.placeholder =
            "Admin Username";
    }

}
window.onload = function(){

    setRole("Patient");

};

document
.getElementById("loginForm")
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

            if(response.ok){

                localStorage.setItem(
                    "access_token",
                    data.access_token
                );

                localStorage.setItem(
                    "role",
                    data.role
                );

                localStorage.setItem(
                    "name",
                    data.name
                );

                if(data.role === "admin"){

                    window.location.href =
                        "/dashboard";
                }

                else if(data.role === "doctor"){

                    window.location.href =
                        "/doctor-dashboard";
                }

                else if(data.role === "patient"){

                    window.location.href =
                        "/patient-dashboard";
                }

                else if(data.role === "receptionist"){

                    window.location.href =
                        "/receptionist-dashboard";
                }

            }
            else{

                alert(data.detail);
            }

        }
        catch(error){

            console.error(error);

            alert("Server Error");
        }

    }
);