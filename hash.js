//
window.onload = () => {   window.location.href= `${window.location.origin}/#/`;   };
window.addEventListener('hashchange', router());


async function router(){

  let path= window.location.hash.slice(1) || '/';
  console.log(window.location)

if(path=='/'){


  }else if(path=='/history'){ 
 

 }else if(path.match('/history/i')){ 


}


}



let body = document.getElementById('body');