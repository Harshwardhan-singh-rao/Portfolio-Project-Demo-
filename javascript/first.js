let score = 0.5;
let grade ;
if (score >= 90 && score <=100){
    grade = "A";
}
else if (score >= 70 && score <=80){
    grade ="B";
}
else if (score >= 50 && score <=60){
    grade ="C";
}
else if (score >= 30 && score <=40){
    grade ="D";
}
else if (score >= 10 && score <=20){
    grade ="E";
}
else if (score >= 0 && score <=0.5){
    grade ="F";
}
console.log("according to your score your grade was :" ,grade)