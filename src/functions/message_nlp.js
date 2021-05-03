keywords = ["help", "get", "give", "add", "search","google", "read", "want", "need", "play","tictactoe","game","bored"];
pic = ["pics", "pictures", "images", "notes", "image", "picture"];
tag = ["tags", "tag"];
ignore = [
  "the",
  `I'm`,
  "im",
  "Im",
  "want",
  "quick",
  "to",
  "following",
  "with",
  "exam_bot",
  "them",
  "for",
  "me",
  "my",
  "exam",
  "internals",
  "quiz",
  "coming",
  "tomorrow",
  "today",
  "commands",
  "now",
  "you",
  "can",
  " ",
  "please",
  "and",
  "these",
  "this",
  "",
  "database",
  "data",
  "in",
  "to",
  "above",
  "of",
  "from",
  "I",
  "i",
  "gonna",
  "fail",
  "plsss",
];

function nlp_message(st) {
  message = "$";
  keyword = "";
  picture = 0;
  number_keywords = 0;
  tags = [];
  st = st.toLowerCase();
  st = st.replace(/[^a-zA-Z0-9 ]/g, "");
  st = st.split(" ");
  st.forEach(function (value) {
    if (keywords.includes(value)) {
      keyword = value;
      number_keywords = number_keywords + 1;
    } else if (pic.includes(value)) {
      tags_or_pics = 1;
      picture = 1;
    } else if (tag.includes(value)) {
      tags_or_pics = 0;
    } else if (ignore.includes(value)) {
      keyword = keyword;
    } else {
      tags.push(value);
    }
  });

  console.log(keyword)

  if (number_keywords == 0) {
    return "$invalid";
  }
  if (keyword == "help" || keyword == "read" || keyword == "search") {
    return "$" + keyword;
  }
  if (keyword == "add") {
    if (tags_or_pics == 0 && picture == 0) {
      message = "$addTags";
      tags.forEach(function (v) {
        message = message + " " + v;
      });
      return message;
    } else if (tags_or_pics == 1 || picture == 1) {
      message = "$addPic";
      tags.forEach(function (v) {
        message = message + " " + v;
      });
      return message;
    } else {
      return "$help";
    }
  }
  if (keyword == "get" || keyword == "want" || keyword == "need") {
    message = "$getPic";
    tags.forEach(function (v) {
      message = message + " " + v;
    });
    return message;
  }
  if(keyword == "play" || keyword == "tictactoe" || "bored"){
      return "$game"
  }
}
module.exports = nlp_message;
