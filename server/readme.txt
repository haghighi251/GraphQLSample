For getting a single book use this query:
{
  book(id:1){
    name
  }
}

For getting a single author use this query:
{
  author(id:1){
    name
  }
}

To add new book:
mutation{
  addBook(name:"New Book", authorId:1) {
    id
  }
}
