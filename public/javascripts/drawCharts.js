let colors = [];
const getDataForCharts = ()=>{
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
            for(i =0; i < response.length; i++){
                colors.push("#"+((1<<24)*Math.random()|0).toString(16));
            }
            drawTemperatureChart(response);
            drawPressureChart(response);
            drawHumidityChart(response);
        }
    };
    XHR.onerror = ()=>{
        alert('Błąd pobierania danych!');
    };
    XHR.open('GET', 'http://localhost:4000/weather');
    XHR.send();
};


const drawTemperatureChart = (response)=>{
    var wykresTemperatura = document.getElementById('wykresTemperatury');
    var chartData = {
        labels: [],
        datasets: []
    };
    var chart = new Chart(wykresTemperatura, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            },
            legend: {
                display: true
            },
            title: {
                display: true,
                text: 'Wykres temperatury'
            },
            responsive: true,
            spanGaps:true
        }
    });
    response.sort((a,b)=>a.data.localeCompare(b.data));
    let EmptyArray=[];
    let counter = 0;
    response.forEach((element)=>{
        chart.data.labels.push(element.data.replace('T', ' '));
        var dataSet = chart.data.datasets.find((x)=>x.label === element.miejscowosc);
        if(!dataSet){
            EmptyArray.push(element.temperatura);
            chart.data.datasets.forEach((item)=>{
                item.data.push(null);
            });
            chart.data.datasets.push({
                data: [...EmptyArray],
                label: element.miejscowosc,
                backgroundColor: 'transparent',
                borderColor: colors[chart.data.datasets.length],
                borderWidth: 4,
                pointBackgroundColor: colors[chart.data.datasets.length]
            });
            EmptyArray.pop();
            counter++;
        }
        else{
            chart.data.datasets.forEach((item)=>{
                item.data.push(item.label === element.miejscowosc? element.temperatura: null);
            });
        }
        EmptyArray.push(null);


    });
    chart.update();
};


const drawPressureChart=(response)=>{
    var wykresCisnienie = document.getElementById('wykresCisnienia');
    var chartData = {
        labels: [],
        datasets: []
    };
    var chartPresssure = new Chart(wykresCisnienie, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            },
            legend: {
                display: true
            },
            title: {
                display: true,
                text: 'Wykres ciśnienia'
            },
            responsive: true,
        }
    });
    response.sort((a,b)=>a.data.localeCompare(b.data));
    let EmptyArray=[];
    let counter = 0;
    response.forEach((element)=>{
        chartPresssure.data.labels.push(element.data.replace('T', ' '));
        var dataSet = chartPresssure.data.datasets.find((x)=>x.label === element.miejscowosc);
        if(!dataSet){
            EmptyArray.push(element.cisnienie);
            chartPresssure.data.datasets.forEach((item)=>{
                item.data.push(null);
            });
            chartPresssure.data.datasets.push({
                data: [...EmptyArray],
                label: element.miejscowosc,
                backgroundColor: 'transparent',
                borderColor: colors[chartPresssure.data.datasets.length],
                borderWidth: 4,
                pointBackgroundColor: colors[chartPresssure.data.datasets.length]
            });
            EmptyArray.pop();
            counter++;
        }
        else{
            chartPresssure.data.datasets.forEach((item)=>{
                item.data.push(item.label === element.miejscowosc? element.cisnienie: null);
            });
        }
        EmptyArray.push(null);


    });
    chartPresssure.update();
};

const drawHumidityChart=(response)=>{
    var wykresWilgotnosc = document.getElementById('wykresWilgotnosci');
    var chartData = {
        labels: [],
        datasets: []
    };
    var chartHumidity = new Chart(wykresWilgotnosc, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            },
            legend: {
                display: true
            },
            title: {
                display: true,
                text: 'Wykres wilgotności'
            },
            responsive: true,
        }
    });
    response.sort((a,b)=>a.data.localeCompare(b.data));
    let EmptyArray=[];
    let counter = 0;
    response.forEach((element)=>{
        chartHumidity.data.labels.push(element.data.replace('T', ' '));
        const dataSet = chartHumidity.data.datasets.find((x) => x.label === element.miejscowosc);
        if(!dataSet){
            EmptyArray.push(element.wilgotnosc);
            chartHumidity.data.datasets.forEach((item)=>{
                item.data.push(null);
            });
            chartHumidity.data.datasets.push({
                data: [...EmptyArray],
                label: element.miejscowosc,
                backgroundColor: 'transparent',
                borderColor: colors[chartHumidity.data.datasets.length],
                borderWidth: 4,
                pointBackgroundColor: colors[chartHumidity.data.datasets.length]
            });
            EmptyArray.pop();
            counter++;
        }
        else{
            chartHumidity.data.datasets.forEach((item)=>{
                item.data.push(item.label === element.miejscowosc? element.wilgotnosc: null);
            });
        }
        EmptyArray.push(null);


    });
    chartHumidity.update();
};
window.onload = ()=>{
    getDataForCharts();
};
