exports = function() {
  /*
    A Scheduled Trigger will always call a function without arguments.
    Documentation on Triggers: https://docs.mongodb.com/realm/triggers/overview/

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Access a mongodb service:
    const collection = context.services.get(<SERVICE_NAME>).db("<DB_NAME>").collection("<COLL_NAME>");
    const doc = collection.findOne({ name: "mongodb" });

    Note: In Atlas Triggers, the service name is defaulted to the cluster name.

    Call other named functions if they are defined in your application:
    const result = context.functions.execute("function_name", arg1, arg2);

    Access the default http client and execute a GET request:
    const response = context.http.get({ url: <URL> })

    Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
  */

  const collection = context.services.get("mongodb-atlas").db("flibusta").collection("Books");


  const getOpds = async (url)=> {
    const response = await context.http.get({url});
    return response.body.text();
  };

  const getBooks = async (url)=> {
    const opds = await getOpds(url);
    const books = context.functions.execute("xmlParserFlibusta", opds);
    return  books;
  };

  let page = 0;

  const updateLibrary = async (page)=> {
    const books = await  getBooks("http://flibusta.is/opds/new/"+page+"/new");
    const BookWithMinId = books[books.length-1];
    const result = await collection.findOne({_id:BookWithMinId._id});

    try {
      await collection.insertMany(books);
    }catch(e){
      console.log("error",JSON.stringify(e))
    }

    console.log('page', page);

    if(!result && page<10) {
      updateLibrary(++page);
    }

  };

  updateLibrary(page);

};