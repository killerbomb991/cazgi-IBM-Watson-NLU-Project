const express = require('express');
const app = new express();
const dotenv = require('dotenv');
const indirizzo = require('url');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstangingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstangingV1({
        version: '2021-05-20',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req, res) => {
    const richiesta = indirizzo.parse(req.url, true).query;
    const url_richiesta = richiesta.url;
    const analyzeOptions = {
        'url': `${url_richiesta}`,
        'features': {
            'emotion': {
                'document': true
            }
        }
    }
   
    getNLUInstance().analyze(analyzeOptions).then(analysisResults => {
        console.log(JSON.stringify(analysisResults.result.emotion.document.emotion));
        return res.send(JSON.stringify(analysisResults.result.emotion.document.emotion));
    
    })
        .catch(err => {
            console.log('error:', err);
        });

   });
app.get("/url/sentiment", (req,res) => {
    const richiesta = indirizzo.parse(req.url, true).query;
    const url_richiesta = richiesta.url;
    const analyzeOptions = {
        'url': `${url_richiesta}`,
  'features': {
    'sentiment': {
      'document':true
      }
  }
};
    getNLUInstance().analyze(analyzeOptions).then(analysisResults => {
        
        console.log(analysisResults.result.sentiment.document.label);
        return res.send(analysisResults.result.sentiment.document.label);
    
    })
        .catch(err => {
            console.log('error:', err);
        });
    
});

app.get("/text/emotion", (req,res) => {
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

