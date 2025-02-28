const shoppingList=require("./Data.js")


exports.getItems=function(req,res){
    const response=[
        {message:"Here is the list of shopping items"},
        shoppingList
    ];
    res.statusCode=200
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify(response));
};

exports.createItem=function(req,res){
    let body="";

    req.on("data",function(chunk){
        body+=chunk
    });
    req.on("end",function(){
        try{
            const newItem=JSON.parse(body)

            if(!newItem.item || !newItem.quantity){
                res.statusCode=400;
                res.end(JSON.stringify({message:"Item and quantity are required"}));
                return;
            }
            shoppingList.push(newItem);

            const response=[
                {message:"Item added successfully"},
                newItem
            ];

            res.statusCode=201;
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify(response));
        }
        catch(error){
            res.statusCode=400;
            res.end(JSON.stringify({message:"Ïnvalid JSON"}));
        }
    });
};

exports.updateItem=function(req,res){
    const id=parseInt(req.params.id,10);
    let body="";

    req.on("data",function(chunk){
        body+=chunk
    });

    req.on("end",function(){
        try{
            const updateItem=JSON.parse(body);
            const index=shoppingList.findIndex(item=>item.id===id);

            if(index===-1){
                res.statusCode=404;
                res.end(JSON.stringify({message:"Item not found"}));
                return;
            }

            shoppingList[index]={...shoppingList[index],...updateItem};

            res.statusCode=200;
            res.setHeader("Content-Type","aplication/json");
            res.end(JSON.stringify({message:"Item updated Suceessfully",item:shoppingList[index]}));
        }
        catch(error){
            res.statusCode=400
            res.end(JSON.stringify({message:"Invalid JSON"}));
        }
    });
};

exports.deleteItem=function(req,res){
    const id=parseInt(req.params.id,10);
    const index=shoppingList.findIndex(item=>item.id===id);

    if(index===-1){
        res.statusCode=404;
        res.end(JSON.stringify({message:"Item not found"}));
        return;
    }
    shoppingList.splice(index,1);
    res.statusCode=200
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify({message:"Item Deleted Successfully"}))
};

exports.invaliidUrl=function(req,res){
    const availableEndpoints=[
        {method:"GET",path:"/items"},
        {method:"POST",path:"/item"},
        {method:"PUT",path:"/shopping-list/:id"},
        {method:"PATCH",path:"/shopping-list/:id"},
        {method:"DELETE",path:"/shopping-list/:id"}
    ];
    const response=[
        {message:"Invalid Endpoint,here are a few available endpoints:"},
        availableEndpoints
    ];
    res.statusCode=404;
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify(response))
};
