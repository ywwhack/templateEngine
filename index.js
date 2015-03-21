var template = function(templateStr){
    return function(locals){
        var re = /<%([^%>]+)%>/g,
            match = null,
            buf = [],
            start = 0,
            end = 0,
            result = '';

        //buf.push(htmlPart)->buf.push(jsPart) for every loop
        while(match = re.exec(templateStr)){
            end = match.index;
            buf.push("result+='"+templateStr.slice(start, end)+"';\r\n");
            start = match.index+match[0].length;
            if(templateStr[match.index+2] === '='){
                buf.push("result+="+match[1].substr(1).trim()+";\r\n");
            }else{
                buf.push(match[1].trim()+"\r\n");
            }
        }
        buf.push("result+='"+templateStr.slice(start)+"';\r\n"); //last part

        //translate variable to locals.varible
        var props = '',
            propRe = null,
            str;
        for(var i in locals){
            props += i+'|';
        }
        props = props.slice(0, -1);
        propRe = new RegExp(props, 'g');
        str = buf.join("").replace(propRe, function(){
            return 'locals.'+arguments[0];
        });
        eval(str); //execute the str
        return result;
    };
};

//example
var str =
    '<ul>' +
        '<% for(var i=0,len=names.length;i<len;i++){ %>'+
            '<li><%= names[i] %></li>'+
        '<% } %>'+
    '</ul>'+
    '<div>'+
        '<%= hobby %>'+
    '</div>';

var data = {
    names:['zank', 'ywwhack'],
    hobby:'coding'
};
console.log(template(str)(data)); //<ul><li>zank</li><li>ywwhack</li></ul><div>coding</div>

