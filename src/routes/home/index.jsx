import React, { useState, useEffect } from "react";
import "../../globals.css"

import homeStyles from "./styles.module.css";
import IndividualPR from "./component_indiv_pr";

function Home() {

  const [listOfPRs, setListOfPRs] = useState([]);
  const [inputUrl, setInputUrl] = useState("");
  const [messageCount, setMessageCount] = useState({});
  const [prStatus, setPrStatus] = useState("open");
  const [pageNo, setPageNo] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const submission = async () => {

    const enteredURL = inputUrl || document.getElementById("repo_url").value;
    let url;

    if(enteredURL) {
      
      setIsFetching(true);

      try{
        const pathname = new URL(enteredURL).pathname;
        url = checkURL(pathname)
      } catch (err) {
        url = checkURL(enteredURL);
      }
      
      if(url.url && url.commentsCountUrl) {
        setListOfPRs([]);
        const xhrReq = new XMLHttpRequest();
        xhrReq.addEventListener("load", async () => {
          if(xhrReq.response) {
            const response = JSON?.parse(xhrReq?.response)
            if(response?.length > 0) {
              // console.info("Response: ", response);
              setListOfPRs(response);
              setIsFetching(false);
  
              setMessageCount({});
              (await fetch(url.commentsCountUrl))
              .json()
              .then(prEmphasizedRes => {
                const prItems = prEmphasizedRes.items;
                // console.info("Response 2: ", prItems);
                prItems.forEach(prItem => {
                  setMessageCount(prevState => ({...prevState, [prItem.number]: prItem.comments}));
                });
                setTotalItems(prEmphasizedRes.total_count)
              });
            }
          }
        })
        xhrReq.open("GET", url.url+`?state=${prStatus}&per_page=25&page=${pageNo}`);
        xhrReq.send();
      } else {
        setIsFetching(false);
      }
    }
  }

  const checkURL = (pathname) => {
    let url;
    let commentsCountUrl;
    const replaceURL = pathname.replace(/repos/gi, "").replace(/pulls/gi, "").split("/").filter(item => item !== "");
    
    commentsCountUrl = `https://api.github.com/search/issues?q=is:pr${prStatus !== "" && prStatus.toLowerCase() !== "all" ? `%20state:${prStatus.toLowerCase()}` : ""}%20repo:${replaceURL[0]}/${replaceURL[1]}&per_page=25&page=${pageNo}`

    if(replaceURL.length === 2) {
      url = `https://api.github.com/repos/${replaceURL[0]}/${replaceURL[1]}/pulls`;
    }
    return { url, commentsCountUrl };
  }

  useEffect(() => {
    submission();
  }, [prStatus, pageNo])
  

  return (
    <div className={homeStyles.body_container}>
      <div className={homeStyles.header_container}>
        <h1 className={homeStyles.header_title} >{"Active Pull Requests"}</h1>
        <hr />
      </div>
      <form 
        className={homeStyles.url_form} 
        onSubmit={(ev) => {
          submission();
          ev.preventDefault(); 
        }}
      >
        <input 
          placeholder="Enter your repository url" 
          className={homeStyles.url_input} 
          id="repo_url" 
          value={inputUrl}
          onChange={(ev) => setInputUrl(ev.target.value)}
        />
        <select 
          className={homeStyles.pr_dropdown_state}
          onChange={(ev) => {
            setPrStatus(ev.target.value.toLowerCase());
          }}
        >
          <option>Open</option>
          <option>Closed</option>
          <option>All</option>
        </select>
      </form>
      {totalItems && 
        <div className={homeStyles.page_input_section}>
          <button 
            className={homeStyles.page_dir_btn}
            onClick={() => {
              console.info("click")
              if(pageNo !== 1) {
                setPageNo(pageNo-1);
              }
            }}
          >
            &#x3c;
          </button>
          <input className={homeStyles.page_input} value={pageNo} /> / <span>{Math.ceil(totalItems/25)}</span>
          <button 
            className={homeStyles.page_dir_btn}
            onClick={() => {
              if(pageNo !== totalItems) {
                setPageNo(pageNo+1);
              }
            }}
          >
            &#x3e;
          </button>
        </div>
      }
      <div className={homeStyles.display_pull_requests}>
        {
          listOfPRs.length > 0 ?
            <>
              {listOfPRs.map(pr => (
                <IndividualPR 
                  {...pr} 
                  messageCount={messageCount}
                />
              ))}
            </>
          : 
            <div className={homeStyles.empty_pull_request}>
              <p className={homeStyles.empty_pr_title}>Enter the GitHub repository link and hit Enter &#9166; to view the active pull requests</p>
            </div>
        }
      </div>

      {isFetching && 
        <div className={homeStyles.overlay}>
          <div className={homeStyles.loader_container}>
            <div className={homeStyles.loader}></div>
            <div><span>Fetching data</span></div>
          </div>
        </div>
      }
    </div>
  );
}

export default Home;
