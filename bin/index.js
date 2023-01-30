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
const meow = require('meow')
const cors = require('cors')
const cTable = require('console.table');

const log = [];

const server = (port, compressionLevel, isTest) => {
	app.use(fileUpload())
    app.use(cors())


    app.use('/', express.static(path.join(__dirname, "../site/build")))

	app.listen(port, () => {
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

		const webserver = `http://${ipaddress}:${port}`
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

    app.get("/api/testDownload", async (req, res) => 
    {
        const file = req.query.file
        dir.downloadFile(file, res).then( async (file_path) => {
   			const file_name = file_path.substring(file_path.lastIndexOf("\\")).replaceAll('\\', '')
   			const file_ext = file_name.substring(file_name.lastIndexOf(".")).replaceAll('.', '')
	        const data = fs.createReadStream(file_path);
	        const disposition = 'attachment; filename="' + file_name + '"';
	        
	        res.setHeader('Content-Type', 'application/' + file_ext);
	        res.setHeader('Content-Disposition', disposition);
	        data.pipe(res);
        })
        .catch((err) => 
        {
            console.log("error", err)
            res.sendStatus(501)
        })
    })

    app.get("/api/download", async (req, res) => 
    {
        const file = req.query.file
        dir.downloadFile(file, res).then( async (file_path) => {
   			res.download(file_path)
        })
        .catch((err) => 
        {
            console.log("error", err)
            res.sendStatus(501)
        })
    })

    app.get('/api/downloadDir', async (req, res) => 
    {
    	const directory = req.query.dir

        await dir.zipDir(directory, res, compressionLevel).then((output_path) => {
        	res.send(output_path)
        })
        .catch(err => {
            console.error("error", err)
            res.sendStatus(501)
        })
    })

    app.get('/api/downloadZipFile', async (req, res) => 
    {
    	const file = req.query.file

        await dir.zipFile(file, res, compressionLevel).then((output_path) => {
        	res.send(output_path)
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

    app.get("/api/basedir", async (req, res) => {
        res.send(base_dir)
    })

    app.get("/api/isTest", async (req, res) => {
    	res.send(isTest)
    })

    app.get("/api/showLog", async (req, res) => {
    	const file = req.query.file
    	const size = req.query.size
    	const time = req.query.time
    	const zip = req.query.zip


    	log.push({
    		file: file.substring(file.lastIndexOf("\\")).replaceAll("\\", ""),
    		size: size,
    		time: time,
    		zip: zip
    	})

    	console.table(log)
    	res.send("ok");
    })
}

const cli = meow(`
	[ Usage ]
	
		$ transify

	[ Options ]
	
		--port, -p | Run in specified port
		--compression, -c | Z-Lib compression level (0 - 9)
		--test, -t | Run to test download speed and file size
`,
{
	boolean: ['help', 'version'],
	alias: 
	{
		h: 'help',
		v: 'version' 
	},
	flags: 
	{
		port: 
		{
			type: 'number',
			default: 7777,
			alias: 'p'
		},
		compression: 
		{
			type: 'number',
			default: 5,
			alias: 'c'
		},
		test: 
		{
			type: 'boolean',
			default: false,
			alias: 't'
		}
	}
})

const port = Number.isInteger(cli.flags.port) ? cli.flags.port : undefined
const compression = Number.isInteger(cli.flags.compression) ? cli.flags.compression : undefined

if (compression == undefined || (compression > 9 || !(compression >= 0))) {
    console.log("Zip Compression Level must be a number between 0 - 9.")
    process.exit()
}

if (port == undefined || (port > 65535  || (port <= 10))) {
    console.log("Port must be a number between 1024 - 65535.")
    process.exit()
}

server(cli.flags.port, cli.flags.compression, cli.flags.test)