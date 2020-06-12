import React, { useState } from "react";

const Posts = ({
  posts,
  loading,
  page_count,
  voteDataGroup,
  idDataGroup,
  setUpdateGraphOnUpVote,
  getUpvoteUpdate,
}) => {
  // //console.log("setVoteDataGroup = ", setVoteDataGroup);
  let split_array = [];
  // let page_count;
  let postDataGroup = [];
  let data_persistence_array = [];
  const [shouldVoteCountUpdate, setShouldVoteCountUpdate] = useState(false);
  // const [shouldGraphUpdate, setShouldGraphUpdate] = useState(false);
  //let voteDataGroup = [];
  //let idDataGroup = [];

  const onMainTextContentClick = (e, url) => {
    window.open(url, "_blank");
  };

  const createPostStructure = data => {
    ////console.log("comes here");
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

      // //console.log("time_string = ",time_string.split(" GMT"));

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
        ////console.log("split_array = ", split_array);
      } else {
        ////console.log("null found");
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
        ////console.log("local storage created!");
        //put local storage data here
        localStoragePageData = JSON.parse(
          localStorage.getItem("page_persistence_data")
        );
      }

      ////console.log("localStoragePageData = ", localStoragePageData);
      let upvote_data_holder = [];
      //update modified data in current page
      if (localStoragePageData) {
        for (var p = 0; p < localStoragePageData.length; p++) {
          if (localStoragePageData[p].page_count == page_count) {
            upvote_data_holder = localStoragePageData[p].upvote_data_holder;
            if (upvote_data_holder) {
              for (var k = 0; k < upvote_data_holder.length; k++) {
                if (upvote_data_holder[k].click_parent_id == data[i].objectID) {
                  voteCount = React.createElement(
                    "span",
                    {
                      className: "vote-count",
                    },
                    upvote_data_holder[k].click
                  );
                  //console.log(
                  // "local storage data updated = ",
                  // upvote_data_holder[k].click
                  //);
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
      }
      let comment_data = data[i].num_comments;
      if (comment_data == null) {
        comment_data = "-NA-";
      }
      let commentCount = React.createElement(
        "span",
        {
          className: "comments-count",
        },
        comment_data
      );
      let eachNewsContainer;

      eachNewsContainer = React.createElement(
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

      ////console.log("eachNewsContainer = ", eachNewsContainer);

      //update modified data in current page
      if (localStoragePageData) {
        let hidden_post_id_group = [];
        for (var z = 0; z < localStoragePageData.length; z++) {
          hidden_post_id_group = localStoragePageData[z].hidden_post_id_group;
          //console.log("hidden_post_id_group = ", hidden_post_id_group);

          for (var w = 0; w < hidden_post_id_group.length; w++) {
            if (hidden_post_id_group[w] == data[i].objectID) {
              //console.log("comes in hidden");
              eachNewsContainer = React.createElement(
                "span",
                {
                  className: "each-news-container-hidden",
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
            }
          }
        }
      }

      postDataGroup.push(eachNewsContainer);
      if (i < data.length - 1) {
        let eachPostBreak = React.createElement("br", { key: i });
        postDataGroup.push(eachPostBreak);
      }
      //voteDataGroup.push(data[i].points); //to be fixed after pagination
      //idDataGroup.push(data[i].objectID); //to be fixed after pagination

      //setShouldGraphUpdate(true);
    }

    //getVoteDataGroupChange(voteDataGroup);
    //getIdDataGroupChange(idDataGroup);
    // setIdDataGroup(idDataGroup);
    // setVoteDataGroup(voteDataGroup);

    ////console.log("voteDataGroup = ", voteDataGroup);
    ////console.log("idDataGroup = ", idDataGroup);

    ////console.log("graph data ready?", voteDataGroup, idDataGroup);
  };

  createPostStructure(posts);

  const onHidePostClick = e => {
    e.currentTarget.parentNode.style.display = "none";
    // //console.log("nextsibling = ", e.currentTarget.parentNode.nextSibling);
    if (e.currentTarget.parentNode.nextSibling != null) {
      e.currentTarget.parentNode.nextSibling.style.display = "none";
    }
    var localStoragePageData;
    if (typeof window !== "undefined") {
      localStoragePageData = JSON.parse(
        localStorage.getItem("page_persistence_data")
      );
    }

    let each_data_holder_obj = {};
    let hidden_post_id_group = [];
    //console.log("localStoragePageData = ", localStoragePageData);

    if (localStoragePageData) {
      for (var j = 0; j < localStoragePageData.length; j++) {
        if (localStoragePageData[j].page_count == page_count) {
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
            //console.log(localStorage.getItem("page_persistence_data"));
          }

          break;
        } else {
          continue;
        }
      }
    } else {
      if (typeof window !== "undefined") {
        each_data_holder_obj.page_count = localStorage.getItem("page_count");
      }

      hidden_post_id_group.push(e.currentTarget.parentNode.getAttribute("id"));
      each_data_holder_obj.hidden_post_id_group = hidden_post_id_group;
      data_persistence_array.push(each_data_holder_obj);
      //console.log("data_persistence_array = ", data_persistence_array);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "page_persistence_data",
          JSON.stringify(data_persistence_array)
        );
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

    //console.log("localStoragePageData = ", localStoragePageData);

    let each_data_holder_obj = {};
    let upvote_data_holder = [];

    let upvote_data = {};

    e.currentTarget.parentNode.parentNode.children[1].innerHTML =
      parseInt(e.currentTarget.parentNode.parentNode.children[1].innerHTML) + 1;

    setUpdateGraphOnUpVote({
      id: e.currentTarget.parentNode.parentNode.getAttribute("id"),
      value: parseInt(
        e.currentTarget.parentNode.parentNode.children[1].innerHTML
      ),
    });
    getUpvoteUpdate({
      id: e.currentTarget.parentNode.parentNode.getAttribute("id"),
      value: parseInt(
        e.currentTarget.parentNode.parentNode.children[1].innerHTML
      ),
    });

    //============================

    setShouldVoteCountUpdate(true);

    if (localStoragePageData) {
      for (var j = 0; j < localStoragePageData.length; j++) {
        if (localStoragePageData[j].page_count == page_count) {
          upvote_data_holder = localStoragePageData[j].upvote_data_holder;
          var foundIndex = "";
          if (upvote_data_holder) {
            for (var k = 0; k < upvote_data_holder.length; k++) {
              // //console.log(
              //   "upvote_data_holder[k].click_parent_id = ",
              //   typeof upvote_data_holder[k].click_parent_id
              // );
              // //console.log(
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
      //console.log("data_persistence_array = ", data_persistence_array);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "page_persistence_data",
          JSON.stringify(data_persistence_array)
        );
      }

      setShouldVoteCountUpdate(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }
  return <div className="each-post">{postDataGroup}</div>;
};
export default Posts;
