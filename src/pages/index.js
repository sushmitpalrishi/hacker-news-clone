import React, { useState, useRef, useEffect, useCallback } from "react";
import "./index.css";
import "./queries.css";
import axios from "axios";
import Pagination from "./Pagination";

import Chartjs from "chart.js";
import Posts from "./Posts";

let _chartInstance = "";
let page_count;
let voteDataGroup = [];
let idDataGroup = [];
let currentPosts;
let allPostData;
let currentPostInPage;

export default function Home() {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("page_count") == null) {
      page_count = 0;
      localStorage.setItem("page_count", 0);
    } else {
      page_count = localStorage.getItem("page_count");
    }
  }

  ////console.log("page_count = ", page_count);

  // const [voteDataGroup,setVoteDataGroup] = useState([]);
  // const [idDataGroup,setIdDataGroup] = useState([]);

  const chartContainer = useRef(null);
  let [chartInstance, setChartInstance] = useState(null);
  const [updateGraphOnUpVote, setUpdateGraphOnUpVote] = useState({});
  const getUpvoteUpdate = useCallback(updatedUpvoteCount => {
    setUpdateGraphOnUpVote(updatedUpvoteCount);
    //do other things here
    //console.log("updatedUpvoteCount = ", updatedUpvoteCount);
    handleGraphUpdateOnUpvoteClick(updatedUpvoteCount);
  }, []);

  const chartConfig = {
    type: "line",
    data: {
      labels: idDataGroup,
      datasets: [
        {
          label: "Number of upvotes",
          fill: false,
          data: voteDataGroup,
          borderWidth: 1,
          pointBackgroundColor: "black",
          borderColor: "grey",
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      elements: {
        line: {
          tension: 0,
        },
      },
    },
  };

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
      ////console.log("newChartInstance = ", newChartInstance);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);
  // chartInstance.update();
  ////console.log("chartInstance = ", chartInstance);
  _chartInstance = chartInstance;
  ////console.log("_chartInstance = ", _chartInstance);

  const updateDataset = (datasetIndex, newData, newLabel) => {
    ////console.log("chartInstance = ", _chartInstance);
    //setChartInstance(_chartInstance);
    chartInstance = _chartInstance;
    chartInstance.data.datasets[datasetIndex].data = newData;
    chartInstance.data.labels = newLabel;
    chartInstance.update();
  };

  const [loading, setLoading] = useState(false);
  const [totalPostData, setTotalPostData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [isPreviousButtonDisabled, setIsPreviousButtonDisabled] = useState(
    false
  );

  let indexOfLastPost = currentPage * postsPerPage;
  let indexOfFirstPost = indexOfLastPost - postsPerPage;
  currentPosts = totalPostData.slice(indexOfFirstPost, indexOfLastPost);
  currentPostInPage = totalPostData.slice(indexOfFirstPost, indexOfLastPost);
  ////console.log("currentPosts = ", currentPosts);
  ////console.log("totalPostData = ", totalPostData);
  let paginate = pageNumber => {
    //console.log("pageNumber = ", pageNumber);
    //console.log("totalPostData = ", totalPostData);
    
    page_count = pageNumber;
    setCurrentPage(pageNumber);
    idDataGroup = [];
    voteDataGroup = [];
    //update graph array here
    for (var q = 0; q < currentPosts.length; q++) {
      voteDataGroup.push(currentPosts[q].points);
      idDataGroup.push(currentPosts[q].objectID);
    }
    //console.log("voteDataGroup = ", voteDataGroup);
    //console.log("idDataGroup = ", idDataGroup);

    updateDataset(0, voteDataGroup, idDataGroup);
  };

  const getData = async page_count => {
    setLoading(true); //will be needed later to show preloader if needed
    let res = await axios
      .get("https://hn.algolia.com/api/v1/search?page=0&hitsPerPage=1000")
      .then(res => {
        ////console.log(res.data);
        let data = res.data;
        setTotalPostData(data.hits);
        allPostData = data.hits;

        setLoading(false); //will be needed later to show preloader if needed
        //console.log("data = ", data);

        // setTimeout(function () {

        // }, 1000);

        // update graph array here
        for (var q = 0; q < data.hits.length; q++) {
          voteDataGroup.push(data.hits[q].points);
          idDataGroup.push(data.hits[q].objectID);
        }
        //console.log("gets called");
        ////console.log("voteDataGroup = ", voteDataGroup);
        ////console.log("idDataGroup = ", idDataGroup);
        updateDataset(0, voteDataGroup, idDataGroup);
      });
  };

  const onNextPageClick = e => {
    if (typeof window !== "undefined") {
      page_count = localStorage.getItem("page_count");
    }

    page_count = parseInt(page_count) + 1;
    //console.log("page_count = ", page_count);
    setIsPreviousButtonDisabled(false);
    //style of the button has to changed to enabled
    if (typeof window !== "undefined") {
      localStorage.setItem("page_count", page_count);
    }
  };
  const onPreviousPageClick = e => {
    if (typeof window !== "undefined") {
      page_count = localStorage.getItem("page_count");
    }

    page_count = parseInt(page_count) - 1;
    //console.log("page_count = ", page_count);

    if (page_count <= 0) {
      page_count = 0;
      // setIsPreviousButtonDisabled(true);
      e.target.style.color = "#808080";
      //also other properties needs to changed to make it truly disabled
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("page_count", page_count);
    }
  };

  const handleGraphUpdateOnUpvoteClick = e => {
    idDataGroup = [];
    voteDataGroup = [];
    for (var q = 0; q < currentPostInPage.length; q++) {
      voteDataGroup.push(currentPostInPage[q].points);
      idDataGroup.push(currentPostInPage[q].objectID);
    }
    ////console.log("voteDataGroup = ", voteDataGroup);
    ////console.log("idDataGroup = ", idDataGroup);
    ////console.log("currentPosts = ", currentPosts);
    ////console.log("totalPostData = ", totalPostData);
    ////console.log("allPostData = ", allPostData);
    
    ////console.log("currentPostInPage = ", currentPostInPage);
    ////console.log("e = ", e);
    
    

    //update graph to be fixed after pagination

    for (var b = 0; b < idDataGroup.length; b++) {
      if (e.id == idDataGroup[b]) {
        voteDataGroup[b] = parseInt(e.value);
        break;
      }
    }
    ////console.log("chartinstance = ", chartInstance);
    updateDataset(0, voteDataGroup, idDataGroup);
  };

  useEffect(() => {
    getData();
    //console.log("data fetch call...");
  }, []);

  return (
    <div>
      <div className="main-container">
        <div className="news-header-container">
          <div className="news-header-links">
            <a href="#" className="comments">
              Comments
            </a>
            <a href="#" className="vote-count">
              Vote Count
            </a>
            <a href="#" className="upvote">
              Upvote
            </a>
            <a href="#" className="news-details">
              News Details
            </a>
          </div>
        </div>
        <div className="news-content-container">
          <Posts
            posts={currentPosts}
            loading={loading}
            page_count={page_count}
            voteDataGroup={voteDataGroup}
            idDataGroup={idDataGroup}
            setUpdateGraphOnUpVote={setUpdateGraphOnUpVote}
            getUpvoteUpdate={getUpvoteUpdate}
          />
        </div>
        <div className="pagination-btn-container">
          {/* <div className="pagination-holder">
            
          </div> */}
          <div className="pagination-btns">
            <button
              disabled={isPreviousButtonDisabled}
              onClick={onPreviousPageClick}
              className="previous-page"
            >
              previous
            </button>
            {/* <span className="btn-separator">|</span> */}
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={totalPostData.length}
              paginate={paginate}
            />
            <button onClick={onNextPageClick} className="next-page">
              next
            </button>
          </div>
        </div>
        <div className="timeline-chart">
          <div>
            <canvas ref={chartContainer} />
          </div>
        </div>
      </div>
    </div>
  );
}
