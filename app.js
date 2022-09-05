const cherio = require('cherio');
const fs = require('fs');
const http = require("https");
const {
    default: axios
} = require('axios');
const { response } = require('express');
const mime = require("mime-types");

async function getImageUrlFromDomain(domain) {
    let response = await axios.get(domain)
    //console.log(response.status)
    if (!response || response.status != 200) return console.log("something wents wrong and the response is not equal to 200");

    //Define Cherio or $ Object 
    const $ = cherio.load(response.data);
    const temp = []

    $("img").each((index, image) => {

        let img = $(image).attr('src');
        temp.push(img)
        
    });
    return temp;
}




async function downloadFile(url, domain) {
    try {
        //create a path to store images
        let path = `./downloads/${domain}`
        if (!fs.existsSync(path)) fs.mkdirSync(path)

        var resource = http.get(url, (res, err) => {
            if (err) return console.log(err.message);
           
            let contentType = mime.extension(res.headers["content-type"]);
            let fileType = res.headers["content-type"].split("/")
            if (fileType[0] != "image") return console.log("url is not a valid url image");
            let rootePath = `./${path}/imageFile_${new Date().getTime()}.${contentType}`
            console.log("file downloaded and trying to storing folder")
            return res.pipe(fs.createWriteStream(rootePath))

        })
    } catch (err) {
        return console.log(err)
    }
}
//downloadFile("https://github.com/Salman-110/Project05---Shopping-Cart-Product-management","example")

async function getDownloadImageFromUrl(domain){
    let arr = await getImageUrlFromDomain(domain)
    // We don't duplicate images hence im using new Set() for uniqueness.
    arr = [...new Set(arr)]
 
    let domainString = domain.split("/")[2]

    for(let image of arr){
        await downloadFile(image, domainString) 
    }
}
getDownloadImageFromUrl("https://www.google.co.in/search?q=chainsmokers+closer+ringtone&client=ms-android-vivo&sxsrf=ALiCzsbXFux_b_7Q6LktVZ0XG9agz34rEg:1662372632967&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjRq5bStP35AhWx0nMBHS-8BnwQ_AUoA3oECAEQBQ&biw=1366&bih=624")