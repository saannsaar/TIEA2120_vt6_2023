"use strict";










/* globals ReactDOM: false */
/* globals React: false */
/* globals data: false */
function App(props) {
  // Käytetään lähes samaa dataa kuin viikkotehtävässä 1
  // Alustetaan tämän komponentin tilaksi data.
  // Tee tehtävässä vaaditut lisäykset ja muutokset tämän komponentin tilaan
  // päivitettäessä React-komponentin tilaa on aina vanha tila kopioitava uudeksi
  // kopioimista varten on annettu valmis mallifunktio kopioi_kilpailu
  // huom. kaikissa tilanteissa ei kannata kopioida koko dataa
  const [state, setState] = React.useState({ "kilpailu": kopioi_kilpailu(data) });
  // console.log(state.kilpailu);
  const [kopiostate, setKopioState] = React.useState(state.kilpailu.joukkueet);
  const [showmapState, setshowmapState] = React.useState(false)
  //  console.log(state.kilpailu);
  // console.log(kopiostate);
  // console.log(state.kilpailu.sarjat);
  // console.log(Array.from(state.kilpailu));

  const sortedRastit = [...state.kilpailu.rastit].sort((a, b) => a.koodi.localeCompare(b.koodi));
  // console.log(sortedRastit);
  let listausRastit = sortedRastit.map((ele, i) => {
    return { ...ele, naytaInput: false, naytaKartta: false };
  });
  const [rastikopiostate, setRastikopioState] = React.useState(listausRastit);

  // console.log(rastikopiostate);
  const handleInsert = function (uusijoukkue) {
    let kisa = state.kilpailu;
    let joukkueet = Array.from(kisa.joukkueet);
    //Lisätään uudele joukkueelle key-arvo
    uusijoukkue.key = state.kilpailu.joukkueet.length + 1;
    joukkueet.push(uusijoukkue);

    // console.log(state);
    setKopioState([...kopiostate, uusijoukkue]);
    //n console.log(kopiostate);

  };

  const handleDoubleClick = function (listausrastit) {
    let list = [...listausrastit];
    setRastikopioState(listausrastit);
  };
  const handleBlur = function (listausrastit) {
    let list = [...listausrastit];
    setRastikopioState(listausrastit);
  };
  const handleClickmap = function (listausrastit, showmap) {
    // console.log(listausrastit);

    //TÄSSÄ JOKU MÄTTÄÄ????
    setRastikopioState(listausrastit);
   


    

  };
 
  /* jshint ignore:start */
  return (<div><div id="container1">
    <div className="part">
      <LisaaJoukkue handleInsert={handleInsert} kopio={kopiostate} setkopio={setKopioState} kilpailu={state.kilpailu} leimaustavat={state.kilpailu.leimaustavat} sarjat={state.kilpailu.sarjat} />
    </div>
    <div className="part">
      <ListaaJoukkueet joukkueet={kopiostate} rastit={rastikopiostate} />
    </div>
  </div>
    <div id="container2">
      <div id="rastilistadiv">
        <Rastilistaus rastit={rastikopiostate} handleClickmap={handleClickmap} handleBlur={handleBlur} handleDoubleClick={handleDoubleClick} />
      </div>
      <div id="mappi">
    
    
      </div>
      
      
    </div>
  </div>);
  /* jshint ignore:end */
}

const LisaaJoukkue = function(props) {
      
      /* jshint ignore:start */
      // console.log(props.kilpailu.leimaustavat);
      // console.log(props.kopio)
      let leimaustavat = props.kilpailu.leimaustavat;
      let leimObj = {};
      leimaustavat.forEach((elem, index) => {
        leimObj[elem] = index;
      });
      // console.log(leimObj);

      // console.log(props.kilpailu.sarjat)
      let sarjaObj = {}
      props.kilpailu.sarjat.forEach(elem => {
        sarjaObj[elem.nimi] = elem.id
      })

      // console.log(sarjaObj)

     
      const [jaseninputList, setjaseninputList] = React.useState(["Jäsen 1", "Jäsen 2"])
      const [jasenCounter, setjasenCounter] = React.useState(2)
      const [leimausstate, setLeimausstate] = React.useState([])
      const [checkstate, setCheckstate] = React.useState([]);
      // console.log(props.leimaustavat[0])
      // console.log(props.sarjat[0].nimi)

      let [formistate, setFormistate] = React.useState({
        nimi : "",
        leimaustapa : [props.leimaustavat[0]],
        sarja : props.sarjat[0].nimi,
        jasenet: ["", ""],
        key: Date.now()
    });    
    let checkboxes = []; // checkboxien virheilmoitusten nollaamista varten tarvitaan taulukko
    let jaseninputit = [];

   
    
    const handleChange = function(event, index) {
    let obj = event.target;
    let luokka = obj.className;
    let arvo = obj.value;
    let kentta = obj.name;
    let type = obj.type;
    let checked = obj.checked;
    let validity = obj.validity;
    let newstate = {...formistate}; 
    // console.log(kentta, arvo)
    // console.log(newstate)
    
    if ( type == "checkbox" ) {
      // console.log(Array.isArray(newstate[kentta]))
      // console.log(newstate[kentta])
      // console.log(formistate[kentta])
      // console.log(formistate[kentta].slice())
      newstate[kentta] = formistate[kentta].slice(0)
      // tehdään kopio, koska alkuperäistä ei voi suoraan käyttää. Huom. tämä slice-temppu ei riitä, jos taulukossa on objekteja. Ei siis tee "deep" kloonia
      // console.log(newstate[kentta])
      // console.log(Array.isArray(newstate[kentta]))
      // console.log(Array.isArray(formistate[kentta]))
     
     
      if ( checked ) {
          // lisätään
       
          
        
          newstate[kentta] = [...newstate[kentta], arvo]
          // console.log(newstate[kentta])
          //console.log(newstate)
         
      }
      else {
          // poistetaan
         newstate[kentta].splice(newstate[kentta].indexOf(arvo),1) 
        
         
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

  }  else if (  kentta == "nimi") {
    // console.log("NIMI")
      for (let j of props.kopio) {
        if (j.nimi.trim().toLowerCase() == arvo.trim().toLowerCase()){
          obj.setCustomValidity("Ei samannimisiä");
          obj.reportValidity();
          newstate[kentta] = arvo;
      setFormistate(newstate);
        
          
         return;
     }
    
     else if (arvo.length == 0) {
      obj.setCustomValidity("Lisää nimi")
      obj.reportValidity();
      newstate[kentta] = arvo;
      setFormistate(newstate);
      return;
     }else {
         obj.setCustomValidity("");
         newstate[kentta] = arvo;
        
     }
      }

      
    } else if (arvo.length == 0) {
    obj.setCustomValidity("Täytä kenttä!!!")
  } else if (luokka == "jasenet"){
    
    // console.log(index)
    newstate["jasenet"] = formistate["jasenet"].slice(0)
    // console.log(formistate["jasenet"])
    // console.log(newstate["jasenet"].length)
    if (index > newstate["jasenet"].length) {
      let uusi = [...newstate["jasenet"]]
     uusi.push(arvo)
     newstate["jasenet"] = uusi
    } else {
      newstate["jasenet"][index] = arvo
    }
   
    
  


  console.log(newstate["jasenet"])
  console.log(newstate)


  console.log(formistate)
console.log(jasenCounter)
  if (newstate["jasenet"].length >= jasenCounter && jasenCounter < 5 && newstate["jasenet"].includes("") == false) {
    console.log("Nyt pitää lisätä", newstate["jasenet"].length);
    let pituus = newstate["jasenet"].length +1
    console.log(pituus)
    let counter = jasenCounter +1
    setjasenCounter(counter)
    console.log(jasenCounter)
    let uusistate = [...newstate["jasenet"], ""]
    newstate["jasenet"] = uusistate
   

    setjaseninputList([...jaseninputList, `Jäsen ${pituus}`])

    
  }

  


 
  
  let apuarr = []
  for (let j of newstate["jasenet"]) {
    if (j != "") {
      console.log(j)
      apuarr.push(j)
    }
  }

  if (apuarr.length <2) {
    obj.setCustomValidity("Vähintään 2 jäsentä pitää lisätä! :)")
    jaseninputit.push( obj );
  } else {
    obj.setCustomValidity("")
    for (let i of jaseninputit) {
      i.setCustomValidity("")
    }

  }
  jaseninputit = []



  // =======

  }
  else {
  // console.log(kentta)
  // console.log(newstate[kentta])
          newstate[kentta] = arvo;
        

  }
 setFormistate(newstate);
 // console.log(newstate)

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
      
      
        if ( formistate["nimi"] == ""  || formistate["sarja"] == ""  || formistate["jasenet"] == "" ) {
            // tänne ei pitäisi päästä
           
            virhe++;
            return false;
        }
       
        uusijoukkue["nimi"] = formistate["nimi"];
       
        uusijoukkue["id"] = generateId();
        uusijoukkue["sarja"] = {id: sarjaObj[formistate["sarja"]], nimi: formistate["sarja"]};
        
       
        
        
   
        let arr = [];
        for (let i of formistate["leimaustapa"]) {
          console.log(i)
         arr.push(leimObj[i])
        }
   
       
        uusijoukkue["jasenet"] = formistate["jasenet"].filter(j => j)
        uusijoukkue["rastileimaukset"] = ""
       uusijoukkue["leimaustapa"] = arr

        
        
     
       
         
    }
    
   
  
    let newstate = {
      nimi : "",
      leimaustapa : [],
      sarja : "radio",
      jasenet: ["", ""],
      key: Date.now()
    }

    setFormistate(newstate);
    setjaseninputList(["Jäsen 1", "Jäsen 2"])

    props.handleInsert(uusijoukkue);
    event.target.reset();
   
    
  } 



    return (  
    <div>
    <form method="post" onSubmit={handleInsert}>
    <fieldset  key={formistate.key} onChange={handleChange}>
    <legend>Lisää joukkue</legend>
    <label key="nimi">Nimi <input required="required" onChange={handleChange} type="text" name="nimi"  value={formistate.nimi} /></label>
    {console.log(props.sarjat)} 

    {props.leimaustavat.map(item => 
    <label key={item + "l"} >
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
      jaseninputList.map((item, index) => 

        <label key={item}>{item} <input onChange={event => handleChange(event, index)} type="text" name ={item}className="jasenet" value={formistate.jasenet[index]}/></label>
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
      
      console.log(sortedArr)
      const sortedwithTimestamps = sortedArr.map(elem => {
        return {...elem, rastileimaukset: elem.rastileimaukset.sort((a,b) => a.aika.localeCompare(b.aika))}
      })
      console.log(sortedwithTimestamps)

      console.log(props.rastit)
      let rastiObj = {}
      for (let rasti of props.rastit) {
        let rLat = rasti.lat
        let rLon = rasti.lon
        let koor = []
        koor.push(rLat)
        koor.push(rLon)
        rastiObj[rasti.koodi] = koor
      }
      console.log(rastiObj)

      let apuarray = [];
      for (let j of sortedwithTimestamps) {
        let leimausArr = []
        for (let a of j.rastileimaukset) {
          if (a.rasti == undefined) {
            continue
          } else {
            leimausArr.push(rastiObj[a.rasti.koodi])
          }
         
        }
        console.log(leimausArr)
        let matka = 0
        if (leimausArr.length == 0) {
          matka = 0
        }
        else {
          for (let k = 0; k < leimausArr.length-1; k++) {
            matka += getDistanceFromLatLonInKm(leimausArr[k], leimausArr[k+1])
            matka = Math.round(matka * 10) / 10;
       
            
          }
        }
        j.matka = matka 
       

      }



      console.log(sortedwithTimestamps)


      //Loopataan järjestettyjen joukkueiden läpi ja jokaista joukkuetta kohden suoritetaan
      //erillinen "YkisttainenJoukkue" komponentti joka luo oikeanlaisen rivin "table"-elementtiin
      //Joukkueen sarjan, nimen ja jäsenien perusteella
      return (<table>
        <tbody>
          <tr>
            <th>Sarja</th>
            <th>Joukkue</th>
            <th>Jäsenet</th>
            <th>Matka</th>
          </tr>
        
          {Object.keys(sortedwithTimestamps).map((i) =>
           <YksittainenJoukkue joukkue={sortedwithTimestamps[i]} key={i}/>
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
          <JasenListaus jasenet={props.joukkue.jasenet}/>
        </ul>
      </td>
      <td> {props.joukkue.matka}</td>
    </tr>
  )
}

const JasenListaus = function(props) {
  return (
<ul>
{Object.keys(props.jasenet).map((j, index) => 
   
   <li key={index + "_" + props.jasenet[j]}>{props.jasenet[j]}</li>
   
   )}
</ul>
  )
  
}

const Rastilistaus = function(props) {





  
  const [mapInstance, setMapInstance] = React.useState(null);
  const [marker, setMarker] = React.useState(null);

  const mapRef = React.useRef(null);
  const tileRef = React.useRef(null);
  const markerRef = React.useRef(null);


  tileRef.current = L.tileLayer.mml_wmts({ layer: "maastokartta", key : "8c118a1f-99c2-4e8a-8849-54dc255f3205" })

  const [mapStyles, setMapStules] = React.useState({ visibility: 'hidden'})

  const mapParams = {
    center: [62.148123, 25.647515], 
    crs: L.TileLayer.MML.get3067Proj(),
    zoom: 8,
    zoomControl: false,
    layers: [tileRef.current], 
  };
  React.useEffect(() => {
    mapRef.current = L.map('mapp', mapParams);
    // Add an event listener:
    mapRef.current.on('click', () => {
      console.log('map clicked');
    });
    // Set map instance to state:
    setMapInstance(mapRef.current);
  }, []);

  React.useEffect(() => {
    // Check for the map instance before adding something (ie: another event listener).
    // If no map, return:
    if (!mapInstance) return;
    if (mapInstance) {
      mapInstance.on('zoomstart', () => {
        console.log('Zooming!!!');
      });
    }
  }, [mapInstance]);

 


  

 const [muutettava, setMuutettava] = React.useState({
  koodi: ""
 })


  const handleChange = function(e) {

    let newstate = [...muutettava]
    if (isNaN(e.target.value.charAt(0))) {
   

      e.target.setCustomValidity("Rasti pitää alkaa numerolla")
      e.target.reportValidity()
      newstate["koodi"] = e.target.value
      setMuutettava(newstate)
      return
    } else {
      e.target.setCustomValidity("")
      newstate["koodi"] = e.target.value
     
    }
    setMuutettava(newstate)
  }


  const handleDoubleClick = function(e) {
    // console.log("DOUBLE CLICK")
    // console.log(e.target.textContent)
    let teksti = e.target.textContent.trim()
    let indeksi = teksti.indexOf(" ");
    
    let tarvittavaosa = teksti.slice(0, indeksi).trim()
    console.log(tarvittavaosa)
    let uus = props.rastit.map(elem => {
     
      if (elem.koodi.trim().toLowerCase() == teksti.toLowerCase()) {
        console.log(elem)
        setMuutettava({koodi: elem.koodi})
       return {...elem, naytaInput: true}
       
      } else {
        return elem
      }
      
    })

  
    props.handleDoubleClick(uus)
    
  }
  const handleClickmap = function(e) {
    console.log("Nyt lisätään map")
     console.log(e.target)
    
     console.log(e.target.offsetTop)
     let sijainti = e.target.offsetTop.toString().concat("px")
    
     let naytettava;

     let uus = props.rastit.map(elem => {
     
      if (elem.id == e.target.getAttribute("id")) {
        console.log(elem)
        naytettava = [elem.lat, elem.lon]
       return {...elem, naytaKartta: true}
       
      } else {
        return {...elem, naytaKartta: false}
      }})
      console.log(naytettava)

      if (marker) {
        marker.removeFrom(mapInstance);
        markerRef.current = null;
        setMapStules({visibility: "hidden"})
     
        
      } else {
        setMapStules({visibility: ""})
     
        markerRef.current = L.marker(naytettava, {draggable: true, id: e.target.id}).addTo(mapInstance);
        markerRef.current.on("dragstart", function(e) {
          console.log("DRAG ALKO")
        })
        markerRef.current.on("dragover", function(e) {
          console.log("DRAG dragover")
        })
        markerRef.current.on("dragend", function(e) {
          console.log("DRAG loppu")
          console.log(e.target.getLatLng().lat)
          console.log(e.target.options.id)
          let uus = props.rastit.map(elem => {
            if (elem.id == e.target.options.id) {
              return {...elem, lat: e.target.getLatLng().lat, lon: e.target.getLatLng().lng}
            } else {
              return {...elem}
            }
            
          })
          props.handleClickmap(uus)
        })
        mapInstance.setView(naytettava, 8)
        console.log(document.getElementById("mapp"))
        document.getElementById("mapp").style.top = sijainti
      }
      setMarker(markerRef.current);

      props.handleClickmap(uus)
  }
 
  const handleMapBlur = function(e) {
    console.log("Pois mäppi")
    console.log(e.target)
  }

  // Rastin muokkaus inputista poistumista käsittelevä funktio
  // jossa muokattavan rastin "naytaInput" muutetaan "false", jotta osataan
  // muuttaa se taas pelkäksi tekstiksi input laatikon sijaan
  const handleBlur = function(e) {
    console.log("blur")
    console.log(e.target)
    console.log(muutettava)
    
    // etsitään rasteista muokattavissa oleva rasti, jotta ostaan vaihtaa
    // oikeaan elementtiin naytaInput arvo
    let uus = props.rastit.map(elem => {
     
      if (elem.id == e.target.getAttribute("id")) {
        console.log(elem)

       return {...elem, koodi: muutettava["koodi"] , naytaInput: false}
       
      } else {
        return elem
      }
      
    })
    console.log(uus)
   
props.handleBlur(uus)
let newstate = {koodi: ""}
setMuutettava(newstate)
  }

  return (
    <div>
    <div>
    <ul>
      {
      props.rastit.map((rasti, index) => 
      <Elementti value={rasti.koodi}
      handleChange={handleChange}
      handleDoubleClick={handleDoubleClick}
      handleBlur={handleBlur}
      handleClickmap={handleClickmap}
      handleMapBlur={handleMapBlur}
      id={rasti.id}
      lat={rasti.lat}
      lon={rasti.lon}
      muutettava={muutettava["koodi"]}
      naytaInput={rasti.naytaInput}/>)}
    </ul>

   
    </div>
    
    <div>
       
    <div id="mapp" style={mapStyles} />

</div>
</div>
  )

}

// Oma komponentti yksittäisen li elementin luomiselle
const Elementti = function(props) {
  
  return (
    <li key={props.id}>
      {
        // Jos propsina annetun joukkueen "naytaInput" arvo on "true", näytetään text-input laatikkona johon
        //rastin nimi on lisätty arvoksi, jos "naytaInput" arvo on "false", näytetään normaalina tekstielementtinä
        props.naytaInput ? (
          <p><input id={props.id} type="text" value={props.muutettava} onChange={props.handleChange} onBlur={props.handleBlur} autoFocus/> ( {props.lat} {props.lon} )</p>
        ) : (
          <div><p onDoubleClick={props.handleDoubleClick} > {props.value} </p><p id={props.id}onClick={props.handleClickmap} onBlur={props.handleMapBlur}> ( {props.lat} {props.lon}) </p></div>
         
         
        )
      }
    </li>
  )
}


function getDistanceFromLatLonInKm(koor1, koor2) {

  let lat1 = koor1[0];
  let lon1 = koor1[1];
  let lat2 = koor2[0];
  let lon2 = koor2[1];
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2-lat1);  // deg2rad below
  let dLon = deg2rad(lon2-lon1);
  let a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c; // Distance in km
  return d;
}
/**
   Muuntaa asteet radiaaneiksi
  */
function deg2rad(deg) {
  return deg * (Math.PI/180);
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


