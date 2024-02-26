const ejs = require('ejs');
const express =  require('express');
const app = express();
const PORT = 4200;
const path = require ('path');


require('dotenv').config();

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("./src/db/connect")

const Collection = require("./src/models/register")
// const hostdata = require("./src/models/hostadd")
const Host_Register = require("./src/models/hostadd");
app.use(cookieParser())
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname,'public/css')));
app.use(express.urlencoded({ extended : true}));

app.set('views', path.join(__dirname, './templates/views'));
const template_path = path.join(__dirname, "./templates/views");

app.set("views", template_path);


const { MongoClient, ObjectId } = require('mongodb');

;
async function FindData() {
  //-----------------------mongodb uri connection-----------------------**
  const uri = "mongodb+srv://Anshuman1992:Anshuman1992@cluster0.t4indh7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  await client.connect();

  var result = await client.db("sample_airbnb").collection("listingsAndReviews").find().limit(50).toArray();


  return result
}
// app.get('/' , async (req, res) => {

//   if(req.cookies.jwt){
//   let data = await FindData();
//   let data1 = await FindData1();
// const verify = jwt.verify(req.cookies.jwt,"sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef")
//   res.render('index', {
//     data: data,
//     data1:data1,
    
  
//   },{username:verify.name});


// }else{
//   res.render('login')
// }
// })

app.get('/', async (req, res) => {
  try {
    if (req.cookies.jwt) {
      const verify = jwt.verify(req.cookies.jwt, "sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef");
      let data = await FindData();
      let data1 = await FindData1();
      res.render('index', {
        data: data,
        data1: data1,
        username: verify.name // Passing username to the template
      });
    } else {
      res.render('login');
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
});



function requireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef", (err, decodedToken) => {
      if (err) {
        res.redirect('/login'); // Redirect to login page if token verification fails
      } else {
        // If token is valid, proceed to the next middleware or route handler
        next();
      }
    });
  } else {
    res.redirect('/login'); // Redirect to login page if no token is found
  }
}




async function hashPass(password){
  const res = await bcryptjs.hash(password,10)
  return res
}


async function compare(userPass,hashPass){
  const res = await bcryptjs.compare(userPass,hashPass)
  return res
}









app.get('/register',async (req, res) => {
  try{
  res.render('register')
}
catch(error){
  res.render('error',{error:error.message})
}
});




app.post("/register", async (req, res) => {
  try {
    const check = await Collection.findOne({ email: req.body.email });

    if (check) {
      res.send("User already exists");
    } else {



      const hashedPassword = await hashPass(req.body.password);
      const token = jwt.sign({ email: req.body.email }, "sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef");

      res.cookie("jwt",token,{
        maxAge:600000,
        httpOnly:true
      })
      const user = {
        email:req.body.email,
        username: req.body.username,
        password: hashedPassword,
        token: token,
      };

      await Collection.insertMany(user);
      res.redirect('/');
    }
  } catch (error) {
    res.send("Error: " + error.message);
   
    
  }
});







app.get('/login', (req, res) => {
  res.render('login');
});




// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await check.findOne({ email:email });

//     if (!user) {
//       return res.send("User not found"); // User does not exist
//     }

//     const isValidPassword = await bcryptjs.compare(password, user.password);

//     if (!isValidPassword) {
//       return res.send("Wrong password"); // Password does not match
//     }

//     // If both username and password are valid, set the JWT token in a cookie
//     const token = user.token; // Assuming 'token' is stored in the user document
//     res.cookie("jwt", token, {
//       maxAge: 600000,
//       httpOnly: true
//     });

//     res.redirect('/'); // Redirect to the index page upon successful login
//   } catch (error) {
//     res.render('error', { error: error.message });
//   }
// });

app.get('/' , async (req, res) => {
  let data = await FindData();
  let data1 = await FindData2();
  let x = req.cookies.jwt;
  res.render('index', {
    data: data,
    data1:data1,
    x:x, 
  });

});

async function FindData1(id) {
  //-----------------------mongodb uri connection-----------------------**
  const uri = "mongodb+srv://Anshuman1992:Anshuman1992@cluster0.t4indh7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  await client.connect();
  var result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ _id: id });
  // console.log(result);
  return result
}


// app.get('/details/:id', async (req, res) => {
      
//   let data = await FindData1(req.params.id);
 
//   res.render('details', {
//     data: data,
//   });
  
// })

app.get('/details/:id', requireAuth, async (req, res) => {
  try {
    let data = await FindData1(req.params.id);
    res.render('details', {
      data: data,
    });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});





app.get('/login', (req, res) => {
    res.render('login');
});



app.get('/help', (req, res) => {
    res.render('help');
});


// 

async function FindData2(){
  //-----------------------mongodb uri connection-----------------------**
  const uri = "mongodb+srv://Anshuman1992:Anshuman1992@cluster0.t4indh7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  
  var result1 = await client.db("userdetail").collection("host_datas").find().toArray();
  // console.log(result1);
  return result1
};


async function FindData3(HomeName) {
  const uri = "mongodb+srv://atulnew:topology@cluster0.yylrcsq.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();

  var result2 = await client.db("userdetail").collection("host_datas").findOne({HomeName});
  return result2
}
 

app.get('/host_page', async (req, res) => {
  let data2 = await FindData2();
  // console.log(data1);
  res.render('host_page', {
    data2:data2,
  });
  
});

app.get('/adduser',(req,res)=>{
  res.render('adduser')
})

app.get('/adduser',(req,res)=>{
  res.render('adduser')
})

 

app.post('/hostinform', async (req, res) => {

  const HostSchema = new Host_Register({
    HomeName: req.body.hname,
    Location: req.body.location,
    PropertyType: req.body.ptype,
    Homeurl: req.body.Imageurl,
    minimum_nights: req.body.mnights,
    neighbourhood_overview: req.body.overview,
    cancellation_policy:req.body.policy,
    Price: req.body.price,
    
  });
  const registered = await HostSchema.save();
   if(registered){
    
    res.redirect('/host_page');
  }else{
    res.redirect('/');
  }
 
});





app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data2 = await Host_Register.findById(id);

    if (!data2) {
      return res.redirect("/host_page");
    }

    res.render("edituser", {
      title: 'Edit User',
      data2: data2,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/host_page");
  }
});


app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Host_Register.findOneAndDelete({ _id: id });

    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }

    res.redirect('/host_page');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});







app.post('/hostinform/:id',async(req,res) =>{
  let id = req.params.id;
 await Host_Register.findOneAndUpdate({_id:id},{
    HomeName: req.body.hname,
    Location: req.body.location,
    PropertyType: req.body.ptype,
    Homeurl: req.body.Imageurl,
    minimum_nights: req.body.mnights,
     cancellation_policy:req.body.policy,
    Price: req.body.price,
  })
  if (id != id) {
    console.log(err);
} else {
  
    res.redirect('/host_page');
}
       
  }); 












app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });