export const changeStyle=(obj)=>{
  for(let key in obj){
      document.getElementsByTagName('body')[0].style.setProperty(`--${key}`, obj[key]);
  }
}