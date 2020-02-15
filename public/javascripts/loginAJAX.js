const sendIndexRequest = async (data) =>{
    const XHR1 = new XMLHttpRequest();
    XHR1.open('POST', 'http://localhost:4000/weather/insertJSON');
    XHR1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    XHR1.send(JSON.stringify(data));
};

const saveIndex= async ()=> {
    const dbName = "weather";
    const version = 2;
    const storeName = 'weather';
    let db;
    const request = window.indexedDB.open(dbName, version);
    request.onsuccess = async ()=>{
        db =request.result;
        db.transaction(storeName, 'readwrite').objectStore(storeName).getAll().onsuccess = (ev => {
            let result = ev.target.result;
            if(result.length == 1){
                sendIndexRequest(result)
            }
            else{
                result.forEach((element)=>{
                   sendIndexRequest(element);
                });
                db.transaction(storeName,'readwrite').objectStore(storeName).clear();
            }
        });
    };
};

const sendLoginRequest = () =>{
    const XHR = new XMLHttpRequest();
    document.getElementById('error').innerText = "";
    const loginForm = document.getElementById('loginForm');
    if(!loginForm.login.value){
        document.getElementById('error').innerText = "Login jest pusty";
    }else if(!loginForm.password.value){
        document.getElementById('error').innerText = "Hasło jest puste";
    }
    else {
        let data = new FormData(loginForm);
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
                //SaveDataFrom INdexedDB
                saveIndex();
                window.location = 'http://localhost:4000/';
            }
        };
        XHR.open('POST', 'http://localhost:4000/users/login');
        XHR.send(data);
    }
};