const  map=document.querySelector("svg");
const countries=document.querySelectorAll("path");
const sidePanel=document.querySelector(".sidepanel");
const container=document.querySelector(".sidepanel .container");
const close=document.querySelector(".closebutton");
const loading=document.querySelector(".loading");
const zoomInBtn=document.querySelector(".zoom-in");
const zoomOutBtn=document.querySelector(".zoom-out");
const zoomValueText=document.querySelector(".zoom-value");
const countrynameout=document.querySelector(".countryname");
const city=document.querySelector(".capital");
const countryflag= document.querySelector(".flag");
const areaout=document.querySelector(".area");
const currencyout=document.querySelector(".currency");
const language=document.querySelector(".languages");


countries.forEach(country => {
    country.addEventListener("mouseenter",function(){
        const classList=[...this.classList].join('.');
        const selector='.'+classList;
        const matchingElements=document.querySelectorAll(selector);
        matchingElements.forEach(el=>el.style.fill="#c99aff")
    });
    country.addEventListener("mouseout",function(){
        const classList=[...this.classList].join('.');
        const selector='.'+classList;
        const matchingElements=document.querySelectorAll(selector);
        matchingElements.forEach(el=>el.style.fill="#443d4b")
    });
    country.addEventListener("click",function(e){
     loading.innerText="Loading...";
     container.classList.add("hide");
     loading.classList.remove("hide")
    let clickedCountryName;
    if(e.target.hasAttribute("name")){
        clickedCountryName=e.target.getAttribute("name");
    }else{clickedCountryName=e.target.classList.value;}
    sidePanel.classList.add("sidepanel-open");
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
    .then(Response=>{
        if(!Response.ok){
            throw new Error('network response was not ok');

        }
        return Response.json();
    })
    .then(data=>{
        setTimeout(()=>{
            countrynameout.innerText=data[0].name.common;
            countryflag.src=data[0].flags.png;
            city.innerText=data[0].capital;
            const formatedNumber=data[0].area.toLocaleString('de-DE');
            areaout.innerHTML=formatedNumber+'km<sup>2</sup>';
            const currencies=data[0].currencies;
            currencyout.innerText="";
            Object.keys(currencies).forEach(key=>{
               currencyout.innerHTML+=`<li>${currencies[key].name}</li>`;
            });
            const languages=data[0].languages;
            language.innerText="";
            Object.keys(languages).forEach(key=>{
                language.innerHTML+=`<li>${languages[key]}</li>`;
            });
            countryflag.onload=()=>{
                container.classList.remove("hide");
                loading.classList.add("hide");
            };
        },500);
    })
    .catch(error=>{
        loading.innerText="no data to show";
    });
    });
});
close.addEventListener("click",()=>{
    sidePanel.classList.remove("sidepanel-open");
});
let zoom = 1; 
zoomOutBtn.disabled = true;
zoomInBtn.addEventListener("click", () => {
zoom += 0.2;
applyZoom();
});
zoomOutBtn.addEventListener("click", () => {
 zoom -= 0.2;
applyZoom();
});

function applyZoom() {
    if (zoom <= 0.4) {zoom = 0.4;zoomOutBtn.disabled = true;}
     else { zoomOutBtn.disabled = false;}
    if (zoom >= 3) {
        zoom = 3;
        zoomInBtn.disabled = true;
    } else {zoomInBtn.disabled = false;}

    map.style.transform = `scale(${zoom})`;
    map.style.transformOrigin = "center";

    zoomValueText.innerText = Math.round(zoom * 100) + "%";
}

