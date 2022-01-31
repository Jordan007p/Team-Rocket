const express = require('express')
const app = express()
const port = process.env.PORT || 80
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const {spawn} = require('child_process');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile('index.html', options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent index.html to '+ip);
        }
    });
});

app.get('/Alata-Regular.ttf', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile('Alata-Regular.ttf', options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent Alata-Regular.ttf to '+ip);
        }
    });
});

app.get('/map.html', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile('map.html', options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent map.html to '+ip);
        }
    });
});

app.get('/map_template.html', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile('map_template.html', options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent map_template.html to '+ip);
        }
    });
});

router.post('/result',(request,response) => {
    //response.send('Response!');
    var dataToSend;
    const python = spawn('python3', ['mapgen.py',request.body["from"],request.body["to"]]);
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ... '+data);
        dataToSend = data.toString();
    });
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if(code==0){
            
            var distandur = dataToSend.split('\n');
            var distance = (parseFloat(distandur[0].split(',')[0].split(': ')[1])/1000).toFixed(2);
            var duration = parseInt(parseFloat(distandur[0].split(',')[1].split(': ')[1])/60);
            var pat_distance = (parseFloat(distandur[1].split(',')[0].split(': ')[1])/1000).toFixed(2);
            var pat_duration = parseInt(parseFloat(distandur[1].split(',')[1].split(': ')[1])/60);
            
            const prosecna_potrosuvacka = 0.07;
            const cena_na_benzin = 	78.5;
            const toll_price = parseFloat(120);

            var gorivo = parseFloat(distance*prosecna_potrosuvacka*cena_na_benzin).toFixed(1);
            var pat_gorivo = parseFloat(pat_distance*prosecna_potrosuvacka*cena_na_benzin).toFixed(1);

            var full_price = parseFloat(toll_price)+parseFloat(gorivo);
            //console.log(full_price);

            var distance_diff = Math.abs(distance-pat_distance).toFixed(2);
            var duration_diff = Math.abs(duration-pat_duration);
            var gas_diff = Math.abs(full_price-pat_gorivo).toFixed(2);

            var more_distant = (distance>pat_distance)? '(Patarina Pat is more distant)' : '(Non-patarina pat is more distant)';
            var more_durr = (duration>pat_duration)? '(Patarina Pat takes longer)' : '(Non-patarina pat takes longer)';
            var more_pricy = (full_price>pat_gorivo)? '(Patarina Pat costs more)' : '(Non-patarina pat costs more)';
            
            //console.log('dalecina: '+distance+' - vreme: '+duration);
            //console.log('pat_dalecina: '+pat_distance+' - pat_vrmee: '+pat_duration);

            var data = fs.readFileSync('result_template.html', 'utf-8');

            var newValue = data.replace('<div id="box1_1"></div>','<div id="box1_1">Length in km: '+distance+'<br>Time needed in min: '+duration+'<br>\
            Gas price: '+gorivo+' MKD<br>Toll price: '+toll_price+' MKD<br></div>');
            var newValue1 = newValue.replace('<div id="box1_2"></div>','<div id="box1_2">Length in km: '+pat_distance+'<br>Time needed in min: '+pat_duration+'<br>\
            Gas price: '+pat_gorivo+' MKD<br></div>');
            newValue = newValue1.replace('document.getElementById("from").value = "";','document.getElementById("from").value = "'+request.body["from"]+'";');
            newValue1 = newValue.replace('document.getElementById("to").value = "";','document.getElementById("to").value = "'+request.body["to"]+'";');
            newValue = newValue1.replace('<div id="box3_1"></div>','<div id="box3_1">Difference in length: '+distance_diff+' km '+more_distant+'<br>Difference in time: \
            '+duration_diff+' min '+more_durr+'<br>Difference in price: '+gas_diff+' MKD '+more_pricy+'<br></div>');


            fs.writeFileSync('result.html', newValue, 'utf-8');

            console.log('readFileSync complete');


            //console.log(request.body);

            const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
            const options = {
                root: path.join(__dirname)
            };
            response.sendFile('result.html', options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log('Sent result.html to '+ip);
                }
            });
        }
        else{
            const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
            const options = {
                root: path.join(__dirname)
            };
            response.sendFile('error.html', options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log('Sent error.html to '+ip);
                }
            });
        }
    });
});

app.use('/',router);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});