"use strict";
/* globals ReactDOM: false */
/* globals React: false */
/* globals data: false */
const App = function(props) {
        // Käytetään lähes samaa dataa kuin viikkotehtävässä 1
        // Alustetaan tämän komponentin tilaksi data.
        // Tee tehtävässä vaaditut lisäykset ja muutokset tämän komponentin tilaan
        // päivitettäessä React-komponentin tilaa on aina vanha tila kopioitava uudeksi
        // kopioimista varten on annettu valmis mallifunktio kopioi_kilpailu
        // huom. kaikissa tilanteissa ei kannata kopioida koko dataa
        const [state, setState] = React.useState({"kilpailu": kopioi_kilpailu(data) });
        console.log( state.kilpailu );
        const [kopiostate, setKopioState] = React.useState(state.kilpailu.joukkueet);
        console.log( state.kilpailu );
        console.log(kopiostate)
        console.log(state.kilpailu.sarjat); 
        console.log(Array.from(state.kilpailu));

        const handleInsert = function(uusijoukkue) {
          let kisa = state.kilpailu;
          let joukkueet = Array.from(kisa.joukkueet);
          //Lisätään uudele joukkueelle key-arvo
          uusijoukkue.key = state.kilpailu.joukkueet.length+1;
          joukkueet.push(uusijoukkue);
          
          console.log(state);
          setKopioState([...kopiostate, uusijoukkue]);
          console.log(kopiostate);

        }
      /* jshint ignore:start */
      return (<div id="container1"><div className="part">
        <LisaaJoukkue handleInsert={handleInsert} kopio={kopiostate} setkopio={setKopioState} kilpailu={state.kilpailu}leimaustavat={state.kilpailu.leimaustavat} sarjat={state.kilpailu.sarjat}/>
        </div>
        <div className="part">
        <ListaaJoukkueet joukkueet={kopiostate}/>
        
              </div>
              </div>);
      /* jshint ignore:end */
};

const LisaaJoukkue = function(props) {
      
      /* jshint ignore:start */
      console.log(props.kilpailu.leimaustavat);
      console.log(props.kopio)
      let leimaustavat = props.kilpailu.leimaustavat;
      let leimObj = {};
      leimaustavat.forEach((elem, index) => {
        leimObj[elem] = index;
      });
      console.log(leimObj);

      console.log(props.kilpailu.sarjat)
      let sarjaObj = {}
      props.kilpailu.sarjat.forEach(elem => {
        sarjaObj[elem.nimi] = elem.id
      })

      console.log(sarjaObj)

      const [jasenetstate, setJasenetstate] = React.useState([]);
      const [jaseninputList, setjaseninputList] = React.useState(["Jäsen 1", "Jäsen 2"])
      const [jasenCounter, setjasenCounter] = React.useState(2)
      let [formistate, setFormistate] = React.useState({
        nimi : "",
        leimaustapa : [],
        sarja : "radio",
        jasenet: jasenetstate,
        key: Date.now()
    });    
    let checkboxes = []; // checkboxien virheilmoitusten nollaamista varten tarvitaan taulukko
    let jaseninputit = [];
   
    const [checkstate, setCheckstate] = React.useState([]);

    const handleChange = function(event) {
    let obj = event.target;
    let luokka = obj.className;
    let arvo = obj.value;
    let kentta = obj.name;
    let type = obj.type;
    let checked = obj.checked;
    let validity = obj.validity;
    let newstate = {...formistate}; 
    console.log(kentta, arvo)
    
    
    if (  kentta == "nimi") {
      for (let j of props.kopio) {
        if (j.nimi.trim().toLowerCase() == arvo.trim().toLowerCase()){
          obj.setCustomValidity("Ei samannimisiä");
          obj.reportValidity();
          newstate[kentta] = arvo;
          setFormistate(newstate);
         return;
     }
     else {
         obj.setCustomValidity("");
 
     }
      }

      
    }
   


    
    if ( type == "checkbox" ) {
      newstate[kentta] = formistate[kentta].slice(0); // tehdään kopio, koska alkuperäistä ei voi suoraan käyttää. Huom. tämä slice-temppu ei riitä, jos taulukossa on objekteja. Ei siis tee "deep" kloonia
      if ( checked ) {
          // lisätään
          newstate[kentta].push(arvo);
      }
      else {
          // poistetaan
          newstate[kentta].slice(newstate[kentta].indexOf(arvo),1); 
      }
      // tarkistetaan vielä, että varmasti ainakin yksi checkbox oli valittuna. Jos ei niin asetetaan virhe
      // miten hoidetaan virheilmoitusten nollaus kaikista checkboxeista?
      // virheilmoitus asettuu nyt siihen, joka on viimeksi tyhjätty, mutta jos 
      // valitaan joku muista niin miten päästään edelliseen käsiksi?
      if ( newstate[kentta].length == 0 ) {
          obj.setCustomValidity("Valitse vähintään yksi");
          // ratkaisu useamman checkboxin virheilmoituksen nollaamiseen on tallentaa aina talteen ne checkboxit
          // joille on asetettu virheilmoitus. Sama voitaisiin hoitaa refseillä, mutta
          // tämä versio on yksinkertaisempi
          checkboxes.push( obj );
      }
      else {
          obj.setCustomValidity("");
          // tässä pitää tyhjentää virheilmoitus _kaikista_ checkboxeista
          // valituksi tullut checkbox ei välttämättä ole seuraavassa joukossa
          for( let checkbox of checkboxes) {
              checkbox.setCustomValidity("");
          }
          // palautetaan taulukko tyhjäksi
          checkboxes = [];

      }

  }

 else {

          newstate[kentta] = arvo;

  }
 setFormistate(newstate);
 console.log(newstate)

}

const handleJasenChange = (e) => {
  setJasenetstate({...jasenetstate, [e.target.name]: e.target.value})

  console.log(jasenetstate);
  
  
  formistate["jasenet"] = jasenetstate;
console.log(jasenCounter)
  if (Object.keys(jasenetstate).length >= jasenCounter && jasenCounter < 5) {
    console.log("Nyt pitää lisätä");
    let pituus = Object.keys(jasenetstate).length +1
    console.log(pituus)
    let counter = jasenCounter +1
    setjasenCounter(counter)
    console.log(jasenCounter)

    setjaseninputList([...jaseninputList, `Jäsen ${pituus}`])
  }

  console.log(Object.keys(jasenetstate).length)
  
  console.log(formistate);
}

// Tää uusiks!
  const generateId = () => {

    const kop = props.kopio;
    let maxid = 0;
   for (let k of kop) {
    if (k.id > maxid) {
      maxid = k.id;
    }

   }
    return maxid +1;
  }
  const handleInsert = function(event) {
    event.preventDefault();
    let obj = event.target;
    let luokka = obj.className;
    let arvo = obj.value;
    let kentta = obj.name;
    let uusijoukkue = {};
    let kentat = ["nimi","leimaustapa","sarja","jasenet"];
    let virhe = 0;
    for ( let i of kentat) {
      
      

        if ( formistate["nimi"] == "" || formistate["leimaustapa"] == "" || formistate["sarja"] == ""  || formistate["jasenet"] == "" ) {
            // tänne ei pitäisi päästä
            console.log(i, "virhe");
            virhe++;
            return false;
        }
       
        uusijoukkue["nimi"] = formistate["nimi"];
        console.log(formistate["nimi"])
        uusijoukkue["id"] = generateId();
        uusijoukkue["sarja"] = {id: sarjaObj[formistate["sarja"]], nimi: formistate["sarja"]};
        
       
        
        
        console.log(formistate["leimaustapa"])
        let arr = [];
        for (let i of formistate["leimaustapa"]) {
          console.log(i)
         arr.push(leimObj[i])
        }
        console.log(formistate["jasenet"]);
       
        uusijoukkue["jasenet"] = Object.values(formistate["jasenet"])
        uusijoukkue["rastileimaukset"] = ""
       uusijoukkue["leimaustapa"] = arr
        console.log(uusijoukkue);
        console.log(props.kopio);
        
        
     
       
         
    }
    
   
    setJasenetstate([])
    let newstate = {
      nimi : "",
      leimaustapa : [],
      sarja : "radio",
      jasenet: jasenetstate,
      key: Date.now()
    }

    setFormistate(newstate);

    props.handleInsert(uusijoukkue);
    event.target.reset();
    console.log("kaikki ok!");
    
  } 



    return (  
    <div>
    <form method="post" onSubmit={handleInsert}>
    <fieldset key={formistate.key}>
    <legend>Lisää joukkue</legend>
    <label key="nimi">Nimi <input required="required" onChange={handleChange} type="text" name="nimi"  value={formistate.nimi} /></label>
    {console.log(props.sarjat)} 
    {props.leimaustavat.map(item => <label key={item + "l"} >
      {item} <input onChange={handleChange} 
    key={item} value={item}  type="checkbox" 
    checked={formistate.leimaustapa.includes(item)} name="leimaustapa" id={item} /></label>)}
    {Object.keys(props.sarjat).map((item, i)=> 
    <label key={i+"sarja"} >{props.sarjat[item].nimi} 
    <input onChange={handleChange}key={props.sarjat[item].nimi} type="radio" value={props.sarjat[item].nimi}name="sarja" 
    checked={formistate.sarja === props.sarjat[item].nimi} id={props.sarjat[item].nimi}/></label>)}

   
    </fieldset>
      <fieldset>
    <legend>Jäsenet </legend>
    {
      jaseninputList.map(item => 

        <label key={item}>{item} <input onChange={handleJasenChange} type="text" name ={item}className="jasenet"/></label>
        )
          
            
          
        
    }
    <p><button type="submit">Tallenna</button></p>
    </fieldset>
    </form>
    </div>
    );
      /* jshint ignore:end */
};


//Komponentti jossa listataan sivulle joukkueet "table"-elementtiin
const ListaaJoukkueet = function(props) {
      /* jshint ignore:start */
     
      const sortedArr = [...props.joukkueet].sort(function(a, b) {
        if(a.sarja.nimi.trim().toLowerCase() < b.sarja.nimi.trim().toLowerCase()) return -1;
        if(a.sarja.nimi.trim().toLowerCase() > b.sarja.nimi.trim().toLowerCase()) return 1;
        if(a.nimi.trim().toLowerCase() < b.nimi.trim().toLowerCase()) return -1;
        if(a.nimi.trim().toLowerCase() > b.nimi.trim().toLowerCase()) return 1;
        return 0;
      })
      


      //Loopataan järjestettyjen joukkueiden läpi ja jokaista joukkuetta kohden suoritetaan
      //erillinen "YkisttainenJoukkue" komponentti joka luo oikeanlaisen rivin "table"-elementtiin
      //Joukkueen sarjan, nimen ja jäsenien perusteella
      return (<table>
        <tbody>
          <tr>
            <th>Sarja</th>
            <th>Joukkue</th>
          </tr>
        
          {Object.keys(sortedArr).map((i) =>
           <YksittainenJoukkue joukkue={sortedArr[i]} key={i}/>
          )}
        
        </tbody>
        </table>);
      /* jshint ignore:end */
};

// Yksittäisen joukkueen muodostamiseen tarkoitettu komponentti 
const YksittainenJoukkue = function(props) {
  
  return (
    <tr key={props.joukkue.nimi}>
      <td>{props.joukkue.sarja.nimi.trim()}</td>
      <td>{props.joukkue.nimi.trim()}</td>
      <td>
        <ul>
          {Object.keys(props.joukkue.jasenet).map((j, index) => 
          <li key={index + "_" + props.joukkue.jasenet[j]}>{props.joukkue.jasenet[j]}</li>)}
        </ul>
      </td>
    </tr>
  )
}



const root = ReactDOM.createRoot( document.getElementById('root'));
root.render(
      /* jshint ignore:start */
    <App />,
      /* jshint ignore:end */
);

// datarakenteen kopioiminen
// joukkueen leimausten rasti on viite rastitaulukon rasteihin
// joukkueen sarja on viite sarjataulukon sarjaan
function kopioi_kilpailu(data) {
        let kilpailu = {};
        kilpailu.nimi = data.nimi;
        kilpailu.loppuaika = data.loppuaika;
        kilpailu.alkuaika = data.alkuaika;
        kilpailu.kesto = data.kesto;
        kilpailu.leimaustavat = Array.from( data.leimaustavat );
        let uudet_rastit = new Map(); // tehdään uusille rasteille jemma, josta niiden viitteet on helppo kopioida
        function kopioi_rastit(j) {
            	        let uusir = {};
            	        uusir.id = j.id;
            	        uusir.koodi = j.koodi;
            	        uusir.lat = j.lat;
            	        uusir.lon = j.lon;
 			uudet_rastit.set(j, uusir); // käytetään vanhaa rastia avaimena ja laitetaan uusi rasti jemmaan
            	        return uusir; 
        }
        kilpailu.rastit = Array.from( data.rastit, kopioi_rastit );
        let uudet_sarjat = new Map(); // tehdään uusille sarjoille jemma, josta niiden viitteet on helppo kopioida
        function kopioi_sarjat(j) {
            	        let uusir = {};
            	        uusir.id = j.id;
            	        uusir.nimi = j.nimi;
            	        uusir.kesto = j.kesto;
            	        uusir.loppuaika = j.loppuaika;
            	        uusir.alkuaika = j.alkuaika;
 			uudet_sarjat.set(j, uusir); // käytetään vanhaa rastia avaimena ja laitetaan uusi rasti jemmaan
            	        return uusir; 
        }
        kilpailu.sarjat = Array.from( data.sarjat, kopioi_sarjat );
        function kopioi_joukkue(j) {
                    let uusij = {};
                    uusij.nimi = j.nimi;
                    uusij.id = j.id;
            	    uusij.sarja = uudet_sarjat.get(j.sarja);

                    uusij["jasenet"] = Array.from( j["jasenet"] );
	            function kopioi_leimaukset(j) {
            	        let uusir = {};
            	        uusir.aika = j.aika;
            	        uusir.rasti = uudet_rastit.get(j.rasti); // haetaan vanhaa rastia vastaavan uuden rastin viite
            	        return uusir;
	            }
                    uusij["rastileimaukset"] = Array.from( j["rastileimaukset"], kopioi_leimaukset );
                    uusij["leimaustapa"] = Array.from( j["leimaustapa"] );
                    return uusij;
        }

        kilpailu.joukkueet = Array.from( data.joukkueet, kopioi_joukkue);
	return kilpailu;
}


