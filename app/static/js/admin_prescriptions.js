document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       ELEMENTS
    ========================================================== */

    const modal = document.getElementById("prescriptionModal");

    const openButtons = [
        document.getElementById("addPrescriptionBtn"),
        document.getElementById("newPrescription")
    ];

    const closeModalBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");

    const prescriptionForm = document.getElementById("prescriptionForm");

    const searchInput = document.getElementById("searchPrescription");

    /* ==========================================================
       MODAL
    ========================================================== */

    function openModal() {

        if(modal){

            modal.classList.add("active");

        }

    }

    function closeModal(){

        if(modal){

            modal.classList.remove("active");

        }

    }

    openButtons.forEach(button=>{

        if(button){

            button.addEventListener("click",openModal);

        }

    });

    if(closeModalBtn){

        closeModalBtn.addEventListener("click",closeModal);

    }

    if(cancelBtn){

        cancelBtn.addEventListener("click",closeModal);

    }

    window.addEventListener("click",(e)=>{

        if(e.target===modal){

            closeModal();

        }

    });

    /* ==========================================================
       SEARCH
    ========================================================== */

    if(searchInput){

        searchInput.addEventListener("keyup",()=>{

            const value=searchInput.value.toLowerCase();

            document.querySelectorAll("#prescriptionTable tbody tr").forEach(row=>{

                row.style.display=row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

            });

        });

    }

    /* ==========================================================
       FORM
    ========================================================== */

    if(prescriptionForm){

        prescriptionForm.addEventListener("submit",(e)=>{

            e.preventDefault();

            let valid=true;

            prescriptionForm.querySelectorAll("input").forEach(input=>{

                if(input.value.trim()===""){

                    input.style.borderColor="#EF4444";

                    valid=false;

                }

                else{

                    input.style.borderColor="#E5E7EB";

                }

            });

            if(!valid){

                showToast("Please complete all fields.","error");

                return;

            }

            showToast("Prescription added successfully.");

            prescriptionForm.reset();

            closeModal();

        });

    }

    /* ==========================================================
       FILTER
    ========================================================== */

    document.querySelectorAll(".outline-btn").forEach((button,index)=>{

        button.addEventListener("click",()=>{

            if(index===0){

                showToast("Filter options coming soon.");

            }

            else{

                showToast("Prescription registry exported.");

            }

        });

    });

    /* ==========================================================
       VIEW
    ========================================================== */

    document.querySelectorAll(".icon-btn").forEach(button=>{

        button.addEventListener("click",()=>{

            if(button.classList.contains("delete")) return;

            showToast("Prescription details coming soon.");

        });

    });

    /* ==========================================================
       DELETE
    ========================================================== */

    document.querySelectorAll(".delete").forEach(button=>{

        button.addEventListener("click",()=>{

            if(confirm("Revoke this prescription?")){

                button.closest("tr").remove();

                showToast("Prescription revoked.");

            }

        });

    });

    /* ==========================================================
       PAGINATION
    ========================================================== */

    document.querySelectorAll(".pagination button").forEach(button=>{

        button.addEventListener("click",()=>{

            document.querySelectorAll(".pagination button")

            .forEach(btn=>btn.classList.remove("active"));

            if(

                button.innerText!=="Previous"

                &&

                button.innerText!=="Next"

            ){

                button.classList.add("active");

            }

        });

    });

    /* ==========================================================
       CARD ANIMATION
    ========================================================== */

    document.querySelectorAll(

        ".stat-card,.table-card,.trend-card,.reliability-card"

    ).forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(20px)";

        setTimeout(()=>{

            card.style.transition=".45s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*120);

    });

    /* ==========================================================
       RIPPLE EFFECT
    ========================================================== */

    document.querySelectorAll("button").forEach(button=>{

        button.addEventListener("click",(e)=>{

            const ripple=document.createElement("span");

            ripple.className="ripple";

            const rect=button.getBoundingClientRect();

            ripple.style.left=`${e.clientX-rect.left}px`;

            ripple.style.top=`${e.clientY-rect.top}px`;

            button.appendChild(ripple);

            setTimeout(()=>{

                ripple.remove();

            },600);

        });

    });

    /* ==========================================================
       DEMO LIVE STATS
    ========================================================== */

    setInterval(()=>{

        const cards=document.querySelectorAll(".stat-card h2");

        if(cards.length>=3){

            cards[0].innerHTML=1240+Math.floor(Math.random()*15);

            cards[1].innerHTML=40+Math.floor(Math.random()*8);

        }

    },10000);

    /* ==========================================================
       TOAST
    ========================================================== */

    function showToast(message,type="success"){

        const toast=document.createElement("div");

        toast.className="toast";

        toast.innerHTML=message;

        if(type==="error"){

            toast.style.background="#DC2626";

        }

        document.body.appendChild(toast);

        setTimeout(()=>{

            toast.classList.add("show");

        },100);

        setTimeout(()=>{

            toast.classList.remove("show");

            setTimeout(()=>{

                toast.remove();

            },300);

        },3000);

    }

});