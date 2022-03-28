function del(id){
	fetch("http://localhost:3400/delete/"+id, {method:'DELETE'})
	.then(res=>{console.log("hi"})
}

function upd(e,id){
	e.preventDefault();
	//console.log(id);
	var obj = {
		item : document.f1.item.value,
		serve : document.f1.serve.value,
		price : document.f1.price.value,
		remarks : document.f1.remarks.value,
		location : document.f1.location.value
		delivery : document.f1.delivery.value
	}
	console.log(obj)
	
	fetch('http://localhost:3400/updatefood/'+id,
	{
		method:'PUT',
		headers:{
			'Content-Type':'application/json',
		},
		body: JSON.stringify(obj),
	})
	.then(res=>{
		//window.location.href="http://localhost:3400/myfood"
		console.log("wait");
		})
}