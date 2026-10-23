const deleteButtons = document.querySelectorAll('.delete-spot') // grabbing all the delete buttons on the page (index.ejs)

//grab every update rating button on the index.ejs page
const updateButtons = document.querySelectorAll('.update-rating')

// the following function happens only one time for each button
updateButtons.forEach(button => {
    //when the button gets clicked it will run this 
    button.addEventListener('click', () => {
        //pop up a box asking for the new rating
        const newRating = prompt('New rating out of 10?')

        if (!newRating) return

        //send the change to the server without reloading the page
        fetch('spots', {
            //PUT(update) is the http method that updates something thats existing
            method: 'PUT',
            //tell the server that the data it will recieve will be in JSON format
            headers: { 'Content-Type': 'application/json' },
            //package the spot's id and the new rating as a JSON text ( getting the appropraite id, and chaging the rating)
            body: JSON.stringify({ id: button.dataset.id, rating: newRating })
        }).then(res => {
            //once the server says ok, then reload the page into the '/' url which is the starting page and the new rating will show
            if (res.ok) location.reload()
        })
    })
})

// this will run 'for each' button one time
deleteButtons.forEach(button => {
    // then when its clicked it will run the function
    button.addEventListener('click', () => {
        //verify if they really want to delete the spot (just in case someoone accidentaly clicks the button but does not want it to actually get deleted)
        if (!confirm('Delete this spot?')) return

        // send the delete to the server.js without reloading and showcasing it gone on the ejs page
        fetch('spots', {
            //DELETE is the last of the CRUD methods, it removes something that exists
            method: 'DELETE',
            //set data as JSON so server can read it
            headers: { 'Content-Type': 'application/json' },
            // use the id, so it will delete that specific location and if there are two documents with the same name it knows to target the appropriate one thats clicked on
            body: JSON.stringify({ id: button.dataset.id })
        }).then(res => {
            // if the response works, reload the page
            if (res.ok) location.reload()
        })
    })
})
