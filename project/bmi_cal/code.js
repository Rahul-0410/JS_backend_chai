const form=document.querySelector("form");

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    //inside beacuse we want the values only when use clciks calculate button
    const ht=parseInt(document.querySelector('#height').value);
    const wt=parseInt(document.querySelector('#weight').value);
    const res=document.querySelector('#results');
    if(ht==='' || ht<0 || isNaN(ht)){
        res.innerHTML="Please give a valid height";
    }
    else if(wt==='' || wt<0 || isNaN(wt)){
        res.innerHTML="Please give a valid weight";
    } else{
        const bmi=(wt/((ht*ht)/10000)).toFixed(2);
        let comnt;
        if(bmi<18.6){
            comnt="Under weight";
        }else if(bmi>18.6 && bmi<24.9){
            comnt="Normal range";
        } else{
            comnt="Overweight"
        }
        res.innerHTML=`<span>${bmi} and you are ${comnt} category</span>`;
    }
})