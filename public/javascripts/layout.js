const showData=(response)=>{
    if(!response.length && response.status === -1){
        alert(response.message);
    }
    else{
        document.title = 'Dane'
        let text ='<table class="table"><thead>' +
            '<th scope="col">Miejscowość:</th>' +
            '<th scope="col">Data:</th>' +
            '<th scope="col">Temperatura:</th>' +
            '<th scope="col">Ciśnienie:</th>' +
            '<th scope="col">Wilgotność:</th></thead><tbody>';

        response.forEach((element)=>{
           text+='<tr><td>'+element.miejscowosc+'</td><td>'+element.data.replace('T', ' ')+'</td><td>'+element.temperatura+'</td><td>'+element.cisnienie+'</td><td>'+element.wilgotnosc+'</td></tr>';
        });
        text+='</tbody></table>';
        document.getElementById('contentDiv').innerHTML = text;
    }
};

const getDataFromIndex= async ()=> {
    const dbName = "weather";
    const version = 2;
    const storeName = 'weather';
    let db;
    const request = window.indexedDB.open(dbName, version);
    request.onsuccess = async ()=>{
        db =request.result;
        db.transaction(storeName, 'readwrite').objectStore(storeName).getAll().onsuccess = (ev => {
            showData(ev.target.result);
        });
    };
};

const getData = ()=>{
    const XHR = new XMLHttpRequest();
    XHR.onload = ()=>{
        let response;
        try{
            response = JSON.parse(XHR.response);
        }
        catch (e) {
                alert('Błąd pobierania danych!');
        }
        finally {
            showData(response);
        }
    };
    XHR.onerror = async () => {
        alert('Błąd połączenia z serwerem. zostaną użyte dane lokalne');
        getDataFromIndex();
    };
    XHR.open('GET', 'http://localhost:4000/weather');
    XHR.send();
};