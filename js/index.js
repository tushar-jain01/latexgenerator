function maxX(a,b){
    if(a>b)return a;
    else return b;
}
function clearcode(){
    document.getElementById("latex").innerHTML="";
}
function copycode(){
    var copyText = document.getElementById("latex");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}
function generateverilog(){
    var mins = document.getElementById("minterms").value;
    var m = mins.split(',').map(Number);
    var variables = document.getElementById("variables").value.split(',');
    m.sort(function(a, b){return a - b});
    var vcode = "module func(";
    document.getElementById("latex").innerHTML= vcode;
}
function generatelatex(){
    var code =  "\\documentclass{standalone}"
                +"\n\\usepackage{circuitikz}"
                +"\n\\ctikzset{logic ports=ieee}"
                +"\n\\begin{document}"
                +"\n\\begin{circuitikz}";
    var mins = document.getElementById("minterms").value;
    var m = mins.split(',').map(Number);
    var variables = document.getElementById("variables").value.split(',');
    m.sort(function(a, b){return a - b});
    var max = m[m.length-1];
    code=code+"\n \\draw";
    var count = 0;
    while(max){
        count++;
        max/=2;
    }
    //drawing NMOS circuit
    var x = 0;  var y = 0;
    for( var i =0 ;i<m.length;i++){
        var curr = m[i];
        for(var j=variables.length-1;j>=0;j--){
            if(curr%2==1){
                code = code + "\n" + "("+x+","+y+") node[nmos](n"+i+"_"+j+"){}";
                code = code + "\n" + "(n"+i+"_"+j+".gate) node[anchor=east]{$"+variables[j]+"$}";
                y=y+1.6; 
            }
            else{
                code = code + "\n" + "("+x+","+y+") node[nmos](n"+i+"_"+j+"){}";
                code = code + "\n" + "(n"+i+"_"+j+".gate) node[anchor=east]{$\\bar{"+variables[j]+"}$}    ";
                y=y+1.60; 
            }
            curr=Math.floor(curr/2);
        }
        x=x+2;y=0;
    }
    for(var k = 0;k<m.length;k++){
        for(var l = variables.length-1;l>=1;l--){
            code = code + "\n" + "(n"+k+"_"+l+".drain)--(n"+k+"_"+(l-1)+".source)";
        }
    }
    code=code + "\n" + "(n"+0+"_"+(variables.length-1)+".source)--(n"+(m.length-1)+"_"+(variables.length-1)+".source)";
    code=code + "\n" + "(n"+0+"_"+0+".drain)--(n"+(m.length-1)+"_"+(0)+".drain)";
    //drawing CMOS circuit
    x = 0; y= 1.60*variables.length+3;
    for( var i =0 ;i<m.length;i++){
        var curr = m[i];
        for(var j=variables.length-1;j>=0;j--){
            if(curr%2==1){
                code = code + "\n" + "("+x+","+y+") node[pmos](p"+i+"_"+j+"){}";
                code = code + "\n" + "(p"+i+"_"+j+".gate) node[anchor=east]{$"+variables[j]+"$}";
                x=x+2; 
            }
            else{
                code = code + "\n" + "("+x+","+y+") node[pmos](p"+i+"_"+j+"){}";
                code = code + "\n" + "(p"+i+"_"+j+".gate) node[anchor=east]{$\\bar{"+variables[j]+"}$}    ";
                x=x+2 
            }
            curr=Math.floor(curr/2);
        }
        x=0;y=y+2.5;
    }
    for(var o = 0;o<=m.length-1;o++){
        code=code + "\n" + "(p"+o+"_"+(variables.length-1)+".source)--(p"+(o)+"_"+(0)+".source)";
        code=code + "\n" + "(p"+o+"_"+(variables.length-1)+".drain)--(p"+(o)+"_"+(0)+".drain)";
    }
    for(var o = 0;o<=m.length-2;o++){
        if(variables.length%2==0)
        code=code + "\n" + "(p"+o+"_"+Math.ceil((variables.length)/2)+".source)++(1,0)--++(0,0.95)";
        else
        code=code + "\n" + "(p"+o+"_"+Math.floor((variables.length)/2)+".source)--++(0,0.95)";
        //code=code + "\n" + "(p"+o+(variables.length-1)+".drain)--(p"+(o)+(0)+".drain)";
    }
    if(variables.length%2==0){
        code=code + "\n" + "(p"+(m.length-1)+"_"+Math.ceil((variables.length)/2)+".source)++(1,0)--++(0,0.5)node[vcc]{Vcc}";
        code=code + "\n" + "(p"+(0)+"_"+Math.ceil((variables.length)/2)+".drain)++(1,0)--++(0,-3.05)";
        code=code + "\n" + "(p"+0+"_"+Math.floor((variables.length)/2)+".drain)++(1,0)++(0,-1.525)node[circ]{}--++("+(maxX(variables.length,m.length)+2)+",0)node[circ](nn){}";
    }
    else{
        code=code + "\n" + "(p"+(m.length-1)+"_"+Math.floor((variables.length)/2)+".source)--++(0,0.5)node[vcc]{Vcc}";
        code=code + "\n" + "(p"+0+"_"+Math.floor((variables.length)/2)+".drain)--++(0,-3.05)";
        code=code + "\n" + "(p"+0+"_"+Math.floor((variables.length)/2)+".drain)++(0,-1.525)node[circ]{}--++("+(maxX(variables.length,m.length)+2)+",0)node[circ](nn){}";
    }
    if(m.length%2==0){
        code=code + "\n" + "(n"+Math.floor((m.length-1)/2)+"_"+(variables.length-1)+".drain)++(1,0)++(0,-1.55)node[ground]{}";
    }
    else{
        code=code + "\n" + "(n"+Math.floor(m.length/2)+"_"+(variables.length-1)+".drain)++(0,-1.55)node[ground]{}";
    }
    code = code+"\n"+"(nn)|-++(1,4)--++(0,2)--++(1,0)node[pmos,anchor=west](pf){}\n"
            + "(nn)|-++(1,4)--++(0,-2)--++(1,0)node[nmos,anchor=west ](nf){}\n"
            + "(pf.drain)--(nf.drain)\n"
            + "(pf.source)--++(0,1)node[vcc]{Vcc}\n"
            + "(nf.source)node[ground]{}\n"
            + "(nn)++(1,4)++(2,0)node[circ]{}--++(1,0)node[ocirc,anchor=west]{Y=Output}++(3,0)node[]{}";


    code = code+"\n;\n\\end{circuitikz}\n\\end{document}";
    document.getElementById("latex").innerHTML=code;         
}