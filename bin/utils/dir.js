'use strict'

const fs = require('fs')
const util = require('util')
const path = require('path')
const archiver = require("archiver")
const base_dir = process.cwd()
const dir = exports = module.exports = {};

dir.fetchDir = async (base_dir) => 
{
	let files;
	let jsonResult = [];
    let tempResult = [];

	const readDir = util.promisify(fs.readdir)

	try 
	{
		files = await readDir(base_dir)
	}
	catch (error)
	{
		console.error(error)
	}

	files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item)) // hide hidden files from directory

	files.forEach((file) => {
        try
        {
            let data = {}
            data['name'] = file
            let is_dir = false

            const file_path = path.join(base_dir, file)
            
            if (fs.existsSync(file_path) && fs.lstatSync(file_path).isDirectory()) // check if its folder and not empty
            {
                is_dir = true
            }

            data['dir'] = is_dir
            data['size'] = fs.lstatSync(file_path).size
            data['time'] = fs.lstatSync(file_path).birthtime.toLocaleDateString()
            data['extension'] = file.substring(file.lastIndexOf("."))
            if(is_dir) 
            {
                jsonResult.push(data)
            }
            else
            {
                tempResult.push(data)
            }
        }
        catch (e)
        {
            
        } 
    })

    jsonResult.push(...tempResult)
    return jsonResult;
}

dir.checkPathOK = (path_check) => 
{
    return !path_check.includes("..")
}

dir.downloadFile =  async (file, res) => 
{
    let file_path = path.join(base_dir, file)
    if (fs.existsSync(file_path) && fs.lstatSync(file_path).isDirectory()) 
    {
        is_dir = true
    }

    return file_path
}

dir.zipFile = async (file, res, compressionLevel) =>
{
    let archive = archiver("zip", 
	{
        zlib: { level: compressionLevel },
    })

    res.writeHead(200, 
    {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment filename=" + file + ".zip",
    })

    archive.pipe(res)
    archive.file(file)

    archive.finalize()
}

dir.zipDir = async (directory, res, compressionLevel) => 
{
	let archive = archiver("zip", 
	{
        zlib: { level: compressionLevel },
    })

    res.writeHead(200, 
    {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment filename=" + directory + ".zip",
    })

    archive.pipe(res)
    archive.directory(path.join(base_dir, directory), directory)

    archive.finalize()
}

dir.uploadFile = async (req, res) => 
{
	try
	{
		let fileData = []
		const directory = req.body.directory

		if(req.files.file && !Array.isArray(req.files.file))
		{
			let file = req.files.file
			fileData.push(await dir.moveFile(file, directory))
		}
		else
		{
			for(let i = 0; i < req.files.file.length; i++)
			{
				let file = req.files.file[i]
				fileData.push(await dir.moveFile(file, directory))
			}
		}

		res.status(200).send({
			data: fileData
		})	
	}
	catch(error)
	{
		res.sendStatus(500)	
	}	
}

dir.moveFile = async (file, directory) =>
{
	let filename = file.name
	let currentdir = path.join(base_dir, directory)

    try 
    {
        fs.accessSync(path.join(currentdir, filename))
        let name = filename.substring(0, filename.lastIndexOf("."))
        let file_extension = filename.substring(filename.lastIndexOf("."))
        filename = await dir.nonExistingName(name, file_extension, 1, currentdir)
    } 
    catch (error) 
    {
        
    }

    let full_path = path.join(currentdir, filename)
    file.mv(full_path)

    return {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
    }
}

dir.nonExistingName = async (name, file_extension, count, directory) => 
{    
    try 
    {
        fs.accessSync(path.join(directory, name) + " (" + count + ")" + file_extension)
        return await dir.nonExistingName(name, file_extension, count + 1, directory)
    }
    catch (error) 
    {

    }
    
    return name + " (" + count + ")" + file_extension
}

