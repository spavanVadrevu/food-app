var express = require('express')
var app = express();
//var alert = require('alert')
//var router = express.Router();
//var popup = require('popups');


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine','pug');
app.set('views','./views');

app.use(express.static(__dirname+"/public"))

//app.use(express.static(__dirname+"/uploads"))

var myorders=[
{
	username:"sai",
	password:"sai123",
	food:[]
},
{
	username:"raki",
	password:"raki123",
	food:[]
}
]

var placedord=[
{
	username:"sai",
	password:"sai123",
	food:[]
},
{
	username:"raki",
	password:"raki123",
	food:[]
}
]

var register = [
{
	username:"sai",
	password:"sai123",
	food:[
	{
		item:"pulka",
		serve:"1", 
		price:"20",
		remarks:"famous",
		location:"mothinagar",
		delivery:"takeaway"
	},
	{
		item:"paneer",
		serve:"2",
		price:"250",
		remarks:"fresh",
		location:"srnagar",
		delivery:"takeaway"
	}
	]
},
{
	username:"raki",
	password:"raki123",
	food:[
	{
		item:"roti",
		serve:"1",
		price:"25",
		remarks:"tasty",
		location:"srnagar",
		delivery:"homedelivery"
	}
	]
	
}
]

var loc = [];
var loc_search = [];


var flag=0;
var ft=[]
register.forEach(function(us){
	us.food.forEach(function(food){
		food.user=us.username
		ft.push(food)
	})
})

var reg = {};

f=0
app.get("/regis",function(req,res){
	f=0
	register.forEach(function(user){
		if(user.username===req.query.username){
			f=1
			//window.alert("Already Registered");
			/*popup.alert({
				content: 'Already Registered'
			});*/
			//res.json("Already Registered")
			res.redirect("/register.html")
		}
	})
	if(f==0)
	{
		reg.username=req.query.username;
		reg.password=req.query.password;
		reg.food=[];
		register.push(reg);
		placedord.push(reg);
		myorders.push(reg);
		console.log(placedord);
		console.log(myorders);
		//window.alert("Successfully registered")
		/*popup.alert({
			content: 'Successfully registered'
		});*/
		res.sendFile(__dirname+"/login.html");
	}
	//console.log(register);
	
})


app.get("/authenticate",function(req,res){
	flag=0;
	//console.log(req.query)
	register.forEach(function(user,i){
		if(user.username === req.query.username && user.password === req.query.password)
		{
			flag=1;
			res.cookie('username',req.query.username)
			
			
			//res.sendFile(__dirname+"/homepage.html");
			//console.log(ft);
			res.render("home",{foo:ft})
			//res.render("ui",{tasks:user.food,username:user.username,id:i})
		}
	})
	if(flag==0)
	{
		res.sendFile(__dirname+"/login.html");
	}
})

app.get("/getfood",function(req,res){
	register.forEach(function(user,i){
		user.food.forEach(function(fc){
			loc.push(fc.location)
		})
	})
	//console.log(loc);
	//res.send("Hello")
	uniloc = [...new Set(loc)];
	loc=[];
	res.render("getfood",{loct:uniloc})
})

app.get("/addfood",function(req,res){
	user=req.cookies.username
	res.render("addfood",{user})
})

app.get("/additem",function(req,res){
	obj = {
		item:req.query.item,
		serve:req.query.serve,
		price:req.query.price,
		remarks:req.query.remarks,
		location:req.query.location,
		delivery:req.query.delivery
	}
	//console.log(obj)
	//res.send("wait")
	userid=req.query.username;
	
	register.forEach(function(use,i){
		if(use.username === userid)
		{
			
			use.food.push(obj)
			console.log(myorders)
			console.log(placedord)
		}
	})
	obj.user=userid
	ft=[...ft,obj]
	
	console.log(ft);
	res.redirect("/home");
})

app.get("/filter",function(req,res){
	selected = req.query.dropdown
	//console.log(selected);
	//res.send("wait")
	register.forEach(function(user,i){
		user.food.forEach(function(fc){
			if(fc.location === selected)
			{
				loc_search.push(fc);
			}
		})
	})
	//console.log(loc_search);
	//res.send("wait");
	res.render("loctable",{loc:loc_search})
	loc_search=[]
})

app.use(function(req,res,next){
	if(req.cookies.username){
		next();
	}
	else{
		res.sendFile(__dirname+"/login.html");
	}
})


app.get("/logout",function(req,res){
	res.clearCookie("username");
	res.sendFile(__dirname+"/login.html");
})

app.get("/login",function(req,res){
	//res.clearCookie("username");
	res.sendFile(__dirname+"/login.html");
})

app.get("/buy:key",function(req,res){
	//console.log(req.params.key);
	//res.send("wait")
	console.log(placedord);
	console.log(myorders);
	userid=req.cookies.username
	
	rec = ft[req.params.key].user
	myorders.forEach(function(user,ind){
		if(user.username===rec)
		{
			x=ft[req.params.key]
			x.cust=userid
			
			user.food.push(x)
			//console.log(user.food)
		}
	})
	
	placedord.forEach(function(user,ind){
		
		if(user.username===userid)
		{
			//console.log(ft)
			//console.log("regparams",ft[req.params.key])
			user.food.push(ft[req.params.key])
			//console.log("userfood",user.food)
			res.redirect("/home")
		}
	})
	//console.log(placedord)
	
})

app.get("/placed",function(req,res){
	userid=req.cookies.username
	placedord.forEach(function(user,ind){
		
		if(user.username===userid)
		{
			res.render("placedorder",{foo:user.food})
		}
	})
})

var myfoo=[]
app.get("/myfood",function(req,res){
	myfoo=[];
	userid=req.cookies.username
	register.forEach(function(us){
		if(us.username===userid)
		{
			//console.log(us.food)
			us.food.forEach(function(foods){
				myfoo.push(foods)
				//console.log(myfoo)
				
			})
			res.render("myfood",{foo:myfoo})
		}
	})
})

/*app.get("/editfood:key",function(req,res){
	
})*/

app.delete("/delete/:key",function(req,res){
	console.log("key",req.params.key)
	myfoo.splice(req.params.key,1)
	console.log("myfoo",myfoo);
	//res.redirect("/myfood");
	res.render("myfood",{foo:myfoo})
})

app.get("/editfood/:key",function(req,res){
	res.render("updateorder",{foo:myfoo[req.params.key],id:req.params.key})
})

app.put("/updatefood/:key",function(req,res){
	console.log("wait")
	
	myfoo[req.params.key]=req.body;
	res.render("myfood",{foo:myfoo});
})

app.get("/myorder",function(req,res){
	userid=req.cookies.username
	myorders.forEach(function(user,ind){
		
		if(user.username===userid)
		{
			res.render("myorder",{foo:user.food})
		}
	})
})


var fooditems=[]
app.get("/home",function(req,res){
	/*userid=req.cookies.username
	register.forEach(function(user,i){
		fooditems.push(user.food)
	})*/
	res.render("home",{foo:ft})
	//res.sendFile(__dirname+"/homepage.html");
})




app.listen(process.env.PORT)