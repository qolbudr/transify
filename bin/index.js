#! /usr/bin/env node

const qrcode = require('qrcode-terminal')
const fs = require('fs')
const os = require('os')
const path = require('path')
const express = require("express")
const app = express()
const dir = require('./utils/dir')
const base_dir = process.cwd()
const fileUpload = require("express-fileupload")

const server = () => {
	app.use(fileUpload())
	
	app.listen(7777, () => {
		let ipaddress
		let interfaces = os.networkInterfaces()
		
		for(let interfaceType in interfaces)
		{
			interfaces[interfaceType].filter((details) => 
			{
				if(details.family === 'IPv4' && !details.internal && interfaceType === 'Wi-Fi') 
				{
					ipaddress = details.address
				}
			})
		}

		process.stdout.write('\033c') // command to clear console

		const webserver = `http://${ipaddress}:7777`
		console.log("======================================================")
		console.log(`Scan this QRCode or goto ${webserver}`)
		console.log("\n")
		qrcode.generate(webserver)
		console.log("\n")
		console.log("======================================================")
	})

	app.get("/api/files", async (req, res) => {
		let directory

		if (req.query.path && req.query.path !== "undefined") 
		{
            directory = path.join(base_dir, req.query.path)
        } 
        else 
        {
            directory = base_dir
        }

        if(!dir.checkPathOK(directory))
        {
            console.error("Path attempting to go back. dir: ", dir)
            res.sendStatus(403)
        }

        dir.fetchDir(directory).then((results) => 
        {
            res.send(results)
        })
        .catch((err) => 
        {
            console.error("Error browsing files", err)
            res.sendStatus(501)
        })
    })

    app.get("/api/download", async (req, res) => 
    {
        const file = req.query.file
        dir.downloadFile(file, res).then((file_path) => {
   			res.download(file_path)
        })
        .catch((err) => 
        {
            console.error("error", err)
            res.sendStatus(501)
        })
    })

    app.get('/api/downloadDir', async (req, res) => 
    {
    	const directory = req.query.dir

    	if(!dir.checkPathOK(directory))
        {
            console.error("Path attempting to go back. dir: ", dir)
            res.sendStatus(403)
        }

        await dir.zipDir(directory, res).then((output_path) => {
                
        })
        .catch(err => {
            console.error("error", err)
            res.sendStatus(501)
        })
    })

    app.post("/api/upload", async (req, res) => {

        dir.uploadFile(req, res).then(() => {
        	
        })
        .catch((err) => {
            console.error("upload error", err)
            res.sendStatus(501)
        })
    })
}


server()