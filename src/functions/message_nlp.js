keywords = ["help","get","give","add","search","read","want","need"]
pic = ["pics","pictures","images","notes","image"]
tag = ["tags","tag"]
ignore = ["the","following","with","exam_bot","them","for","me","my","exam","internals","quiz","coming","tomorrow","today","commands","now","you","can"," ","please","and","these","this",'',"database","data","in","to","above","of","from","I","i"]

function nlp_meassage(st){
    message = "$"
    keyword = ""
    tags_or_pics = 1
    number_keywords = 0
    tags = []
    st = st.toLowerCase()
    st = st.replace(/[^a-zA-Z0-9 ]/g, "");
    st = st.split(" ")
    st.forEach(function(value){
        if(keywords.includes(value)){
            keyword = value
            number_keywords = number_keywords+1
        }else if(pic.includes(value)){
            tags_or_pics = tags_or_pics + 1
        }else if(tag.includes(value)){
            tags_or_pics = tags_or_pics + Math.pow(2,tags_or_pics)
        }else if(ignore.includes(value)){
            keyword = keyword
        }else{
            tags.push(value)
        }
    });
    
    if(number_keywords != 1){
        return "$help"
    }
    if(keyword == "help" || keyword == "read" || keyword == "search"){
        return "$"+keyword
    }
    if(keyword == "add"){
        if(tags_or_pics == 3 || tags_or_pics== 4){
            message = "$addTags"
            tags.forEach(function(v){
                message = message+" "+v
        })
            return message
        }else if(tags_or_pics == 2 || tags_or_pics == 6){
            message = "$addPic"
            tags.forEach(function(v){
                message = message+" "+v
            })
            return message
        }else{
            return "$help"
        }
    }
    if(keyword == "get" || keyword == "want" || keyword == "need"){
        message = "$getPic"
            tags.forEach(function(v){
                message = message+" "+v
            })
        return message
    }
}
module.exports = nlp_meassage