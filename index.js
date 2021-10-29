const express = require('express')
require('dotenv').config()
const { MongoClient, ConnectionPoolClosedEvent } = require('mongodb');
const app = express()
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const port = process.env.PORT || 5000;


app.use(cors ())
app.use(express.json())
// user name; arabin
// password : K2oLokApDtuZ99Es
const uri = `mongodb+srv://${process.env.DB_USER }:${process.env.DB_PASS}@cluster0.dvpuo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run (){
	try{
		await client.connect()
		const database = client.db("geniusMechanic")
		const servicesCollection = database.collection("service")
		// get api
		app.get('/services',async (req,res)=>{
			const cursor = servicesCollection.find({});
			const services = await cursor.toArray();
			res.send(services)
		})
		// GET SINGLE API
		app.get ('/services/:id', async (req,res)=>{
			const id = req.params.id
			
			const query = {_id:ObjectId(id)}
			const service = await servicesCollection.findOne(query)
			res.json(service)
		})

		app.post('/services', async(req,res)=>{
			const service = req.body
			console.log('hitting the post', service)

			
			const result = await servicesCollection.insertOne(service)
		 	console.log(result)
			 res.json(result)
		 

		})
		// delete APi
		app.delete('/services/:id',async(req,res)=>{
			const id = req.params.id
			console.log('hitting the delete post',id)
			const query ={_id:ObjectId(id)};
			const result =await servicesCollection.deleteOne(query)
			res.json(result)
		})
		
	}
	finally{
		// await client .close()
	}
}
run().catch(console.dir);

app.get('/',(req,res)=>{
	res.send('hitting the post')
})
app.get('/hallow', (req,res)=>{
	res.send('hallow update here')
})



app.listen(port,()=>{
	console.log('listen the port and express',port)
})