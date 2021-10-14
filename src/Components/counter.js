import React, {useEffect, useState} from 'react';


export default  ()=>{






  const url = 'http://flibusta.is/opds/genres';
  const proxyCorsUrl ="https://api.allorigins.win/raw?url=";
  const genresMain = [];
  const [items, setItems] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const [genres, setGenres] = useState([]);
/*
  fetch(proxyCorsUrl+url).then(res=>res.text()).then(
    res=> {
      const titles = []
      const xml = new DOMParser().parseFromString(res, "application/xml");
      const feed = xml.childNodes.item(0).nodeName === "feed"? xml.childNodes.item(0): xml.childNodes.item(2);
      for (let i = 0; i < feed.childNodes.length; i++) {
        let item = feed.childNodes.item(i);
        if(item.nodeName === 'entry') {
          for (let ii = 0; ii < item.childNodes.length; ii++) {
            let el = item.childNodes.item(ii);
            if(el.nodeName === 'link') {
              const href = el.getAttribute('href');
              genresMain.push(href)

            }else if(el.nodeName === 'title') {
              titles.push(
                (<li>{el.textContent}</li>)
              )
            }
          }
        }
      }
      setItems(titles)
    }

  );
*/

const createDom = (string)=> {
  return  new DOMParser().parseFromString(string, "application/xml");
};

const getPage = async (url)=> {
  return fetch(url).then(res=>res.text())
};

  const getEntries =  (dom)=> {
    const result = [];
    const feed = dom.childNodes.item(0).nodeName === "feed"? dom.childNodes.item(0): dom.childNodes.item(2);
    for (let i = 0; i < feed.childNodes.length; i++) {
      let item = feed.childNodes.item(i);
      if(item.nodeName === 'entry') {
        const entry = {};
        for (let ii = 0; ii < item.childNodes.length; ii++) {
          let el = item.childNodes.item(ii);
          if(el.nodeName === 'link') {
            entry.href = el.getAttribute('href');
          }else if(el.nodeName === 'title') {
            entry.title = el.textContent;
          }
        }
        entry.id = entry.href.split('/')[4];
        result.push(entry);
      }
    }
    return result;
  };

useEffect(async()=> {
  const xmlString =  await getPage(proxyCorsUrl+url)
  const dom = createDom(xmlString);
  const entries =  getEntries(dom);
  setItems(entries.map(el=>(<li><a href={el.href} target="_blank">{el.title}</a></li>)))

  const allGenres = [];
  for(let entry of entries) {
    const xmlString =  await getPage(proxyCorsUrl+'http://flibusta.is'+entry.href)
    const dom = createDom(xmlString);
    const entries =  getEntries(dom);
    allGenres.push({title:entry.title,href:entry.href,entries});
   // setSubItems([...subItems, ...entries])
    //setSubItems([...subItems, ...entries]);
    console.log(allGenres);
  }
  setSubItems(allGenres);

},[]);

console.log(subItems);

  return <ul>
    {items}
    <hr/>
    {subItems.map(el=>el.entries.map(e=>(<li><a href={e.href} target="_blank">{e.title}</a></li>)))}
  </ul>
}

