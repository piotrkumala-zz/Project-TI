const uuidv4 = ()=> {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};
const insertToLocalDb = async (form)=> {
    const dbName = "weather";
    // This is what our customer data looks like.
    const dataToInsert =
        {
            miejscowosc: form.miejscowosc.value,
            data: form.data.value,
            temperatura: form.temperatura.value,
            cisnienie: form.cisnienie.value,
            wilgotnosc: form.wilgotnosc.value
        };
    const version = 2;
    const storeName = 'weather';
    var db;
    var request = window.indexedDB.open(dbName,version);
    request.onupgradeneeded = (ev => {
        db = ev.target.result;
        var objectStore = db.createObjectStore(storeName);
    });
    request.onsuccess = ()=>{
        db =request.result;
        db.transaction(storeName, 'readwrite').objectStore(storeName).put(dataToInsert, uuidv4());
    }

};




const sendInsertRequest = () =>{
    document.getElementById('error').innerText = "";
    const XHR = new XMLHttpRequest();
    const insertForm = document.getElementById('insertForm');
    if(!insertForm.miejscowosc.value){
        document.getElementById('error').innerText = "Nazwa miejscowości jest pusta";
    }else if(!insertForm.data.value){
        document.getElementById('error').innerText = "Data wykonania pomiaru jest pusta";
    }else if(!insertForm.temperatura.value) {
        document.getElementById('error').innerText = "Temperatura jest pusta";
    }else if(!insertForm.cisnienie.value) {
        document.getElementById('error').innerText = "Ciśnienie jest puste";
    }else if(!insertForm.wilgotnosc.value) {
        document.getElementById('error').innerText = "Wilgotność jest pusta";
    }else{
            let data = new FormData(insertForm);
            XHR.onerror = ()=>{
                alert('Brak połączenia z serwisem. Dane zostaną zapisane lokalnie');
                insertToLocalDb(insertForm);
            };
            XHR.onload = ()=>{
                let response = JSON.parse(XHR.response);
                console.log(response);
                if(response.staus == -1){
                    alert(response.message);
                }
                else{
                    window.location = 'http://localhost:4000/';
                }
            };
            XHR.open('POST', 'http://localhost:4000/weather/insert');
            XHR.send(data);
    }
};

