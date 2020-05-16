function cal(){
    var sum= 0;
    var d = document.querySelectorAll('.qt');
    var p = document.querySelectorAll('.price');
    var l= d.length;
    for(var i=0;i<l;i++){
      
      sum = sum+ Number(d[i].value)* Number(p[i].innerText.substring(1));
    }
    document.querySelector("#total1").style.display = 'none';
    document.querySelector("#subtot1").style.display = 'none';
    document.querySelector("#total2").style.display = 'inline';
    document.querySelector("#subtot2").style.display = 'inline';
    
    document.querySelector("#subtot2").innerText = '$'+String(sum);
    document.querySelector("#total2").innerText = '$'+String(sum);
  }