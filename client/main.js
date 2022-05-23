let numero = 0

fetch('http://lodcalhost:3000/')
.then((res)=> res.json())
.then((data)=>{
    console.log(data)
})
// .catch((err) => {
//     console.log('error pudin ' + err)
// })
// .finally(()=> {
//     numero++
//     console.log(numero)
// })