/*
* Usage:
* <% some js sentence %> this part puts js sentence which will execute when render()
* {{ some data }} this part puts data which will render to template when render()
*
* TE.compile() @params String -> return Object(template)
* template.render() @params Object|JSON -> return String(actually the result html string)
* */

(function(global){
    var TE = global.TE = global.TE?global.TE:{};

    TE.compile = function(templateStr){
        var re = /(?:<%([^%>]+)%>)|(?:{{([^}]+)}})/g,
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
            if(match[2]!==undefined){
                buf.push("result+="+match[2].trim()+";\r\n");
            }else{
                buf.push(match[1].trim()+"\r\n");
            }
        }
        buf.push("result+='"+templateStr.slice(start)+"';\r\n"); //last part

        function render(locals){
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
        }

        return {
            render:render
        }
    };
})(window);
