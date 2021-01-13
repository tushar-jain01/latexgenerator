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
function generateandor(){
    var mins = document.getElementById("minterms").value;
    var m = mins.split(',').map(Number);
    var variables = document.getElementById("variables").value.split(',');
    m.sort(function(a, b){return a - b});
    var vcode ="\\documentclass{standalone}"
                +"\n\\usepackage{circuitikz}"
                +"\n\\ctikzset{logic ports=ieee}"
                +"\n\\begin{document}"
                +"\n\\begin{circuitikz}"
                +"\n\\draw[color=blue]";
    var x = 0; var y = 0;
    for(var i = 0;i < m.length;i++){
        vcode = vcode+"\n"+"("+x+","+y+")node[and port,scale="+maxX(1.5,variables.length/2 - 1)+",color=red,number inputs ="+variables.length+"](and"+i+"){}";
        var curr=m[i];
        for(var j=variables.length-1;j>=0;j--){
            if(curr%2==1){
                vcode = vcode + "\n" + "(and"+i+".in "+(j+1)+")--++(-1,0)node[ocirc]{}++(-0.3,0)node[]{$"+variables[j]+"$}";
            }
            else{
                vcode = vcode + "\n" + "(and"+i+".in "+(j+1)+")--++(-1,0)node[ocirc]{}++(-0.3,0)node[]{$\\bar{"+variables[j]+"}$}";
              }
            curr=Math.floor(curr/2);
        }
        y=y+maxX(3,variables.length-2);
    }
    vcode = vcode+"\n"+"(and0.out)++("+(2*maxX(1.5,variables.length/2 - 1)+Math.floor((m.length-1)/2)+2)+","+((y-maxX(3,variables.length-2))/2)+")node[or port,scale="+maxX(1.5,variables.length/2 - 1)+",color=red,number inputs="+m.length+"](or1){}";
    x=0.5;
    for(var i=Math.floor((m.length-1)/2);i>=0;i--){
        vcode=vcode+"\n"+"(and"+i+".out)--++("+x+",0)node[](nn"+i+"){}|-(or1.in "+(m.length-i)+")";
        vcode=vcode+"\n"+"(and"+(m.length-1-i)+".out)--++("+x+",0)node[](nn"+(m.length-1-i)+"){}|-(or1.in "+(i+1)+")";
        x=x+1;
    }
    // vcode = vcode+"\n"+"("+(x+2)+","+y/2+")node[or port,color=red,number inputs="+m.length+"](or1){}";
    // for(var i=0;i<m.length;i++){
    //     vcode=vcode+"\n"+"(nn"+i+")-|(or1.in "+(m.length-i)+")";
    // }
    vcode = vcode+"\n;\n\\end{circuitikz}\n\\end{document}";
    document.getElementById("latex").innerHTML= vcode;    
}
function generateverilog(){
    var mins = document.getElementById("minterms").value;
    var m = mins.split(',').map(Number);
    var variables = document.getElementById("variables").value.split(',');
    m.sort(function(a, b){return a - b});
}
function generatecmos(){
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
    code=code+"\n \\draw[color=blue]";
    var count = 0;
    while(max){
        count++;
        max/=2;
    }
    //drawing nmos circuit
    var x = 0;  var y = 0;
    for( var i =0 ;i<m.length;i++){
        var curr = m[i];
        for(var j=variables.length-1;j>=0;j--){
            if(curr%2==1){
                code = code + "\n" + "("+x+","+y+") node[nmos,color=red](n"+i+"_"+j+"){}";
                code = code + "\n" + "(n"+i+"_"+j+".gate) node[anchor=east]{$"+variables[j]+"$}";
                y=y+2.20; 
            }
            else{
                code = code + "\n" + "("+x+","+y+") node[nmos,color=red](n"+i+"_"+j+"){}";
                code = code + "\n" + "(n"+i+"_"+j+".gate) node[anchor=east]{$\\bar{"+variables[j]+"}$}    ";
                y=y+2.20; 
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
    //drawing pmos circuit
    x = 0; y= 2.20*variables.length+3;
    for( var i =0 ;i<m.length;i++){
        var curr = m[i];
        for(var j=variables.length-1;j>=0;j--){
            if(curr%2==1){
                code = code + "\n" + "("+x+","+y+") node[pmos,color=red](p"+i+"_"+j+"){}";
                code = code + "\n" + "(p"+i+"_"+j+".gate) node[anchor=east]{$"+variables[j]+"$}";
                x=x+2; 
            }
            else{
                code = code + "\n" + "("+x+","+y+") node[pmos,color=red](p"+i+"_"+j+"){}";
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
        code=code + "\n" + "(p"+(0)+"_"+Math.ceil((variables.length)/2)+".drain)++(1,0)--++(0,-3.65)";
        code=code + "\n" + "(p"+0+"_"+Math.floor((variables.length)/2)+".drain)++(1,0)++(0,-1.825)node[circ]{}--++("+(maxX(variables.length,m.length)+2)+",0)node[circ](nn){}";
    }
    else{
        code=code + "\n" + "(p"+(m.length-1)+"_"+Math.floor((variables.length)/2)+".source)--++(0,0.5)node[vcc]{Vcc}";
        code=code + "\n" + "(p"+0+"_"+Math.floor((variables.length)/2)+".drain)--++(0,-3.65)";
        code=code + "\n" + "(p"+0+"_"+Math.floor((variables.length)/2)+".drain)++(0,-1.825)node[circ]{}--++("+(maxX(variables.length,m.length)+2)+",0)node[circ](nn){}";
    }
    if(m.length%2==0){
        code=code + "\n" + "(n"+Math.floor((m.length-1)/2)+"_"+(variables.length-1)+".drain)++(1,0)++(0,-1.55)node[ground]{}";
    }
    else{
        code=code + "\n" + "(n"+Math.floor(m.length/2)+"_"+(variables.length-1)+".drain)++(0,-1.55)node[ground]{}";
    }
    code = code+"\n"+"(nn)|-++(1,4)--++(0,2)--++(1,0)node[pmos,color=red,anchor=west](pf){}\n"
            + "(nn)|-++(1,4)--++(0,-2)--++(1,0)node[nmos,color=red,anchor=west ](nf){}\n"
            + "(pf.drain)--(nf.drain)\n"
            + "(pf.source)--++(0,1)node[vcc]{Vcc}\n"
            + "(nf.source)node[ground]{}\n"
            + "(nn)++(1,4)++(2,0)node[circ]{}--++(1,0)node[ocirc,anchor=west]{Y=Output}++(3,0)node[]{}";

    
    code=   code+"\n"+"(or1.out)--++(1,0)node[ocirc,anchor=east]{$Y$}++(0.5,0)node[]{}";
    code = code+"\n;\n\\end{circuitikz}\n\\end{document}";
    document.getElementById("latex").innerHTML=code;         
}
function generatenortwolvl(){
    var mins = document.getElementById("minterms").value;
    var m = mins.split(',').map(Number);
    var variables = document.getElementById("variables").value.split(',');
    m.sort(function(a, b){return a - b});
    var vcode ="\\documentclass{standalone}"
                +"\n\\usepackage{circuitikz}"
                +"\n\\ctikzset{logic ports=ieee}"
                +"\n\\begin{document}"
                +"\n\\begin{circuitikz}"
                +"\n\\draw[color=blue]";
    var x = 0; var y = 0;
    for(var i = 0;i < m.length;i++){
        vcode = vcode+"\n"+"("+x+","+y+")node[nor port,scale="+maxX(1.5,variables.length/2 - 1)+",color=red,number inputs ="+variables.length+"](nor"+i+"){}";
        var curr=m[i];
        for(var j=variables.length-1;j>=0;j--){
            if(curr%2==1){
                vcode = vcode + "\n" + "(nor"+i+".in "+(j+1)+")--++(-1,0)node[ocirc]{}++(-0.3,0)node[]{$"+variables[j]+"$}";
            }
            else{
                vcode = vcode + "\n" + "(nor"+i+".in "+(j+1)+")--++(-1,0)node[ocirc]{}++(-0.3,0)node[]{$\\bar{"+variables[j]+"}$}";
              }
            curr=Math.floor(curr/2);
        }
        y=y+maxX(3,variables.length-2);
    }
    vcode = vcode+"\n"+"(nor0.out)++("+(2*maxX(1.5,variables.length/2 - 1)+Math.floor((m.length-1)/2)+2)+","+((y-maxX(3,variables.length-2))/2)+")node[nor port,scale="+maxX(1.5,variables.length/2 - 1)
            +",color=red,number inputs="+m.length+"](nnor1){}";
    x=0.5;
    for(var i=Math.floor((m.length-1)/2);i>=0;i--){
        vcode=vcode+"\n"+"(nor"+i+".out)--++("+x+",0)node[](nn"+i+"){}|-(nnor1.in "+(m.length-i)+")";
        vcode=vcode+"\n"+"(nor"+(m.length-1-i)+".out)--++("+x+",0)node[](nn"+(m.length-1-i)+"){}|-(nnor1.in "+(i+1)+")";
        x=x+1;
    }
    // vcode = vcode+"\n"+"("+(x+2)+","+y/2+")node[nor port,color=red,number inputs="+m.length+"](nnor1){}";
    // for(var i=0;i<m.length;i++){
    //     vcode=vcode+"\n"+"(nn"+i+")-|(nor1.in "+(m.length-i)+")";
    // }
    
    vcode=vcode+"\n"+"(nnor1.out)--++(1,0)node[ocirc,anchor=east]{$Y$}++(0.5,0)node[]{}";
    vcode = vcode+"\n;\n\\end{circuitikz}\n\\end{document}";
    document.getElementById("latex").innerHTML= vcode;    
}
function generatenandtwolvl(){
    var mins = document.getElementById("minterms").value;
    var m = mins.split(',').map(Number);
    var variables = document.getElementById("variables").value.split(',');
    m.sort(function(a, b){return a - b});
    var vcode ="\\documentclass{standalone}"
                +"\n\\usepackage{circuitikz}"
                +"\n\\ctikzset{logic ports=ieee}"
                +"\n\\begin{document}"
                +"\n\\begin{circuitikz}"
                +"\n\\draw[color=blue]";
    var x = 0; var y = 0;
    for(var i = 0;i < m.length;i++){
        vcode = vcode+"\n"+"("+x+","+y+")node[nand port,scale="+maxX(1.5,variables.length/2 - 1)+",color=red,number inputs ="+variables.length+"](nand"+i+"){}";
        var curr=m[i];
        for(var j=variables.length-1;j>=0;j--){
            if(curr%2==1){
                vcode = vcode + "\n" + "(nand"+i+".in "+(j+1)+")--++(-1,0)node[ocirc]{}++(-0.3,0)node[]{$"+variables[j]+"$}";
            }
            else{
                vcode = vcode + "\n" + "(nand"+i+".in "+(j+1)+")--++(-1,0)node[ocirc]{}++(-0.3,0)node[]{$\\bar{"+variables[j]+"}$}";
              }
            curr=Math.floor(curr/2);
        }
        y=y+maxX(3,variables.length-2);
    }
    vcode = vcode+"\n"+"(nand0.out)++("+(2*maxX(1.5,variables.length/2 - 1)+Math.floor((m.length-1)/2)+2)+","+((y-maxX(3,variables.length-2))/2)+")node[nand port,scale="+maxX(1.5,variables.length/2 - 1)+",color=red,number inputs="+m.length+"](nnand1){}";
    x=0.5;
    for(var i=Math.floor((m.length-1)/2);i>=0;i--){
        vcode=vcode+"\n"+"(nand"+i+".out)--++("+x+",0)node[](nn"+i+"){}|-(nnand1.in "+(m.length-i)+")";
        vcode=vcode+"\n"+"(nand"+(m.length-1-i)+".out)--++("+x+",0)node[](nn"+(m.length-1-i)+"){}|-(nnand1.in "+(i+1)+")";
        x=x+1;
    }
    vcode=vcode+"\n"+"(nnand1.out)--++(1,0)node[ocirc,anchor=east]{$Y$}++(0.5,0)node[]{}";
    // vcode = vcode+"\n"+"("+(x+2)+","+y/2+")node[nand port,color=red,number inputs="+m.length+"](nnand1){}";
    // for(var i=0;i<m.length;i++){
    //     vcode=vcode+"\n"+"(nn"+i+")-|(nand1.in "+(m.length-i)+")";
    // }
    vcode = vcode+"\n;\n\\end{circuitikz}\n\\end{document}";
    document.getElementById("latex").innerHTML= vcode;    
}
