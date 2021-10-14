import libraries from '../data/libraries.json';
import genres from '../data/genres.json';
import flibustaParser from '../service/xmlParserFlibusta';
const proxyCorsUrl ="https://api.allorigins.win/raw?url=";

const opds =  {
  library: "Flibusta",
  setApp(app) {
    this.app = app;
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    this.collection = mongodb.db("flibusta").collection("Books");
    return this;
  },
  lib(name) {
    this._lib = libraries.filter(el=>el.name === name)[0];
    console.log(this._lib)
    this.pageIndex = {};
    return this
  },
  filter(options){
    if(options.author){
      this.buildUrl = (page)=>"/opds/author/" + options.author + "/time"+"/"+(page-1);
    }else if(options.sequence){
      this.buildUrl =  (page)=> "/opds/sequencebooks/"+options.sequence+"/"+(page-1);
    }else if(options.genreId){
      this.buildUrl = (page)=> "/opds/new/"+(page-1)+"/newgenres/"+options.genreId;
    }else{
      delete this.buildUrl;
    }
  },
  async getPage(page) {

    if(this.buildUrl){
      const  result = await fetch(proxyCorsUrl+encodeURIComponent(this._lib.url+this.buildUrl(page)))
        .then(res=>res.text()).then(res=>flibustaParser(res));
      return  result;
    }else{
      let query = {lid: this._lib.id};
      if(page >1) query.bid = {$lt: this.pageIndex[(page-1)]};
      const result = await this.collection.find(query,{sort:{"_id":-1}, limit:20});
      if(result.length) this.pageIndex[page] = result[result.length-1].bid;
      //console.log('res',result);
      return result;
    }

  }
};



export default opds