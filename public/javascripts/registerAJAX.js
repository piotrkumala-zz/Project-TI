const sendRegisterRequest = ()=>{
    document.getElementById('error').innerText = "";

    const XHR = new XMLHttpRequest();
    const registerForm = document.getElementById('regiserForm');
    if(!registerForm[0].value){
        document.getElementById('error').innerText = "Login jest pusty";
    }else if(!registerForm[1].value){
        document.getElementById('error').innerText = "Hasło jest puste";
    }else if(!registerForm[2].value){
        document.getElementById('error').innerText = "Potwierdznie hasła jest puste";
    }else if(registerForm[1].value!=registerForm[2].value){
        document.getElementById('error').innerText = "Hasła nie są zgodne";
    }
    else{
        let data = new FormData(registerForm);
        XHR.onerror = ()=>{
            alert('Brak połączenia z serwisem!')
        };
        XHR.onload = ()=>{
            let response = JSON.parse(JSON.parse(XHR.response));
            console.log(response);
            if(response.staus == -1){
                alert(response.message);
            }
            else{
                window.location = 'http://localhost:4000/';
            }
        };
        XHR.open('POST', 'http://localhost:4000/users/register');
        XHR.send(data);
    }
};