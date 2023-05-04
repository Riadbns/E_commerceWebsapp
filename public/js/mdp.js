let email = document.getElementById("input-courriel");
let errorEmail = document.getElementById("courrielErrorconn");
let code = document.getElementById("input-code");
let button = document.getElementById("connexionEmail");
let buttoncode = document.getElementById("connexionCode");
let zonCode=document.getElementById("zoneCode");
let zonEmail=document.getElementById("zoneEmail");
let errorCode=document.getElementById("codeErrorconn");
let zonemdp=document.getElementById("zonemdp");
let nvmdp=document.getElementById("input-mdp");
let buttonMdp=document.getElementById("connexionmdp");
let errorMdp=document.getElementById("mdpErrorconn");
let zoneSucces = document.getElementById("zoneSucces");
button.addEventListener('click', async function() {
    // Code to execute when button is clicked
    if(email.value!=''){ 
    let codesécurité=Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    console.log(email.value);
    console.log(codesécurité);
     let data = {
        code : String(codesécurité),
        courriel : String(email.value)
      }
      let response = await fetch("/mdp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
     zonCode.style.display="flex";
     zonEmail.style.display="none";
     buttoncode.addEventListener('click', async function() {
        if(code.value==codesécurité){
            errorCode.style.display="none";
            zonCode.style.display="none";
            zonemdp.style.display="flex"

            buttonMdp.addEventListener('click', async function() {
                if(nvmdp.value!==""){
                    let data = {
                        courriel : String(email.value),
                        nvmdp:String(nvmdp.value)
                    }
                    let response = await fetch("/nvmdp", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)
                      });
                      zoneSucces.style.display="flex";
                      zonemdp.style.display="none";
                }
                else{
                    errorMdp.style.display="flex"
                    errorMdp.innerHTML="champ vide"
                }
            });
            
        }
        else{
            errorCode.style.display="flex"
            errorCode.innerHTML="code incorrect"
        }
     });
      
    }
    else{
    errorEmail.style.display="flex"
    errorEmail.innerHTML="kjksdjsd"
    }
});
