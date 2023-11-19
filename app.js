const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

let items =["making food", "coding", "eating"];
let workitems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.set('strictQuery',false);
mongoose.connect("mongodb+srv://thanseer:thanseer%4020@cluster0.hqtgdff.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item ({
    name: "Eat food"
});


const item2 = new Item ({
    name: "Do exercise"
});

const item3 = new Item ({
    name: "Drink water"
});

const defaultArray = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

    Item.find({}, function(err, founditems){

          if (founditems.length === 0){
            Item.insertMany(defaultArray, function(err){
            if (err) {
               console.log(err);
            } else {
                console.log("succesfully created");
            }
            });
            res.redirect("/")
        }  else {
            res.render("list", {Listtitle: "Today", newlistitems :founditems});
        }
    });
});


app.post("/", function(req, res){

    const itemName = req.body.new_item
    const listname = req.body.list

    const newitem = new Item({
        name: itemName
    });

    if (listname === "Today"){
        newitem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listname}, function(err, foundlist){
            foundlist.items.push(newitem)
            foundlist.save()
            res.redirect("/" + listname);
        });
    }

  
});

app.get("/:todoName", function(req, res){
     const CustomListName = req.params.todoName;

     List.findOne({name:CustomListName}, function(err, foundlist){
        if (!err) {
            if (!foundlist) {
               //create a new list 
               const list = new List ({
                name: CustomListName,
                items: defaultArray
            });
            list.save();
            res.redirect("/" + CustomListName);
            } else {
               res.render("list",  {Listtitle: foundlist.name, newlistitems :foundlist.items});
            }
        }

     });



});


app.get("/about", function(req, res){
    res.render("about");
});

app.post("/delete", function(req, res){
    const checkedItemid= req.body.checkbox;
    Item.findByIdAndRemove(checkedItemid, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("succesfully deleted");
        }
        res.redirect("/")
    })
});


// app.post("/work", function(req, res){
//     let item = req.body.new_item
//     workitems.push(item)
//     res.redirect("/work")
// })

app.listen(3000, function(){
    console.log("server running on port 3000");
})