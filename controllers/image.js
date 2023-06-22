// function isValidUrl(str) {
//     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//         '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//         '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//         '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//         '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//         '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//     return !!pattern.test(str);
// }

const handleApiCall = (req, res) => {
    const raw = JSON.stringify({
        user_app_id: {
            user_id: "clarifai",
            app_id: "main",
        },
        inputs: [
            {
                data: {
                    image: {
                        url: req.body.input,
                    },
                },
            },
        ],
    });

    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Key " + "0a8a23cc62a54f75a8021375162c7b68",
        },
        body: raw,
    };
    fetch(
        `https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`,
        requestOptions
    )
        .then((response) => response.text())
        .then(result => {
            // console.log(isValidUrl(JSON.parse(result).outputs[0].input.data.image.url));
            // if(true){
                res.json(result)
            // }
            // else {
            //     res.status(400).json("Invalid URL")
            // }

        })
        .catch(err => res.status(400).json("Unable to get entries."))
}

const handleImage = (db) => (req, res) => {
    const {id} = req.body;
    db('users')
        .where('id', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json("Unable to get entries"))
}
module.exports = {
    handleImage,
    handleApiCall
}