const draw = document.querySelector('#barile')

const ctx = draw.getContext('2d')

let H = window.innerHeight
let W = window.innerWidth


// le barile

let xBarile = (window.innerWidth / 2) - 175
let yBarile = 120
let yflotte = 160
let yBarileFront = 170

let xCentre = W / 2
let yCentre = 480

let aBarile = 0.0001
let vBarile = 0;

let rotaleft = false;
let rotaright = false;

// le alpha on s'en fou

let angle = 0;

let aRedressement = 0;

let VitesseUtilisateur = 0;

let contenu = 100;
let facteurVide = 0;

let vitesse = 1;

let derniereLat = null;
let derniereLong = null;
let derniertemps = null;
let distance = 0;
let temps = 0

let coordonnées = []

// plus la vitesse est grande, plus le tonneau tremble (impacte surtout au début)

let tremblements = 0;

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {

        if (coordonnées.length <= 20) {
            coordonnées.push([position.coords.latitude, position.coords.longitude]);
        }
        else {
            coordonnées.splice(0, 1);
            coordonnées.push([position.coords.latitude, position.coords.longitude]);
        }

        if (coordonnées.length == 21) {
            document.querySelector('.tableau').innerHTML = "";
            let latitude = 0;
            let longitude = 0;
            coordonnées.forEach(element => {
                latitude += element[0]
                longitude += element[1]
            });

            latitude = latitude / coordonnées.length
            longitude = longitude / coordonnées.length

            let tempsActuel = Date.now();

            // faire une moyenne des points et afficher la distance après
            if (derniereLat && derniereLong) {
                distance = calculeDistance(derniereLat, derniereLong, latitude, longitude)

                
                temps = (tempsActuel - derniertemps) / 1000;
                if (temps > 0) {
                    vitesse = (distance / temps) * 3600; // km/h
                    console.log(vitesse)
                    if (vitesse == 0) {
                        vitesse = 1;
                    }
                }

                coordonnées.forEach(e=>{
                    document.querySelector('.tableau').innerHTML += e + " <br> "
                })
            }

            document.querySelector('.coo').innerHTML = distance * 1000 + " | "+ derniereLat +  " | " + latitude

            derniereLat = latitude
            derniereLong = longitude
            derniertemps = tempsActuel
        }
    }, (error) => {
        console.error("Erreur de géolocalisation :", error);
    }, { enableHighAccuracy: true, timeout: 1000 });
}
else {
    console.log('le navigateur ne supporte pas la geolocalisation')
}



function calculeDistance(lastlat, lastlong, lat, long) {
    // transition des coordonnée données par la position de l'utulisateur en KM, aide de l'IA pour cela

    // rayon de la terre de la terre, car les coordonnées sont basées sur des degrés decimaux, pour calculer une distance, on peut utiliser la formule Haversine trouvée sur internet 
    // fonction trouvée sur internet et convertie en code, un enfer
    const RayonTerre = 6371;

    const radiants = Math.PI / 180;

    let a = (Math.sin(((lat - lastlat) * radiants) / 2) * Math.sin(((lat - lastlat) * radiants) / 2)) + Math.cos(lastlat * radiants) * Math.cos(lat * radiants) * (Math.sin(((long - lastlong) * radiants) / 2) * Math.sin(((long - lastlong) * radiants) / 2))

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return RayonTerre * c;

    // distance en km
}

function initialisation() {
    draw.width = window.innerWidth
    draw.height = window.innerHeight
}

window.addEventListener('deviceorientation', inclinaison_tel, true)

function inclinaison_tel(event) {
    let beta = event.beta || 0;   // Inclinaison avant-arrière (-180 à 180)
    let gamma = event.gamma || 0; // Inclinaison gauche-droite (-90 à 90)
    let alpha = event.alpha || 0; // Orientation absolue (0 à 360)

    // Corriger l'inclinaison en fonction de l'orientation
    let inclinaison = Math.cos(gamma) * alpha + Math.sin(beta) * gamma

    aRedressement = 0.0001 * inclinaison;
}

function calculer() {
    VitesseUtilisateur = 1 / vitesse * 10000;

    if(vitesse >= 3){
        if(contenu >= 1){
            tremblements = (vitesse * 0.005) / (contenu/50);
        }
        else{
            tremblements = 0;
        }
    }
    else{
        tremblements = 0;
    }

    contenu -= tremblements;

    let Random = parseInt(Math.random() * VitesseUtilisateur)

    if (Random == 1) {
        let R2 = parseInt(Math.random() * 10)

        if (R2 <= 4) {
            rotaleft = true;
            rotaright = false;
        }

        if (R2 >= 5) {
            rotaright = true;
            rotaleft = false;
        }
    }

    if (rotaleft) {
        vBarile = aBarile;
    }
    if (rotaright) {
        vBarile = aBarile;
    }

    vBarile += aRedressement;
    angle += vBarile;

    document.querySelector('.info1').innerHTML = `Vitesse estimée : ${vitesse} km/h pour ${Math.round(distance*1000)/1000} KM en ${Math.floor(temps)} secondes <br> La probabilité pour que le tonneau bouge est de : 1 chance sur ${VitesseUtilisateur}`;
    document.querySelector('.contenu').innerHTML = `Contenu du barile : ${Math.round(contenu*100)/100} %, facteur de baisse lié au tremblements : ${Math.round(tremblements * 1000)/1000}`
}

function afficher() {

    ctx.fillStyle = "#09C";
    ctx.fillRect(0, 0, W, H);

    function dessinerRectangle(yDéplacement, color, taille) {
        // Store the current context state (i.e. rotation, translation etc..)
        ctx.save()
        ctx.translate(xCentre, yCentre);
        //Rotate the canvas around the origin
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillStyle = color;
        ctx.fillRect(-350 / 2, yDéplacement - taille / 2, 350, taille)
        // Restore canvas state as saved from above
        ctx.restore();
    }

    dessinerRectangle(0, "#5b3c11", 650);  // Baril
    dessinerRectangle(20, "#FFFFF0", 610); // Ombre du baril
    dessinerRectangle(25, "#6b4c21", 600); // Avant du baril

    if(contenu == 0){
        stopGame();
    }
}

function stopGame(){
    console.log('Perdu.')

    
}

function boucle() {
    calculer()
    afficher()

    window.requestAnimationFrame(boucle)
}

initialisation()
boucle()