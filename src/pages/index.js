import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import axios from "axios";

import Chartjs from "chart.js";

let page_count;
let _chartInstance = "";

export default function Home() {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("page_count") == null) {
      page_count = 0;
      localStorage.setItem("page_count", 0);
    } else {
      page_count = localStorage.getItem("page_count");
    }
  }

  console.log("page_count = ", page_count);

  let postDataGroup = [];
  let split_array = [];

  let voteDataGroup = [];
  let idDataGroup = [];

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [postData, setPostData] = useState([]);
  const [isPreviousButtonDisabled, setIsPreviousButtonDisabled] = useState(
    false
  );
  const [shouldVoteCountUpdate, setShouldVoteCountUpdate] = useState(false);

  const chartContainer = useRef(null);
  let [chartInstance, setChartInstance] = useState(null);

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
      //console.log("newChartInstance = ", newChartInstance);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);
  // chartInstance.update();
  //console.log("chartInstance = ", chartInstance);
  _chartInstance = chartInstance;
  console.log("_chartInstance = ", _chartInstance);

  const updateDataset = (datasetIndex, newData) => {
    //console.log("chartInstance = ", _chartInstance);
    //setChartInstance(_chartInstance);
    chartInstance = _chartInstance;
    chartInstance.data.datasets[datasetIndex].data = newData;
    chartInstance.update();
  };

  const randomInt = () => Math.floor(Math.random() * (10 - 1 + 1)) + 1;

  let data_persistence_array = [];

  const onHidePostClick = e => {
    e.currentTarget.parentNode.style.display = "none";
    // console.log("nextsibling = ", e.currentTarget.parentNode.nextSibling);
    if (e.currentTarget.parentNode.nextSibling != null) {
      e.currentTarget.parentNode.nextSibling.style.display = "none";
    }
    var localStoragePageData;
    if (typeof window !== "undefined") {
      localStoragePageData = JSON.parse(
        localStorage.getItem("page_persistence_data")
      );
    }

    console.log("localStoragePageData = ", localStoragePageData);

    for (var j = 0; j < localStoragePageData.length; j++) {
      if (localStoragePageData[j].page_count == page_count) {
        let hidden_post_id_group = [];
        if (localStoragePageData[j].hidden_post_id_group) {
          hidden_post_id_group = localStoragePageData[j].hidden_post_id_group;
        }
        hidden_post_id_group.push(
          e.currentTarget.parentNode.getAttribute("id")
        );

        localStoragePageData[j].hidden_post_id_group = hidden_post_id_group;
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "page_persistence_data",
            JSON.stringify(localStoragePageData)
          );
        }

        if (typeof window !== "undefined") {
          console.log(localStorage.getItem("page_persistence_data"));
        }

        break;
      } else {
        continue;
      }
    }
  };

  const onUpvoteButtonClick = e => {
    var localStoragePageData;
    if (typeof window !== "undefined") {
      localStoragePageData = JSON.parse(
        localStorage.getItem("page_persistence_data")
      );
    }

    console.log("localStoragePageData = ", localStoragePageData);

    let each_data_holder_obj = {};
    let upvote_data_holder = [];

    let upvote_data = {};

    e.currentTarget.parentNode.parentNode.children[1].innerHTML =
      parseInt(e.currentTarget.parentNode.parentNode.children[1].innerHTML) + 1;

    //update graph

    for (var b = 0; b < idDataGroup.length; b++) {
      if (
        e.currentTarget.parentNode.parentNode.getAttribute("id") ==
        idDataGroup[b]
      ) {
        voteDataGroup[b] = parseInt(
          e.currentTarget.parentNode.parentNode.children[1].innerHTML
        );
        break;
      }
    }
    console.log("chartinstance = ", chartInstance);
    updateDataset(0, voteDataGroup);

    //============================

    setShouldVoteCountUpdate(true);

    if (localStoragePageData) {
      for (var j = 0; j < localStoragePageData.length; j++) {
        if (localStoragePageData[j].page_count == page_count) {
          upvote_data_holder = localStoragePageData[j].upvote_data_holder;
          var foundIndex = "";
          for (var k = 0; k < upvote_data_holder.length; k++) {
            // console.log(
            //   "upvote_data_holder[k].click_parent_id = ",
            //   typeof upvote_data_holder[k].click_parent_id
            // );
            // console.log(
            //   "e.currentTarget.parentNode.parentNode.getAttribute = ",
            //   typeof e.currentTarget.parentNode.parentNode.getAttribute("id")
            // );
            if (
              upvote_data_holder[k].click_parent_id ==
              e.currentTarget.parentNode.parentNode.getAttribute("id")
            ) {
              foundIndex = k;
            }
          }

          if (foundIndex != "") {
            upvote_data_holder[foundIndex].click =
              e.currentTarget.parentNode.parentNode.children[1].innerHTML;
          } else {
            upvote_data.click =
              e.currentTarget.parentNode.parentNode.children[1].innerHTML;
            upvote_data.click_parent_id = e.currentTarget.parentNode.parentNode.getAttribute(
              "id"
            );
            upvote_data_holder.push(upvote_data);
          }

          if (typeof window !== "undefined") {
            localStorage.setItem(
              "page_persistence_data",
              JSON.stringify(localStoragePageData)
            );
          }

          break;
        } else {
          if (typeof window !== "undefined") {
            each_data_holder_obj.page_count = localStorage.getItem(
              "page_count"
            );
          }

          upvote_data.click =
            e.currentTarget.parentNode.parentNode.children[1].innerHTML;
          upvote_data.click_parent_id = e.currentTarget.parentNode.parentNode.getAttribute(
            "id"
          );
          upvote_data_holder.push(upvote_data);
          each_data_holder_obj.upvote_data_holder = upvote_data_holder;
          localStoragePageData.push(each_data_holder_obj);
          //continue;
          break;
        }
      }

      setShouldVoteCountUpdate(false);
    } else {
      if (typeof window !== "undefined") {
        each_data_holder_obj.page_count = localStorage.getItem("page_count");
      }

      upvote_data.click =
        e.currentTarget.parentNode.parentNode.children[1].innerHTML;
      upvote_data.click_parent_id = e.currentTarget.parentNode.parentNode.getAttribute(
        "id"
      );
      upvote_data_holder.push(upvote_data);
      each_data_holder_obj.upvote_data_holder = upvote_data_holder;
      data_persistence_array.push(each_data_holder_obj);
      console.log("data_persistence_array = ", data_persistence_array);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "page_persistence_data",
          JSON.stringify(data_persistence_array)
        );
      }

      setShouldVoteCountUpdate(false);
    }
  };

  const onMainTextContentClick = (e, url) => {
    window.open(url, "_blank");
  };

  const createPostStructure = data => {
    for (var i = 0; i < data.length; i++) {
      let hidePost = React.createElement(
        "button",
        {
          className: "hide-post",
          "data-objectid": data[i].objectID,
          onClick: e => {
            onHidePostClick(e);
          },
        },
        "[ hide ]"
      );
      let temp_time = new Date(data[i].created_at);

      var time_string = temp_time.toString();
      var split_time_string = time_string.split(" GMT");

      // console.log("time_string = ",time_string.split(" GMT"));

      let newsPostTime = React.createElement(
        "button",
        {
          className: "news-post-time",
        },
        split_time_string[0]
      );
      let authorName = React.createElement(
        "button",
        {
          className: "news-username",
        },
        data[i].author
      );
      let by = React.createElement(
        "span",
        {
          className: "by",
        },
        "by"
      );

      if (data[i].url != null) {
        split_array = [];
        let temp_url = data[i].url;
        split_array = temp_url.split("/");
        //console.log("split_array = ", split_array);
      } else {
        //console.log("null found");
        //to do fill empty urls with demo links
      }

      //split array needs to be optimised later

      let newsLink = React.createElement(
        "button",
        {
          className: "news-link",
        },
        split_array[2]
      );

      let url = data[i].url;

      let mainNewsContent = React.createElement(
        "span",
        {
          className: "main-news-content",
          onClick: e => {
            onMainTextContentClick(e, url);
          },
        },
        data[i].title
      );

      let upvoteBtnImage = React.createElement("img", {
        src: "grey-triangle.png",
        alt: "upvote",
        className: "upvote-btn",
        onClick: e => {
          onUpvoteButtonClick(e);
        },
      });

      let upvoteBtn = React.createElement(
        "button",
        {
          className: "upvote-btn",
        },
        upvoteBtnImage
      );

      let voteCount;

      voteCount = React.createElement(
        "span",
        {
          className: "vote-count",
        },
        data[i].points
      );
      let localStoragePageData;
      if (typeof window !== "undefined") {
        //put local storage data here
        localStoragePageData = JSON.parse(
          localStorage.getItem("page_persistence_data")
        );
      }

      console.log("localStoragePageData = ", localStoragePageData);

      //update modified data in current page
      if (localStoragePageData) {
        let upvote_data_holder = [];
        for (var p = 0; p < localStoragePageData.length; p++) {
          if (localStoragePageData[p].page_count == page_count) {
            upvote_data_holder = localStoragePageData[p].upvote_data_holder;
            for (var k = 0; k < upvote_data_holder.length; k++) {
              if (upvote_data_holder[k].click_parent_id == data[i].objectID) {
                voteCount = React.createElement(
                  "span",
                  {
                    className: "vote-count",
                  },
                  upvote_data_holder[k].click
                );
                console.log(
                  "local storage data updated = ",
                  upvote_data_holder[k].click
                );
              } else {
                // voteCount = React.createElement(
                //   "span",
                //   {
                //     className: "vote-count",
                //   },
                //   data[i].points
                // );
              }
            }
          }
        }
      }

      let commentCount = React.createElement(
        "span",
        {
          className: "comments-count",
        },
        data[i].num_comments
      );

      let eachNewsContainer = React.createElement(
        "span",
        {
          className: "each-news-container",
          key: data[i].objectID,
          id: data[i].objectID,
        },
        commentCount,
        voteCount,
        upvoteBtn,
        mainNewsContent,
        newsLink,
        by,
        authorName,
        newsPostTime,
        hidePost
      );

      postDataGroup.push(eachNewsContainer);
      if (i < data.length - 1) {
        let eachPostBreak = React.createElement("br", { key: i });
        postDataGroup.push(eachPostBreak);
      }
      voteDataGroup.push(data[i].points);
      idDataGroup.push(data[i].objectID);

      //update chart after api data populates
      updateDataset(0, voteDataGroup);
    }

    //console.log("voteDataGroup = ", voteDataGroup);
    //console.log("idDataGroup = ", idDataGroup);

    setPostData(postDataGroup);
    //console.log("graph data ready?", voteDataGroup, idDataGroup);
  };

  const getData = async page_count => {
    let res = await axios.get(
      "https://hn.algolia.com/api/v1/search?page=" + page_count.toString()
    );

    let data = res.data;
    console.log("data = ", data);
    setIsDataLoaded(true); //will be needed later to show preloader if needed

    createPostStructure(data.hits);
  };

  useEffect(() => {
    getData(page_count);
    console.log("data fetch call...");
  }, []);

  const onNextPageClick = e => {
    if (typeof window !== "undefined") {
      page_count = localStorage.getItem("page_count");
    }

    page_count = parseInt(page_count) + 1;
    console.log("page_count = ", page_count);
    getData(page_count);
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
    console.log("page_count = ", page_count);

    if (page_count <= 0) {
      page_count = 0;
      // setIsPreviousButtonDisabled(true);
      e.target.style.color = "#808080";
      //also other properties needs to changed to make it truly disabled
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("page_count", page_count);
    }

    getData(page_count);
  };

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
          <div className="each-post">{postData}</div>
        </div>
        <div className="pagination-btn-container">
          <div className="pagination-btns">
            <button
              disabled={isPreviousButtonDisabled}
              onClick={onPreviousPageClick}
              className="previous-page"
            >
              previous
            </button>
            <span className="btn-separator">|</span>
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
