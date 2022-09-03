/**
 * In this file, we are going to get data from our GraphQL API.
 * We just will get the books list and put them on some h3 HTML tag.
 */
try {
    const booksList = document.getElementById('booksList');

    fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            query: `query{
  books{
    id,name
  }
}`
        })

    })
        .then(res => res.json())
        .then(data => {
            data.data.books.forEach(book => {
                const newH3 = document.createElement('h3');
                newH3.innerText = book.name;
                newH3.setAttribute('data-id',book.id)
                booksList.append(newH3);
            })
        })
        .catch(e => {
            console.log(e)
        })

} catch (e) {
    console.log(e);
}
